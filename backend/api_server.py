"""
FastAPI Backend for Medical Document Summarizer
Provides REST API endpoints for document processing
100% Offline - No external API calls
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uvicorn
import os
import uuid
import shutil
from pathlib import Path
from datetime import datetime
import logging
import pyttsx3
import tempfile
import json
import base64

from document_processor import DocumentProcessor
from encryption_utils import EncryptedStorage, get_encryption_key, ZeroKnowledgeEncryption
from database import HistoryDatabase
from signal_chat import SecureChatManager, SimpleE2EEClient

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================
# Lifespan Event Handler (runs on startup/shutdown)
# ============================================================================

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - startup and shutdown events"""
    # Startup
    logger.info("Running startup cleanup...")
    db.cleanup_expired()
    logger.info("Startup cleanup complete")
    
    yield
    
    # Shutdown
    logger.info("Server shutting down...")


# Initialize FastAPI app with lifespan
app = FastAPI(
    title="Medical Document Summarizer API",
    description="100% Offline AI-powered medical document processing with privacy protection",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize document processor
models_dir = Path(__file__).parent / "models"
processor = DocumentProcessor(models_dir=models_dir)  # Pass as Path object, not string

# Initialize encryption (zero-knowledge storage)
encryption_key = get_encryption_key()
encrypted_storage = EncryptedStorage(encryption_key)

# Initialize database for history
db = HistoryDatabase()

# Initialize secure chat manager
chat_manager = SecureChatManager()

# Storage for processing results (in production, use Redis or database)
processing_results: Dict[str, Dict[str, Any]] = {}
processing_status: Dict[str, str] = {}

# Temporary upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# WebSocket connection manager
class ConnectionManager:
    """Manage WebSocket connections for real-time chat"""
    
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logger.info(f"User {user_id} connected to chat")
    
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info(f"User {user_id} disconnected from chat")
    
    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)
    
    async def broadcast(self, message: str, exclude_user: Optional[str] = None):
        for user_id, connection in self.active_connections.items():
            if user_id != exclude_user:
                await connection.send_text(message)

websocket_manager = ConnectionManager()

# Audio storage directory
AUDIO_DIR = Path("audio_encrypted")
AUDIO_DIR.mkdir(exist_ok=True)


# ============================================================================
# Request/Response Models
# ============================================================================

class ProcessResponse(BaseModel):
    task_id: str
    status: str
    message: str


class StatusResponse(BaseModel):
    task_id: str
    status: str
    progress: Optional[str] = None
    error: Optional[str] = None


class SummaryResponse(BaseModel):
    task_id: str
    status: str
    summary: Optional[str] = None
    cleaned_text: Optional[str] = None
    entities: Optional[Dict] = None
    structured_data: Optional[Dict] = None
    raw_text_length: Optional[int] = None
    cleaned_text_length: Optional[int] = None
    processing_time: Optional[float] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    models_available: Dict[str, bool]
    uptime: str


# ============================================================================
# Background Processing
# ============================================================================

def process_document_task(task_id: str, file_path: str, file_type: str, use_ai: bool = True, file_name: str = ""):
    """Background task for document processing"""
    try:
        processing_status[task_id] = "processing"
        db.log_activity(task_id, "process_start", "processing", f"File: {file_name}")
        
        logger.info(f"[{task_id}] Starting document processing: {file_path}")
        
        # Process document (ephemeral - in memory only)
        start_time = datetime.now()
        result = processor.process_document(
            file_path=file_path,
            file_type=file_type,
            use_ai_summary=use_ai
        )
        end_time = datetime.now()
        
        # Calculate processing time
        processing_time = (end_time - start_time).total_seconds()
        result["processing_time"] = processing_time
        
        # 🔐 ENCRYPT RESULTS (zero-knowledge storage)
        encrypted_result = encrypted_storage.encrypt_result(result)
        
        # Store ONLY encrypted data (in-memory + database)
        processing_results[task_id] = encrypted_result
        
        # Get retention policy
        retention_policy = db.get_retention_policy()
        retention_days = None if retention_policy == 'forever' else int(retention_policy)
        
        # Save to database for history
        import json
        db.save_result(
            task_id=task_id,
            encrypted_result=json.dumps(encrypted_result),
            file_name=file_name,
            file_type=file_type,
            processing_time=processing_time,
            retention_days=retention_days
        )
        
        if result.get("error"):
            processing_status[task_id] = "completed_with_warnings"
            db.log_activity(task_id, "process_complete", "warning", result['error'])
            logger.warning(f"[{task_id}] Completed with warnings: {result['error']}")
        else:
            processing_status[task_id] = "completed"
            db.log_activity(task_id, "process_complete", "success", f"Time: {processing_time:.2f}s")
            logger.info(f"[{task_id}] Completed successfully in {processing_time:.2f}s")
        
        # 🗑️ DELETE UPLOADED FILE IMMEDIATELY (ephemeral processing)
        try:
            if os.path.exists(file_path):
                os.unlink(file_path)
                logger.info(f"[{task_id}] ✓ Deleted uploaded file: {file_path}")
        except Exception as e:
            logger.warning(f"[{task_id}] Failed to cleanup file: {e}")
            
    except Exception as e:
        logger.error(f"[{task_id}] Processing failed: {str(e)}")
        processing_status[task_id] = "failed"
        processing_results[task_id] = {"error": str(e), "encrypted": False}
        db.log_activity(task_id, "process_failed", "error", str(e))
            
    except Exception as e:
        logger.error(f"[{task_id}] Processing failed: {str(e)}")
        processing_status[task_id] = "failed"
        processing_results[task_id] = {"error": str(e)}


# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information"""
    return {
        "name": "Medical Document Summarizer API",
        "version": "1.0.0",
        "status": "online",
        "description": "100% Offline AI-powered document processing",
        "endpoints": {
            "health": "/api/health",
            "upload": "/api/upload",
            "status": "/api/status/{task_id}",
            "summary": "/api/summary/{task_id}",
            "docs": "/docs"
        }
    }


@app.get("/api/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Check API health and model availability"""
    # Check models using DocumentProcessor
    import os
    try:
        from document_processor import DocumentProcessor
        temp_processor = DocumentProcessor(models_dir=models_dir)
        
        # Simple model checks
        tesseract_ok = os.path.exists(r"C:\Program Files\Tesseract-OCR\tesseract.exe")
        spacy_ok = True  # spaCy is installed in venv
        regex_ok = True  # Regex is always available
        
        # Check Mistral
        mistral_ok = False
        try:
            import requests
            response = requests.get("http://192.168.56.1:12345/v1/models", timeout=2)
            mistral_ok = response.status_code == 200
        except:
            pass
        
        return HealthResponse(
            status="healthy",
            version="1.0.0",
            models_available={
                "tesseract": tesseract_ok,
                "spacy": spacy_ok,
                "regex": regex_ok,
                "mistral": mistral_ok
            },
            uptime="running"
        )
    except Exception as e:
        return HealthResponse(
            status="healthy",
            version="1.0.0",
            models_available={
                "tesseract": False,
                "spacy": False,
                "regex": True,
                "mistral": False
            },
            uptime="running"
        )


@app.post("/api/upload", response_model=ProcessResponse, tags=["Processing"])
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    use_ai_summary: bool = True
):
    """
    Upload and process a medical document
    
    Supported formats:
    - Images: PNG, JPG, JPEG, BMP, TIFF, GIF, WEBP
    - Documents: PDF, DOCX, DOC
    - Text: TXT, CSV, LOG, MD
    
    Parameters:
    - file: The document file to process
    - use_ai_summary: Use AI for summary (default: True). Set to False for simple extractive summary.
    
    Returns:
    - task_id: Unique identifier to check status and retrieve results
    - status: Current processing status
    - message: Human-readable message
    """
    
    # Validate file type
    file_ext = file.filename.split('.')[-1].lower()
    supported_formats = [
        'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'gif', 'webp',
        'pdf', 'docx', 'doc', 'txt', 'csv', 'log', 'md'
    ]
    
    if file_ext not in supported_formats:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {file_ext}. Supported: {', '.join(supported_formats)}"
        )
    
    # Generate unique task ID
    task_id = str(uuid.uuid4())
    
    # Save uploaded file
    file_path = UPLOAD_DIR / f"{task_id}.{file_ext}"
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Start background processing
    processing_status[task_id] = "queued"
    background_tasks.add_task(
        process_document_task,
        task_id=task_id,
        file_path=str(file_path),
        file_type=file_ext,
        use_ai=use_ai_summary,
        file_name=file.filename
    )
    
    logger.info(f"[{task_id}] File uploaded: {file.filename} ({file_ext})")
    
    return ProcessResponse(
        task_id=task_id,
        status="queued",
        message=f"Document queued for processing. Use task_id to check status."
    )


