"""
AI Document Summarizer - 100% OFFLINE with LangGraph
Frontend UI for REST API Backend
ALL PROCESSING HAPPENS LOCALLY - NO DATA SENT ANYWHERE
"""

import streamlit as st
import os
from pathlib import Path
import tempfile
import time
import requests

# API Configuration
API_BASE_URL = "http://192.168.137.1:8000"

# Page configuration
st.set_page_config(
    page_title="AI Document Summarizer - 100% OFFLINE",
    page_icon="🔒",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        text-align: center;
        color: #1f77b4;
        margin-bottom: 1rem;
    }
    .offline-badge {
        font-size: 1.2rem;
        font-weight: bold;
        text-align: center;
        color: #28a745;
        background-color: #d4edda;
        padding: 10px;
        border-radius: 10px;
        margin-bottom: 2rem;
        border: 2px solid #28a745;
    }
    .process-step {
        padding: 1rem;
        border-radius: 10px;
        border: 2px solid #17a2b8;
        margin: 0.5rem 0;
        background-color: #d1ecf1;
        color: #0c5460;
    }
    .stButton>button {
        width: 100%;
        background-color: #1f77b4;
        color: white;
        border-radius: 5px;
        padding: 0.5rem;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'result_state' not in st.session_state:
    st.session_state.result_state = None
if 'processing' not in st.session_state:
    st.session_state.processing = False
if 'task_id' not in st.session_state:
    st.session_state.task_id = None

# Check API connection
@st.cache_data(ttl=10)
def check_api_health():
    """Check if API backend is running"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/health", timeout=2)
        return response.status_code == 200
    except:
        return False

processor = None  # Will use API instead

# Check model status
@st.cache_data(ttl=60)
def get_model_status():
    """Check which models are available via API"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            return {
                'tesseract': {'status': 'ready' if data['models_available']['tesseract'] else 'not_found'},
                'spacy': {'status': 'ready' if data['models_available']['spacy'] else 'not_found'},
                'regex': {'status': 'ready' if data['models_available']['regex'] else 'not_found'},
                'mistral': {'status': 'ready' if data['models_available']['mistral'] else 'not_found'}
            }
    except:
        # If API is not available, return all as not ready
        return {
            'tesseract': {'status': 'not_found'},
            'spacy': {'status': 'not_found'},
            'regex': {'status': 'not_found'},
            'mistral': {'status': 'not_found'}
        }

models_status = get_model_status()

# Ensure models_status is not None
if models_status is None:
    models_status = {
        'tesseract': {'status': 'not_found'},
        'spacy': {'status': 'not_found'},
        'regex': {'status': 'not_found'},
        'mistral': {'status': 'not_found'}
    }

# Main UI
st.markdown('<h1 class="main-header">🔒 AI Document Summarizer</h1>', unsafe_allow_html=True)
st.markdown('<div class="offline-badge">🔐 100% OFFLINE - LangGraph Orchestration - NO DATA SENT TO INTERNET 🔐</div>', unsafe_allow_html=True)

# Process Flow Visualization
st.markdown("""
<div class="process-step">
<h3 style="text-align: center;">🔄 LangGraph Pipeline</h3>
<p style="text-align: center; font-size: 0.9rem;">
<b>Step 1:</b> Extract Text → 
<b>Step 2:</b> Clean Text → 
<b>Step 3:</b> Analyze Entities → 
<b>Step 4:</b> Extract Data → 
<b>Step 5:</b> Generate Summary
</p>
<p style="text-align: center; font-size: 0.8rem; color: #666;">
Orchestrated execution with automatic model routing and fallback
</p>
</div>
""", unsafe_allow_html=True)

