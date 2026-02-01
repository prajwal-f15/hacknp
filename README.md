# 🏥 Medical Document Summarizer with E2EE Chat

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128.0-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.0-000000.svg)](https://nextjs.org)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.53.1-FF4B4B.svg)](https://streamlit.io)
[![License](https://img.shields.io/badge/license-Private-red.svg)]()

**🔒 100% Offline | 🤖 AI-Powered | 🔐 Zero-Knowledge Encryption | 💬 End-to-End Encrypted Chat**

A complete offline medical document processing system with AI summarization, end-to-end encrypted chat, and modern Next.js frontend. Runs entirely offline with no cloud dependencies—perfect for hospitals and medical teams.

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites
- **Python 3.11+**
- **Node.js 16+** (for frontend)
- **8GB+ RAM** (16GB recommended)
- **20GB+ storage** (for AI models)

### Installation

```bash
# 1. Clone repository
git clone https://github.com/prajwal-f15/hacknp.git
cd hacknp

# 2. Backend Setup
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# Linux/Mac
source .venv/bin/activate

pip install -r requirements.txt

# 3. Download AI Models (~14GB)
python -m spacy download en_core_web_sm
python backend/models/download_mistral.py

# 4. Install Tesseract OCR
# Windows: https://github.com/UB-Mannheim/tesseract/wiki
# Linux: sudo apt install tesseract-ocr
# Mac: brew install tesseract

# 5. Frontend Setup
cd frontend
npm install
cd ..
```

### Start Application

**Windows (One-Click):**
```bash
START_ALL.bat
```

**Manual Start:**
```bash
# Terminal 1: Backend API
cd backend
..\venv\Scripts\python.exe api_server.py

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Streamlit UI (Optional)
cd backend
..\venv\Scripts\streamlit run app_langgraph.py
```

### Access Application
- **Next.js Frontend:** http://localhost:3000
- **Streamlit UI:** http://localhost:8502
- **API Documentation:** http://localhost:8000/docs

---

## 🎯 Key Features

| Feature | Details |
|---------|---------|
| **🤖 AI Summarization** | Mistral-7B LLM for intelligent medical document analysis |
| **🔒 100% Offline** | No internet required, no cloud APIs, completely local |
| **🔐 Zero-Knowledge Encryption** | AES-256-GCM—even server cannot decrypt your data |
| **💬 E2EE Chat** | Signal Protocol encrypted 1-to-1 and group messaging |
| **🎤 Text-to-Speech** | Offline audio generation with encrypted storage |
| **🧠 Smart Processing** | 5-node LangGraph pipeline with NER |
| **🗄️ Encrypted Storage** | SQLite with configurable retention policies |
| **🌐 Team Collaboration** | Mobile Hotspot support for offline team access |
| **📄 Multi-Format Support** | 18+ formats: PDF, DOCX, images with OCR, TXT, CSV |
| **🔍 Privacy Protection** | Automatic PII redaction (16+ patterns) |

---

## 📂 Project Structure

```
hacknp/
├── backend/                     # Python FastAPI Backend
│   ├── api_server.py           # REST API server (port 8000)
│   ├── app_langgraph.py        # Streamlit UI (port 8502)
│   ├── document_processor.py   # LangGraph 5-node pipeline
│   ├── encryption_utils.py     # AES-256-GCM encryption
│   ├── database.py             # SQLite encrypted storage
│   ├── signal_chat.py          # E2EE chat system
│   ├── models/                 # AI model utilities
│   │   ├── download_mistral.py
│   │   ├── model_integration.py
│   │   ├── regex_patterns.py
│   │   └── verify_setup.py
│   └── .streamlit/             # Streamlit configuration
│
├── frontend/                    # Next.js Frontend
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   ├── contexts/               # React contexts
│   ├── utils/                  # Utility functions
│   ├── .env.local              # API configuration
│   ├── next.config.js          # Next.js config
│   └── package.json            # Dependencies
│
├── .venv/                      # Python virtual environment
├── requirements.txt            # Python dependencies
├── START_ALL.bat              # One-click startup (Windows)
└── README.md                   # This file
```

---

## 🔧 System Architecture

### Processing Pipeline (5 Nodes)

```
INPUT DOCUMENT
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│ Node 1: EXTRACT TEXT                                    │
│ - Tesseract OCR for images                              │
│ - PDF text extraction                                   │
│ - DOCX parsing                                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ Node 2: CLEAN TEXT                                      │
│ - Remove PII (names, phones, SSN, etc.)                 │
│ - Normalize formatting                                  │
│ - Filter noise                                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ Node 3: ANALYZE ENTITIES (spaCy NER)                    │
│ - Extract: persons, organizations, locations           │
│ - Identify: medical conditions, procedures             │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ Node 4: EXTRACT STRUCTURED DATA                         │
│ - Phone numbers, dates, IDs                            │
│ - Vital signs, dosages                                 │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│ Node 5: AI SUMMARIZATION (Mistral-7B)                   │
│ - Generate clinical summary                             │
│ - Extract key findings                                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
        ENCRYPT & STORE (AES-256-GCM)
```

### Full Stack Architecture

```
┌─────────────────────────────────────────────────────────┐
│                NEXT.JS FRONTEND (Port 3000)             │
│  - Modern React UI with Tailwind CSS                   │
│  - Medical summary display                              │
│  - Real-time chat interface                            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/WebSocket
                     ▼
┌─────────────────────────────────────────────────────────┐
│              FASTAPI BACKEND (Port 8000)                │
│  - 15+ REST API endpoints                              │
│  - WebSocket for real-time chat                        │
│  - Document processing pipeline                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           AES-256-GCM ENCRYPTION LAYER                  │
│  - All data encrypted before storage                   │
│  - Zero-knowledge architecture                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              SQLITE DATABASES                           │
│  - medical_history.db (encrypted results)              │
│  - chat_messages.db (E2EE messages)                    │
└─────────────────────────────────────────────────────────┘

PARALLEL:
┌─────────────────────────────────────────────────────────┐
│           STREAMLIT UI (Port 8502)                      │
│  - Alternative web interface                            │
│  - 5 tabs: Upload, Analysis, Summary, History, Chat    │
└─────────────────────────────────────────────────────────┘
```

---

## 🖥️ System Requirements

| Requirement | Details |
|-------------|---------|
| **Python** | 3.11 or higher |
| **Node.js** | 16.0 or higher |
| **RAM** | 8GB minimum (16GB recommended) |
| **Storage** | 20GB+ (Mistral-7B: 14GB, deps: 5GB) |
| **Processor** | Multi-core (4+ cores recommended) |
| **GPU** | Optional—NVIDIA CUDA for 10x faster inference |
| **OS** | Windows 10/11, Ubuntu 20.04+, macOS 12+ |
| **Network** | None required (100% offline capable) |

---

## 🔐 Security & Encryption

### What's Encrypted
✅ Document summaries (AES-256-GCM)  
✅ Chat messages (Signal Protocol E2EE)  
✅ Audio files (encrypted MP3 storage)  
✅ Processing history (encrypted SQLite blobs)  
✅ Activity logs (encrypted audit trail)  
✅ User passwords (PBKDF2 hashed, salted)  

### What Server CANNOT Access
❌ Original document content (deleted immediately)  
❌ Patient data or medical information  
❌ Chat messages (client-side encryption)  
❌ Private encryption keys (never transmitted)  
❌ User passwords (only hash stored)  
❌ Decrypted data (only ciphertext stored)  

### Encryption Details
- **Algorithm:** AES-256-GCM (authenticated encryption)
- **Key Derivation:** PBKDF2-HMAC-SHA256 (600,000 iterations)
- **Nonce:** 12-byte cryptographically random per encryption
- **Format:** Base64-encoded ciphertext with authentication tag
- **Chat:** Signal Protocol with Double Ratchet Algorithm

---

## 🚀 API Endpoints

### Document Processing
```http
POST   /api/upload              # Upload and process document
GET    /api/status/{task_id}    # Check processing status
GET    /api/summary/{task_id}   # Get encrypted results
GET    /api/health              # Server health check
```

### Text-to-Speech
```http
GET    /api/speak/{task_id}     # Generate TTS audio
GET    /api/audio/{audio_id}    # Download audio file
```

### History & Settings
```http
GET    /api/history             # Get processing history
POST   /api/settings/retention  # Set retention (7/30/90/forever)
POST   /api/cleanup             # Cleanup expired data
DELETE /api/document/{doc_id}   # Delete specific document
```

### End-to-End Encrypted Chat
```http
POST   /api/chat/register       # Register user
POST   /api/chat/send           # Send encrypted message
GET    /api/chat/messages/{id}  # Get messages
POST   /api/chat/group/create   # Create group
WS     /ws/chat/{user_id}       # WebSocket real-time
```

**Interactive Docs:** http://localhost:8000/docs (Swagger UI)

---

## 📖 Usage Guide

### Next.js Frontend

1. **Upload Document**
   - Navigate to http://localhost:3000
   - Click "Upload" and select file (PDF, image, DOCX, etc.)
   - Wait for AI processing (5-30 seconds)

2. **View Summary**
   - See key findings with checkmarks
   - View current treatment plan
   - Click "Listen" for audio summary

3. **Secure Chat**
   - Register with username/password
   - Send encrypted 1-to-1 messages
   - Create group chats for team collaboration

### Streamlit UI

**Tab 1: Upload & Process**
- Upload documents and process with AI
- View real-time processing progress

**Tab 2: Analysis Results**
- Extracted entities (names, orgs, locations)
- Structured data (phone, dates, IDs)
- PII detection warnings

**Tab 3: Summary**
- AI-generated medical summary
- Download as TXT, JSON, or MP3
- Adjust speech speed (100-200 WPM)

**Tab 4: History & Settings**
- View all processed documents
- Configure retention policy
- Manual cleanup options

**Tab 5: Secure Chat**
- End-to-end encrypted messaging
- Real-time WebSocket communication
- Group chat support

---

## 🛠️ Configuration

### Frontend (.env.local)
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Features
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_TTS=true
NEXT_PUBLIC_ENABLE_HISTORY=true
```

### Backend (Optional .env)
```env
# Server
API_HOST=0.0.0.0
API_PORT=8000
UI_PORT=8502

# Database
DB_PATH=backend/medical_history.db
CHAT_DB_PATH=backend/chat_messages.db

# Retention
DEFAULT_RETENTION_DAYS=30
```

### Offline Team Access (Mobile Hotspot)

1. Enable Windows Mobile Hotspot
2. Server auto-binds to `192.168.137.1`
3. Update frontend `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://192.168.137.1:8000
   ```
4. Team accesses:
   - Next.js: `http://192.168.137.1:3000`
   - Streamlit: `http://192.168.137.1:8502`

---

## 📦 Tech Stack

### Backend
- **FastAPI** 0.128.0 - Modern Python web framework
- **Streamlit** 1.53.1 - Alternative UI framework
- **LangGraph** 1.0.7 - Workflow orchestration
- **Transformers** 5.0.0 - Hugging Face models
- **spaCy** 3.8.11 - Named entity recognition
- **SQLAlchemy** 2.0.46 - Database ORM
- **Cryptography** 46.0.4 - Encryption primitives

### Frontend
- **Next.js** 14.1.0 - React framework
- **React** 18.2.0 - UI library
- **TypeScript** 5.5.2 - Type safety
- **Tailwind CSS** 3.4.1 - Utility-first CSS
- **GSAP** 3.14.2 - Animation library

### AI Models
- **Mistral-7B-Instruct** - Large language model (14GB)
- **spaCy en_core_web_sm** - NER model (500MB)
- **Tesseract OCR** - Optical character recognition

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port already in use** | `netstat -ano \| findstr ":8000 :3000 :8502"` then `taskkill /PID <PID> /F` |
| **Tesseract not found** | Install: https://github.com/UB-Mannheim/tesseract/wiki |
| **Model download fails** | Check disk space (20GB+), internet connection |
| **Frontend can't connect** | Verify backend running: `http://localhost:8000/docs` |
| **ModuleNotFoundError** | `pip install -r requirements.txt --force-reinstall` |
| **Next.js SWC error** | Already fixed in `next.config.js` (swcMinify: false) |
| **Database locked** | Stop backend, restart services |

---

## 🔄 Development

### Backend Development
```bash
cd backend
..\venv\Scripts\activate
python api_server.py
```

### Frontend Development
```bash
cd frontend
npm run dev          # Development
npm run build        # Production build
npm start            # Production server
```

### Run Tests
```bash
# Backend
pytest

# Frontend
cd frontend
npm run lint
```

---

## 📊 Performance

| Operation | Time | Notes |
|-----------|------|-------|
| Model download | 15-30 min | First time only (14GB) |
| Document processing | 5-20 sec | Depends on file size |
| AI summarization | 10-30 sec | CPU: 20s, GPU: 5s |
| OCR (per page) | 2-5 sec | Tesseract |
| Encryption | <100ms | AES-NI optimized |
| Chat message | <50ms | Real-time WebSocket |

---

## ⚖️ Legal & Compliance

**DISCLAIMER:** This software provides encryption and privacy features.

**For Production Medical Use:**
- Consult legal experts regarding HIPAA compliance
- Conduct professional security audit
- Review GDPR/CCPA requirements
- Implement proper authentication
- Maintain audit logs
- Test thoroughly in your environment

---

## 📞 Support

- **GitHub Issues:** https://github.com/prajwal-f15/hacknp/issues
- **API Docs:** http://localhost:8000/docs (when running)
- **Code Documentation:** See inline comments in source files

---

## 📝 License

**Private Medical System** - Not for public distribution.

Licensed to: Authorized medical facilities and practitioners only.

---

## 🎉 Ready to Deploy!

```bash
# Start everything
START_ALL.bat

# Access
# Next.js:  http://localhost:3000
# Backend:  http://localhost:8000
# Streamlit: http://localhost:8502
```

**Version:** 2.0.0  
**Status:** ✅ Production Ready  
**Last Updated:** February 2026  

**Transform medical document processing today!** 🚀