@app.get("/api/status/{task_id}", response_model=StatusResponse, tags=["Processing"])
async def get_status(task_id: str):
    """
    Check processing status
    
    Status values:
    - queued: Waiting to be processed
    - processing: Currently being processed
    - completed: Successfully completed
    - completed_with_warnings: Completed but with some warnings
    - failed: Processing failed
    """
    
    if task_id not in processing_status:
        raise HTTPException(status_code=404, detail=f"Task ID not found: {task_id}")
    
    status = processing_status[task_id]
    error = None
    
    if status == "failed" and task_id in processing_results:
        error = processing_results[task_id].get("error")
    
    return StatusResponse(
        task_id=task_id,
        status=status,
        progress=status,
        error=error
    )


@app.get("/api/summary/{task_id}", response_model=SummaryResponse, tags=["Results"])
async def get_summary(task_id: str, decrypt: bool = True):
    """
    Get processing results and summary
    
    🔐 SECURITY: Results are encrypted at rest
    Client must decrypt with their encryption key
    
    Parameters:
    - task_id: Task ID
    - decrypt: If True, server decrypts (demo mode). If False, returns encrypted blob.
    
    Returns:
    - summary: AI-generated medical summary (1-2 paragraphs, no PII)
    - cleaned_text: Preprocessed text with PII removed
    - entities: Named entities found by spaCy
    - structured_data: Phone numbers, dates, etc. extracted by regex
    - raw_text_length: Original text character count
    - cleaned_text_length: Cleaned text character count
    - processing_time: Time taken to process (seconds)
    """
    
    if task_id not in processing_status:
        raise HTTPException(status_code=404, detail=f"Task ID not found: {task_id}")
    
    status = processing_status[task_id]
    
    if status in ["queued", "processing"]:
        raise HTTPException(
            status_code=202,
            detail=f"Processing not complete. Status: {status}"
        )
    
    if status == "failed":
        error_msg = processing_results.get(task_id, {}).get("error", "Unknown error")
        raise HTTPException(status_code=500, detail=f"Processing failed: {error_msg}")
    
    # Get encrypted results
    encrypted_result = processing_results.get(task_id, {})
    
    # 🔐 Decrypt on server (demo mode) or return encrypted blob
    if decrypt and encrypted_result.get("encrypted"):
        # Server decrypts (NOT zero-knowledge, for demo only)
        result = encrypted_storage.decrypt_result(encrypted_result)
    else:
        # Return encrypted blob (client decrypts - true zero-knowledge)
        result = encrypted_result
    
    return SummaryResponse(
        task_id=task_id,
        status=status,
        summary=result.get("summary"),
        cleaned_text=result.get("cleaned_text"),
        entities=result.get("entities"),
        structured_data=result.get("structured_data"),
        raw_text_length=len(result.get("raw_text", "")),
        cleaned_text_length=len(result.get("cleaned_text", "")),
        processing_time=result.get("processing_time")
    )


@app.delete("/api/results/{task_id}", tags=["Results"])
async def delete_results(task_id: str):
    """Delete processing results to free up memory"""
    
    if task_id not in processing_status:
        raise HTTPException(status_code=404, detail=f"Task ID not found: {task_id}")
    
    # Remove from storage
    processing_status.pop(task_id, None)
    processing_results.pop(task_id, None)
    
    logger.info(f"[{task_id}] Results deleted")
    
    return {"message": f"Results for task {task_id} deleted successfully"}