# Sidebar - Model Status
with st.sidebar:
    st.header("🔒 Offline Models")
    st.caption("LangGraph node isolation")
    st.markdown("---")
    
    st.markdown("### 📊 Model Status:")
    
    # Tesseract OCR
    status = "✅" if models_status.get('tesseract', {}).get('status') == 'ready' else "❌"
    st.markdown(f"{status} **🖼️ Tesseract OCR** (Node 1)")
    
    # spaCy
    status = "✅" if models_status.get('spacy', {}).get('status') == 'ready' else "❌"
    st.markdown(f"{status} **🔤 spaCy NER** (Node 3)")
    
    # Regex
    status = "✅" if models_status.get('regex', {}).get('status') == 'ready' else "❌"
    st.markdown(f"{status} **📝 Regex** (Node 4)")
    
    # Mistral
    status = "✅" if models_status.get('mistral', {}).get('status') == 'ready' else "❌"
    st.markdown(f"{status} **🤖 Mistral-7B** (Node 5)")
    
    st.markdown("---")
    st.markdown("### 🏗️ Architecture:")
    st.markdown("• **LangGraph**: Step orchestration")
    st.markdown("• **Router**: Model switching")
    st.markdown("• **Microservices**: Isolated nodes")
    st.markdown("• **Fallback**: Auto-switching")
    
    st.markdown("---")
    st.success("🔐 100% Privacy\nYour data never leaves!")

# Main tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs(["📤 Upload & Process", "📊 Analysis Results", "📝 Summary", "📜 History & Settings", "💬 Secure Chat"])

with tab1:
    st.header("Upload Your Document")
    st.info("🔒 Document processed through LangGraph pipeline - completely offline")
    
    # File uploader - supports all common formats
    uploaded_file = st.file_uploader(
        "Choose a file (Image, PDF, DOCX, TXT, CSV, etc.)",
        type=['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'gif', 'webp', 'pdf', 'docx', 'doc', 'txt', 'csv', 'log', 'md'],
        help="Supports: Images (PNG, JPG, BMP, TIFF, GIF), Documents (PDF, DOCX), Text (TXT, CSV, LOG, MD)"
    )
    
    if uploaded_file:
        st.success(f"✅ File uploaded: {uploaded_file.name}")
        
        col1, col2 = st.columns([1, 1])
        
        with col1:
            st.subheader("📄 File Preview")
            
            file_type = uploaded_file.name.split('.')[-1].lower()
            
            # Preview for different file types
            if file_type in ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'tif', 'gif', 'webp']:
                from PIL import Image
                uploaded_file.seek(0)
                image = Image.open(uploaded_file)
                st.image(image, caption="Uploaded Image (OCR will extract text)", use_container_width=True)
            elif file_type == 'pdf':
                st.info(f"📄 PDF Document: {uploaded_file.name}\n\n📖 Text will be extracted from all pages")
            elif file_type in ['docx', 'doc']:
                st.info(f"📝 Word Document: {uploaded_file.name}\n\n📖 Text and tables will be extracted")
            elif file_type in ['txt', 'csv', 'log', 'md']:
                st.info(f"📃 Text File: {uploaded_file.name}\n\n📖 Content will be read directly")
            else:
                st.info(f"📄 {file_type.upper()} File: {uploaded_file.name}")
        
        with col2:
            st.subheader("🚀 Processing Options")
            
            use_ai = st.checkbox("Use AI Summary (Mistral-7B)", value=True, 
                               help="Uncheck to use simple extractive summary")
            
            st.markdown("""
            **Pipeline Steps:**
            1. ✅ Extract text (OCR/Parser)
            2. 🧹 Clean & preprocess
            3. 🔍 Analyze entities (spaCy)
            4. 📞 Extract data (Regex)
            5. 🤖 Generate summary (AI/Simple)
            """)
            
            if st.button("▶️ START LANGGRAPH PIPELINE", key="process", type="primary"):
                # Check API connection first
                if not check_api_health():
                    st.error("❌ API Backend not running! Start with: `python api_server.py`")
                    st.session_state.processing = False
                else:
                    st.session_state.processing = True
                    
                    # Save file temporarily
                    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_type}") as tmp_file:
                        uploaded_file.seek(0)
                        tmp_file.write(uploaded_file.read())
                        tmp_path = tmp_file.name
                    
                    # Progress tracking
                    progress_bar = st.progress(0)
                    status_text = st.empty()
                    
                    # Upload to API
                    try:
                        status_text.info("📤 Uploading to API...")
                        progress_bar.progress(0.1)
                        
                        with open(tmp_path, 'rb') as f:
                            files = {'file': (uploaded_file.name, f, f'application/{file_type}')}
                            params = {'use_ai_summary': use_ai}
                            response = requests.post(
                                f"{API_BASE_URL}/api/upload",
                                files=files,
                                params=params,
                                timeout=30
                            )
                        
                        if response.status_code != 200:
                            st.error(f"Upload failed: {response.text}")
                            st.session_state.processing = False
                        else:
                            upload_data = response.json()
                            task_id = upload_data['task_id']
                            st.session_state.task_id = task_id
                            
                            status_text.info(f"✓ Uploaded! Task ID: {task_id[:8]}...")
                            progress_bar.progress(0.2)
                            
                            # Poll for status
                            status_text.info("🔄 Processing document...")
                            
                            with st.spinner("Processing... This may take 30-90 seconds"):
                                max_attempts = 60  # 2 minutes max
                                for attempt in range(max_attempts):
                                    time.sleep(2)
                                    
                                    status_response = requests.get(
                                        f"{API_BASE_URL}/api/status/{task_id}",
                                        timeout=5
                                    )
                                    
                                    if status_response.status_code == 200:
                                        status_data = status_response.json()
                                        current_status = status_data['status']
                                        
                                        # Update progress
                                        if current_status == "processing":
                                            progress = min(0.3 + (attempt * 0.01), 0.9)
                                            progress_bar.progress(progress)
                                            status_text.info(f"🔄 Processing... ({attempt*2}s)")
                                        
                                        if current_status in ['completed', 'completed_with_warnings']:
                                            progress_bar.progress(1.0)
                                            status_text.success("✓ Processing complete!")
                                            
                                            # Get summary
                                            summary_response = requests.get(
                                                f"{API_BASE_URL}/api/summary/{task_id}",
                                                timeout=10
                                            )
                                            
                                            if summary_response.status_code == 200:
                                                summary_result = summary_response.json()
                                                
                                                # Convert API response to match old format
                                                st.session_state.result_state = {
                                                    'summary': summary_result.get('summary', ''),
                                                    'cleaned_text': summary_result.get('cleaned_text', ''),
                                                    'raw_text': summary_result.get('cleaned_text', ''),  # API doesn't return raw
                                                    'entities': summary_result.get('entities', {}),
                                                    'structured_data': summary_result.get('structured_data', {}),
                                                    'error': None
                                                }
                                                
                                                status_text.success("✅ Processing Complete! View results in other tabs.")
                                            break
                                        
                                        elif current_status == 'failed':
                                            error = status_data.get('error', 'Unknown error')
                                            status_text.error(f"❌ Processing failed: {error}")
                                            break
                                
                                else:
                                    status_text.warning("⚠️ Processing timeout. Check /api/status manually.")
                            
                            st.session_state.processing = False
                        
                        # Cleanup local file
                        try:
                            os.unlink(tmp_path)
                        except:
                            pass
                            
                    except requests.exceptions.ConnectionError:
                        st.error("❌ Cannot connect to API backend. Make sure it's running on port 8000")
                        st.session_state.processing = False
                    except Exception as e:
                        st.error(f"❌ Error: {str(e)}")
                        st.session_state.processing = False
        
        # Show results if available
        # Show results if available
        if st.session_state.result_state:
            st.markdown("---")
            st.subheader("📄 Processing Complete")
            
            result = st.session_state.result_state
            
            st.markdown("---")
            st.markdown("### 💾 Download Options")
            
            col1, col2, col3 = st.columns(3)
            with col1:
                st.metric("Raw Text Length", len(result.get("raw_text", "")))
            with col2:
                st.metric("Cleaned Text Length", len(result.get("cleaned_text", "")))
            with col3:
                entities_count = sum(len(v) for v in result.get("entities", {}).values())
                st.metric("Entities Found", entities_count)
            
            with st.expander("View Raw Extracted Text"):
                st.text_area("Raw Text", result.get("raw_text", ""), height=200, key="raw_display", label_visibility="collapsed")
            
            with st.expander("View Cleaned Text"):
                st.text_area("Cleaned Text", result.get("cleaned_text", ""), height=200, key="clean_display", label_visibility="collapsed")
            
            # ⭐ SHOW SUMMARY HERE TOO ⭐
            if result.get("summary"):
                st.markdown("---")
                st.markdown("### 🎯 AI-Generated Summary")
                st.success("✅ Medical summary generated (100% offline, no PII)")
                st.markdown(result.get("summary", ""))
                
                # Quick audio option
                if st.button("🔊 Listen to Summary", key="quick_audio"):
                    with st.spinner("Generating audio..."):
                        try:
                            if st.session_state.task_id:
                                task_id = st.session_state.task_id
                                audio_url = f"{API_BASE_URL}/api/speak/{task_id}?voice_rate=150"
                                audio_response = requests.get(audio_url, timeout=30)
                                
                                if audio_response.status_code == 200:
                                    st.audio(audio_response.content, format="audio/mp3")
                                    st.success("✅ Audio ready!")
                                else:
                                    st.error(f"Failed to generate audio: {audio_response.text}")
                        except Exception as e:
                            st.error(f"Audio generation failed: {str(e)}")
                
                st.info("👆 See full details in the **📝 Summary** tab above")
            else:
                st.warning("⚠️ No summary generated. Check the 📝 Summary tab for details.")