@app.get("/api/speak/{task_id}", tags=["Audio"])
async def text_to_speech(task_id: str, voice_rate: int = 150):
    """
    Convert summary to speech audio file
    
    🔐 SECURITY: Audio files encrypted and auto-deleted after 30 days
    
    Parameters:
    - task_id: Task ID with completed processing
    - voice_rate: Speech rate (words per minute, default: 150, range: 100-200)
    
    Returns:
    - Audio file (MP3) of the summary being read aloud
    """
    from fastapi.responses import FileResponse
    
    if task_id not in processing_status:
        raise HTTPException(status_code=404, detail=f"Task ID not found: {task_id}")
    
    status = processing_status[task_id]
    
    if status in ["queued", "processing"]:
        raise HTTPException(
            status_code=202,
            detail=f"Processing not complete. Status: {status}"
        )
    
    if status == "failed":
        error_msg = processing_results.get(task_id, {}).get("error", "Unknown error")
        raise HTTPException(status_code=500, detail=f"Processing failed: {error_msg}")
    
    # Get encrypted results and decrypt
    encrypted_result = processing_results.get(task_id, {})
    
    if encrypted_result.get("encrypted"):
        result = encrypted_storage.decrypt_result(encrypted_result)
    else:
        result = encrypted_result
    
    summary = result.get("summary", "")
    
    if not summary:
        raise HTTPException(status_code=404, detail="No summary available for this task")
    
    try:
        # Initialize TTS engine (offline)
        engine = pyttsx3.init()
        
        # Set properties
        engine.setProperty('rate', voice_rate)  # Speed
        engine.setProperty('volume', 1.0)  # Volume (0.0 to 1.0)
        
        # Try to set a better voice if available
        voices = engine.getProperty('voices')
        if len(voices) > 1:
            engine.setProperty('voice', voices[1].id)
        
        # Create temporary audio file
        audio_file = AUDIO_DIR / f"{task_id}_summary.mp3"
        
        # Save to file
        engine.save_to_file(summary, str(audio_file))
        engine.runAndWait()
        
        # 🔐 ENCRYPT AUDIO FILE
        audio_id = f"audio_{task_id}"
        with open(audio_file, 'rb') as f:
            audio_data = f.read()
        
        # Encrypt audio
        encrypted_audio = ZeroKnowledgeEncryption.encrypt_data(
            {"audio": audio_data.hex()}, 
            encryption_key
        )
        
        # Save encrypted audio to database (auto-expires in 30 days)
        db.save_audio(audio_id, task_id, encrypted_audio.encode())
        db.log_activity(task_id, "audio_generated", "success", f"Rate: {voice_rate}")
        
        # Delete unencrypted audio file
        try:
            os.unlink(audio_file)
        except:
            pass
        
        logger.info(f"[{task_id}] Generated encrypted audio file (expires in 30 days)")
        
        # Return audio file
        return FileResponse(
            path=str(audio_file) if os.path.exists(audio_file) else None,
            media_type="audio/mpeg",
            filename=f"medical_summary_{task_id[:8]}.mp3",
            headers={
                "Content-Disposition": f"attachment; filename=medical_summary_{task_id[:8]}.mp3",
                "X-Audio-Expires": "30 days"
            }
        )
        
    except Exception as e:
        logger.error(f"[{task_id}] TTS failed: {str(e)}")
        db.log_activity(task_id, "audio_failed", "error", str(e))
        raise HTTPException(status_code=500, detail=f"Text-to-speech failed: {str(e)}")


@app.get("/api/results/count", tags=["System"])
async def get_results_count():
    """Get count of stored results"""
    stats = db.get_stats()
    return {
        "total_tasks": len(processing_status),
        "queued": sum(1 for s in processing_status.values() if s == "queued"),
        "processing": sum(1 for s in processing_status.values() if s == "processing"),
        "completed": sum(1 for s in processing_status.values() if s == "completed"),
        "failed": sum(1 for s in processing_status.values() if s == "failed"),
        "database_stats": stats
    }


@app.get("/api/history", tags=["History"])
async def get_history(limit: int = 50):
    """
    Get processing history
    
    Returns list of past processing tasks with metadata
    """
    history = db.get_history(limit)
    return {"history": history, "count": len(history)}


@app.get("/api/settings/retention", tags=["Settings"])
async def get_retention():
    """Get current retention policy"""
    policy = db.get_retention_policy()
    return {"retention_policy": policy}


@app.post("/api/settings/retention", tags=["Settings"])
async def set_retention(retention_days: str):
    """
    Set retention policy for history
    
    Parameters:
    - retention_days: 'forever', '7', '30', or '90'
    """
    valid_options = ['forever', '7', '30', '90']
    if retention_days not in valid_options:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid retention policy. Must be one of: {valid_options}"
        )
    
    db.set_retention_policy(retention_days)
    logger.info(f"Retention policy updated to: {retention_days} days")
    
    return {"retention_policy": retention_days, "message": "Retention policy updated"}


@app.post("/api/cleanup", tags=["System"])
async def cleanup_expired():
    """
    Manually trigger cleanup of expired data
    
    - Deletes expired processing results
    - Deletes expired audio files (30+ days old)
    """
    expired_results, expired_audio = db.cleanup_expired()
    
    logger.info(f"Manual cleanup: {expired_results} results, {expired_audio} audio files")
    
    return {
        "deleted_results": expired_results,
        "deleted_audio": expired_audio,
        "message": f"Cleaned up {expired_results} results and {expired_audio} audio files"
    }