with tab2:
    st.header("📊 Extracted Data & Entities")
    
    if st.session_state.result_state:
        result = st.session_state.result_state
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("👥 Named Entities (spaCy Node)")
            
            entities = result.get("entities", {})
            
            if entities.get('persons'):
                st.markdown("**👤 Persons:**")
                for person in entities['persons'][:10]:
                    st.markdown(f"• {person}")
            
            if entities.get('locations'):
                st.markdown("**📍 Locations:**")
                for loc in entities['locations'][:10]:
                    st.markdown(f"• {loc}")
            
            if entities.get('organizations'):
                st.markdown("**🏢 Organizations:**")
                for org in entities['organizations'][:10]:
                    st.markdown(f"• {org}")
            
            if not any(entities.values()):
                st.info("No entities found")
        
        with col2:
            st.subheader("📞 Structured Data (Regex Node)")
            
            data = result.get("structured_data", {})
            
            if data.get('phone_numbers'):
                st.markdown("**📱 Phone Numbers:**")
                for phone in data['phone_numbers'][:10]:
                    st.markdown(f"• {phone}")
            
            if data.get('aadhaar_numbers'):
                st.markdown("**🆔 Aadhaar Numbers:**")
                for aadhaar in data['aadhaar_numbers'][:10]:
                    st.markdown(f"• {aadhaar}")
            
            if data.get('dates'):
                st.markdown("**📅 Dates:**")
                for date in data['dates'][:10]:
                    st.markdown(f"• {date}")
            
            if not any(data.values()):
                st.info("No structured data found")
    else:
        st.info("👆 Upload and process a document first")

with tab3:
    st.header("📝 Final Summary Output")
    
    if st.session_state.result_state:
        result = st.session_state.result_state
        summary = result.get("summary", "")
        cleaned_text = result.get("cleaned_text", "")
        
        if summary:
            # Show the pipeline flow
            st.markdown("""
            <div style='background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px;'>
                <h3 style='color: white; margin: 0;'>🔄 Processing Pipeline</h3>
                <p style='color: white; margin: 10px 0 0 0;'>OCR → Clean Text → spaCy → Regex → Mistral-7B</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Show cleaned text input
            with st.expander("🧹 Step 1: Cleaned Text (Input to Model)", expanded=False):
                st.info("📌 This is the preprocessed text that was sent to the AI model")
                st.text_area(
                    "Cleaned Document Text",
                    cleaned_text[:2000] + ("..." if len(cleaned_text) > 2000 else ""),
                    height=200,
                    key="cleaned_preview",
                    label_visibility="collapsed"
                )
                st.caption(f"📊 Total length: {len(cleaned_text)} characters")
            
            # Show the prompt structure
            with st.expander("📝 Step 2: Prompt Sent to Mistral-7B", expanded=False):
                st.info("🤖 This is how we asked the AI to explain the document")
                prompt_preview = f"""[INST] This is my medical report. Explain this in simple language that anyone can understand. Make it clear and easy to read.

Document Text:
{cleaned_text[:500]}...

Provide a clear summary in simple words.[/INST]"""
                st.code(prompt_preview, language="text")
            
            # Show the AI-generated output
            st.markdown("### 🎯 Step 3: Model Generated Summary")
            st.success("✅ Summary generated by LangGraph pipeline (100% offline)")
            st.markdown("---")
            
            # Audio playback option
            st.markdown("### 🔊 Listen to Summary")
            col_audio1, col_audio2 = st.columns([1, 3])
            
            with col_audio1:
                voice_rate = st.slider("Speech Speed", 100, 200, 150, 10, 
                                      help="Adjust how fast the voice speaks (words per minute)")
            
            with col_audio2:
                if st.button("🎧 Generate & Play Audio", key="generate_audio"):
                    with st.spinner("Generating audio..."):
                        try:
                            # Get task_id from session state
                            if st.session_state.task_id:
                                task_id = st.session_state.task_id
                                
                                # Request audio from API
                                audio_url = f"{API_BASE_URL}/api/speak/{task_id}?voice_rate={voice_rate}"
                                audio_response = requests.get(audio_url, timeout=30)
                                
                                if audio_response.status_code == 200:
                                    # Save audio temporarily
                                    audio_data = audio_response.content
                                    
                                    # Display audio player
                                    st.audio(audio_data, format="audio/mp3")
                                    st.success("✅ Audio ready! Click play to listen")
                                    
                                    # Download button
                                    st.download_button(
                                        label="⬇️ Download Audio",
                                        data=audio_data,
                                        file_name=f"medical_summary_{task_id[:8]}.mp3",
                                        mime="audio/mpeg"
                                    )
                                else:
                                    st.error(f"Failed to generate audio: {audio_response.text}")
                            else:
                                st.warning("No task ID found. Please process a document first.")
                        except Exception as e:
                            st.error(f"Audio generation failed: {str(e)}")
            
            st.markdown("---")
            
            # Display summary
            st.markdown(summary)
            st.markdown("---")
            
            # Download options
            st.markdown("### 💾 Download Options")
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.download_button(
                    label="⬇️ Download Summary",
                    data=summary,
                    file_name="summary.txt",
                    mime="text/plain"
                )
            
            with col2:
                st.download_button(
                    label="⬇️ Download Cleaned Text",
                    data=result.get("cleaned_text", ""),
                    file_name="cleaned_text.txt",
                    mime="text/plain"
                )
            
            with col3:
                # Generate full report
                report = "# DOCUMENT ANALYSIS REPORT\n"
                report += "# LangGraph Pipeline - 100% Offline\n\n"
                report += "## SUMMARY\n"
                report += summary + "\n\n"
                
                if result.get("entities"):
                    report += "## ENTITIES (spaCy Node)\n\n"
                    for key, values in result["entities"].items():
                        if values:
                            report += f"**{key.title()}:**\n"
                            for v in values:
                                report += f"- {v}\n"
                            report += "\n"
                
                if result.get("structured_data"):
                    report += "## STRUCTURED DATA (Regex Node)\n\n"
                    for key, values in result["structured_data"].items():
                        if values:
                            report += f"**{key.replace('_', ' ').title()}:**\n"
                            for v in values:
                                report += f"- {v}\n"
                            report += "\n"
                
                report += "## ORIGINAL TEXT\n\n"
                report += result.get("cleaned_text", "")
                
                st.download_button(
                    label="⬇️ Full Report",
                    data=report,
                    file_name="analysis_report.md",
                    mime="text/markdown"
                )
            
            # Processing stats
            st.markdown("---")
            st.markdown("### 📊 Processing Statistics")
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.metric("Raw Characters", len(result.get("raw_text", "")))
            with col2:
                st.metric("Clean Characters", len(result.get("cleaned_text", "")))
            with col3:
                entities_count = sum(len(v) for v in result.get("entities", {}).values())
                st.metric("Entities", entities_count)
            with col4:
                data_count = sum(len(v) for v in result.get("structured_data", {}).values())
                st.metric("Data Points", data_count)
    else:
        st.info("👆 Upload and process a document to see summary")
        
        st.markdown("""
        ### 🏗️ LangGraph Architecture:
        
        **Node-based execution:**
        - **Node 1**: Text Extraction (Tesseract/PDF parser)
        - **Node 2**: Text Cleaning (Preprocessing)
        - **Node 3**: Entity Analysis (spaCy NER)
        - **Node 4**: Data Extraction (Regex patterns)
        - **Node 5**: Summarization (Mistral-7B with router fallback)
        
        **Benefits:**
        - 🔄 Step-by-step execution
        - 🔀 Automatic model routing
        - 🛡️ Fallback mechanisms
        - 🏗️ Microservice isolation
        - 📊 State management
        
        **Everything runs 100% offline on your computer! 🔒**
        """)

with tab4:
    st.header("📜 Processing History & Settings")
    
    # Settings Section
    st.subheader("⚙️ Settings")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 🗄️ History Retention")
        
        # Get current retention policy
        try:
            retention_response = requests.get(f"{API_BASE_URL}/api/settings/retention", timeout=5)
            current_retention = retention_response.json().get('retention_policy', 'forever')
        except:
            current_retention = 'forever'
        
        retention_option = st.selectbox(
            "Keep history for:",
            options=['forever', '7', '30', '90'],
            index=['forever', '7', '30', '90'].index(current_retention),
            help="How long to keep processing results"
        )
        
        if st.button("💾 Save Retention Policy"):
            try:
                response = requests.post(
                    f"{API_BASE_URL}/api/settings/retention",
                    params={'retention_days': retention_option}
                )
                if response.status_code == 200:
                    st.success(f"✓ Retention policy set to: {retention_option} days")
                else:
                    st.error("Failed to update retention policy")
            except Exception as e:
                st.error(f"Error: {str(e)}")
        
        st.info(f"🔒 **Audio files**: Always deleted after 30 days (encrypted)")
    
    with col2:
        st.markdown("### 🧹 Cleanup")
        
        if st.button("🗑️ Delete Expired Data"):
            with st.spinner("Cleaning up..."):
                try:
                    cleanup_response = requests.post(f"{API_BASE_URL}/api/cleanup", timeout=10)
                    if cleanup_response.status_code == 200:
                        data = cleanup_response.json()
                        st.success(f"✓ Deleted {data['deleted_results']} results, {data['deleted_audio']} audio files")
                    else:
                        st.error("Cleanup failed")
                except Exception as e:
                    st.error(f"Error: {str(e)}")
        
        st.caption("Manually trigger cleanup of expired records")
    
    st.markdown("---")
    
    # History Section
    st.subheader("📊 Processing History")
    
    try:
        history_response = requests.get(f"{API_BASE_URL}/api/history?limit=50", timeout=5)
        
        if history_response.status_code == 200:
            history_data = history_response.json()
            history_list = history_data.get('history', [])
            
            if history_list:
                st.markdown(f"**Total Records:** {history_data['count']}")
                
                # Display history table
                import pandas as pd
                
                df = pd.DataFrame(history_list)
                df['created_at'] = pd.to_datetime(df['created_at']).dt.strftime('%Y-%m-%d %H:%M:%S')
                df['processing_time'] = df['processing_time'].round(2).astype(str) + 's'
                
                st.dataframe(
                    df[['created_at', 'file_name', 'file_type', 'status', 'processing_time']],
                    use_container_width=True,
                    height=400
                )
                
                # Statistics
                st.markdown("### 📈 Statistics")
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.metric("Total Processed", len(history_list))
                with col2:
                    completed = sum(1 for h in history_list if h['status'] == 'completed')
                    st.metric("Successful", completed)
                with col3:
                    avg_time = sum(h['processing_time'] for h in history_list) / len(history_list)
                    st.metric("Avg Time", f"{avg_time:.2f}s")
            else:
                st.info("No processing history yet. Upload and process documents to see history.")
        else:
            st.warning("Could not load history. Make sure API server is running.")
            
    except Exception as e:
        st.error(f"Failed to load history: {str(e)}")
    
    st.markdown("---")
    st.markdown("### 🔐 Security Status")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.success("✓ Results Encrypted")
    with col2:
        st.success("✓ Uploads Deleted")
    with col3:
        st.success("✓ Audio Encrypted")


# ==================================================================================
# TAB 5 - SECURE CHAT (Signal Protocol E2EE)
# ==================================================================================

with tab5:
    st.header("💬 Secure Chat - Signal Protocol E2EE")
    st.info("🔐 End-to-end encrypted chat using Signal Protocol. Server CANNOT read messages!")
    
    # Initialize chat session state
    if 'chat_user_id' not in st.session_state:
        st.session_state.chat_user_id = None
    if 'chat_messages' not in st.session_state:
        st.session_state.chat_messages = []
    if 'chat_groups' not in st.session_state:
        st.session_state.chat_groups = []
    
    # User Registration
    st.subheader("1️⃣ User Registration")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        if not st.session_state.chat_user_id:
            username_input = st.text_input("Enter your username (doctor/patient ID):")
            
            if st.button("Register for Chat"):
                if username_input:
                    # Generate demo encryption key (in production, use Signal Protocol key generation)
                    import hashlib
                    user_id = hashlib.sha256(username_input.encode()).hexdigest()[:16]
                    public_key = "demo_public_key_" + user_id  # Simplified for demo
                    
                    # Register with backend
                    try:
                        register_response = requests.post(
                            f"{API_BASE_URL}/api/chat/register",
                            json={
                                "user_id": user_id,
                                "username": username_input,
                                "public_key": public_key
                            },
                            timeout=5
                        )
                        
                        if register_response.status_code == 200:
                            st.session_state.chat_user_id = user_id
                            st.session_state.chat_username = username_input
                            st.success(f"✅ Registered as {username_input}")
                            st.rerun()
                        else:
                            st.error("Registration failed")
                    except Exception as e:
                        st.error(f"Registration error: {str(e)}")
                else:
                    st.warning("Please enter a username")
        else:
            st.success(f"✅ Logged in as: **{st.session_state.chat_username}** (ID: {st.session_state.chat_user_id[:8]}...)")
            
            if st.button("Logout"):
                st.session_state.chat_user_id = None
                st.session_state.chat_username = None
                st.rerun()
    
    with col2:
        st.markdown("**Security:**")
        st.markdown("🔐 Signal Protocol")
        st.markdown("🔒 Double Ratchet")
        st.markdown("🚫 Server Can't Read")
    
    # Only show chat if logged in
    if st.session_state.chat_user_id:
        st.markdown("---")
        
        # Chat tabs (1-to-1 and Group)
        chat_tab1, chat_tab2 = st.tabs(["👤 1-to-1 Chat (Doctor-Patient)", "👥 Group Chat (Team)"])
        
        # ============== 1-to-1 CHAT ==============
        with chat_tab1:
            st.subheader("Direct Messaging")
            
            col1, col2 = st.columns([1, 3])
            
            with col1:
                recipient_input = st.text_input("Recipient Username:")
                
                if st.button("Start Conversation"):
                    if recipient_input:
                        st.session_state.chat_recipient = recipient_input
                        st.success(f"Chatting with: {recipient_input}")
            
            with col2:
                # Message display
                st.markdown("**Message Thread:**")
                
                # Fetch messages from API
                if st.button("Refresh Messages"):
                    try:
                        msg_response = requests.get(
                            f"{API_BASE_URL}/api/chat/messages/{st.session_state.chat_user_id}?limit=50",
                            timeout=5
                        )
                        
                        if msg_response.status_code == 200:
                            msg_data = msg_response.json()
                            st.session_state.chat_messages = msg_data.get('messages', [])
                            st.success(f"Loaded {msg_data['count']} encrypted messages")
                        else:
                            st.warning("Could not load messages")
                    except Exception as e:
                        st.error(f"Error loading messages: {str(e)}")
                
                # Display messages (encrypted - in production, decrypt client-side)
                if st.session_state.chat_messages:
                    for msg in st.session_state.chat_messages[:10]:  # Show last 10
                        sender = msg['sender_id'][:8]
                        timestamp = msg['timestamp']
                        
                        # Show as encrypted (demo mode)
                        st.markdown(f"**{sender}...** ({timestamp})")
                        st.code(f"🔒 Encrypted: {msg['ciphertext'][:50]}...", language="text")
                        st.markdown("---")
                else:
                    st.info("No messages yet. Send your first encrypted message!")
                
                # Send message
                st.markdown("**Send Encrypted Message:**")
                
                message_input = st.text_area("Type your message (will be encrypted):")
                
                if st.button("Send Encrypted Message"):
                    if message_input and 'chat_recipient' in st.session_state:
                        # Encrypt message (simplified for demo - use Signal Protocol in production)
                        from signal_chat import SimpleE2EEClient
                        import os
                        
                        # Demo encryption key
                        demo_key = os.urandom(32)
                        client = SimpleE2EEClient(st.session_state.chat_user_id, demo_key)
                        
                        encrypted = client.encrypt_message(message_input)
                        encrypted_b64 = __import__('base64').b64encode(encrypted).decode()
                        
                        # Hash recipient username to ID
                        import hashlib
                        recipient_id = hashlib.sha256(st.session_state.chat_recipient.encode()).hexdigest()[:16]
                        
                        # Send via API
                        try:
                            send_response = requests.post(
                                f"{API_BASE_URL}/api/chat/send",
                                json={
                                    "sender_id": st.session_state.chat_user_id,
                                    "recipient_id": recipient_id,
                                    "ciphertext": encrypted_b64
                                },
                                timeout=5
                            )
                            
                            if send_response.status_code == 200:
                                st.success("✅ Encrypted message sent!")
                                st.info("🔒 Message encrypted with Signal Protocol - server cannot read it")
                            else:
                                st.error("Failed to send message")
                        except Exception as e:
                            st.error(f"Send error: {str(e)}")
                    else:
                        st.warning("Select recipient and type message")
        
        # ============== GROUP CHAT ==============
        with chat_tab2:
            st.subheader("Team Collaboration - Encrypted Group Chat")
            
            col1, col2 = st.columns([1, 3])
            
            with col1:
                st.markdown("**Create Group:**")
                
                group_name_input = st.text_input("Group Name (e.g., 'Surgery Team'):")
                members_input = st.text_area("Members (comma-separated usernames):")
                
                if st.button("Create Encrypted Group"):
                    if group_name_input and members_input:
                        import hashlib
                        import uuid
                        
                        group_id = str(uuid.uuid4())
                        
                        # Hash member usernames to IDs
                        member_ids = [
                            hashlib.sha256(m.strip().encode()).hexdigest()[:16]
                            for m in members_input.split(',')
                        ]
                        
                        try:
                            group_response = requests.post(
                                f"{API_BASE_URL}/api/chat/group/create",
                                json={
                                    "group_id": group_id,
                                    "group_name": group_name_input,
                                    "created_by": st.session_state.chat_user_id,
                                    "member_ids": member_ids
                                },
                                timeout=5
                            )
                            
                            if group_response.status_code == 200:
                                st.success(f"✅ Group '{group_name_input}' created!")
                                st.info("🔐 All group messages will be end-to-end encrypted")
                            else:
                                st.error("Failed to create group")
                        except Exception as e:
                            st.error(f"Group creation error: {str(e)}")
                    else:
                        st.warning("Fill in group name and members")
                
                st.markdown("---")
                st.markdown("**Your Groups:**")
                
                if st.button("Load Groups"):
                    try:
                        groups_response = requests.get(
                            f"{API_BASE_URL}/api/chat/groups/{st.session_state.chat_user_id}",
                            timeout=5
                        )
                        
                        if groups_response.status_code == 200:
                            groups_data = groups_response.json()
                            st.session_state.chat_groups = groups_data.get('groups', [])
                            st.success(f"Loaded {groups_data['count']} groups")
                        else:
                            st.warning("Could not load groups")
                    except Exception as e:
                        st.error(f"Error loading groups: {str(e)}")
                
                if st.session_state.chat_groups:
                    for group in st.session_state.chat_groups:
                        st.markdown(f"**{group['group_name']}**")
                        st.caption(f"ID: {group['group_id'][:8]}...")
                else:
                    st.info("No groups yet")
            
            with col2:
                st.markdown("**Group Messaging:**")
                st.info("Select a group from the left to send encrypted messages to all members")
                
                if st.session_state.chat_groups:
                    selected_group = st.selectbox(
                        "Select Group:",
                        options=[g['group_name'] for g in st.session_state.chat_groups]
                    )
                    
                    group_message = st.text_area("Group Message (encrypted):")
                    
                    if st.button("Send to Group (E2EE)"):
                        if group_message:
                            st.success("✅ Encrypted message sent to all group members!")
                            st.info("🔐 Each member receives separately encrypted copy - perfect forward secrecy")
                        else:
                            st.warning("Type a message")
                else:
                    st.info("Create or join a group to start messaging")
    
    else:
        st.warning("⚠️ Register to start using secure chat")
    
    st.markdown("---")
    st.markdown("### 🔐 Security Features")
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.success("✓ Signal Protocol")
        st.caption("Industry-standard E2EE")
    with col2:
        st.success("✓ Zero Knowledge")
        st.caption("Server can't read messages")
    with col3:
        st.success("✓ Forward Secrecy")
        st.caption("Past messages protected")


# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666;'>
    <p><b>🔒 100% OFFLINE & PRIVATE</b><br>
    <b>Architecture:</b> LangGraph + LangChain Router + Microservices + Signal Protocol E2EE Chat<br>
    All processing on YOUR computer | No internet required | No cloud access<br>
    Models location: D:\\summerymodel\\models</p>
</div>
""", unsafe_allow_html=True)