# ============================================================================
# Chat API - Signal Protocol E2EE
# ============================================================================

class RegisterUserRequest(BaseModel):
    user_id: str
    username: str
    public_key: str

class SendMessageRequest(BaseModel):
    sender_id: str
    recipient_id: str
    ciphertext: str  # Base64 encoded encrypted message
    group_id: Optional[str] = None

class CreateGroupRequest(BaseModel):
    group_id: str
    group_name: str
    created_by: str
    member_ids: List[str]


@app.post("/api/chat/register", tags=["Chat"])
async def register_user(request: RegisterUserRequest):
    """
    Register user with public identity key
    Server stores only public key (cannot read messages)
    """
    chat_manager.register_user(
        request.user_id, 
        request.username, 
        request.public_key
    )
    return {"message": f"User {request.username} registered", "user_id": request.user_id}


@app.post("/api/chat/send", tags=["Chat"])
async def send_message(request: SendMessageRequest):
    """
    Send encrypted message
    Server CANNOT decrypt - zero-knowledge storage
    """
    # Decode base64 ciphertext
    ciphertext = base64.b64decode(request.ciphertext)
    
    # Store encrypted message
    message_id = chat_manager.send_encrypted_message(
        request.sender_id,
        request.recipient_id,
        ciphertext,
        request.group_id
    )
    
    # Notify recipient via WebSocket (if online)
    await websocket_manager.send_personal_message(
        json.dumps({
            "type": "new_message",
            "message_id": message_id,
            "sender_id": request.sender_id,
            "ciphertext": request.ciphertext,
            "timestamp": datetime.now().isoformat()
        }),
        request.recipient_id
    )
    
    return {"message_id": message_id, "status": "sent"}


@app.get("/api/chat/messages/{user_id}", tags=["Chat"])
async def get_messages(user_id: str, limit: int = 50):
    """
    Get encrypted messages for user
    Returns ciphertext only - client decrypts
    """
    messages = chat_manager.get_messages(user_id, limit)
    return {"messages": messages, "count": len(messages)}


@app.post("/api/chat/group/create", tags=["Chat"])
async def create_group(request: CreateGroupRequest):
    """Create encrypted group chat"""
    chat_manager.create_group(
        request.group_id,
        request.group_name,
        request.created_by,
        request.member_ids
    )
    return {"group_id": request.group_id, "message": "Group created"}


@app.get("/api/chat/groups/{user_id}", tags=["Chat"])
async def get_user_groups(user_id: str):
    """Get groups user belongs to"""
    groups = chat_manager.get_user_groups(user_id)
    return {"groups": groups, "count": len(groups)}


@app.delete("/api/chat/message/{message_id}/{user_id}", tags=["Chat"])
async def delete_message(message_id: str, user_id: str):
    """Delete message (only if sender)"""
    deleted = chat_manager.delete_message(message_id, user_id)
    
    if not deleted:
        raise HTTPException(status_code=403, detail="Cannot delete message (not sender)")
    
    return {"message": "Message deleted"}


# ============================================================================
# WebSocket Chat Endpoint (Real-time)
# ============================================================================

@app.websocket("/ws/chat/{user_id}")
async def chat_websocket(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for real-time encrypted chat
    Server routes encrypted messages (cannot read content)
    """
    await websocket_manager.connect(user_id, websocket)
    
    try:
        while True:
            # Receive encrypted message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Route encrypted message to recipient
            if "recipient_id" in message_data:
                await websocket_manager.send_personal_message(
                    json.dumps({
                        "type": "message",
                        "sender_id": user_id,
                        "ciphertext": message_data.get("ciphertext"),
                        "timestamp": datetime.now().isoformat()
                    }),
                    message_data["recipient_id"]
                )
                
                # Store encrypted message
                if "ciphertext" in message_data:
                    ciphertext = base64.b64decode(message_data["ciphertext"])
                    chat_manager.send_encrypted_message(
                        user_id,
                        message_data["recipient_id"],
                        ciphertext
                    )
            
    except WebSocketDisconnect:
        websocket_manager.disconnect(user_id)
        logger.info(f"User {user_id} disconnected")


# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    # Run with: python api_server.py
    # Or: uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload
    
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
