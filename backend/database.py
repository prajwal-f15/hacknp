"""
Database for encrypted history storage
SQLite with encrypted medical data
"""

import sqlite3
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import json
import logging

logger = logging.getLogger(__name__)


class HistoryDatabase:
    """Encrypted history storage"""
    
    def __init__(self, db_path: str = "medical_history.db"):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Processing history table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS processing_history (
                task_id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                file_name TEXT,
                file_type TEXT,
                encrypted_result TEXT,
                processing_time REAL,
                status TEXT,
                expires_at TIMESTAMP
            )
        """)
        
        # Audio files table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS audio_files (
                audio_id TEXT PRIMARY KEY,
                task_id TEXT,
                encrypted_audio BLOB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                FOREIGN KEY (task_id) REFERENCES processing_history(task_id)
            )
        """)
        
        # Activity logs table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS activity_logs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                task_id TEXT,
                action TEXT,
                status TEXT,
                details TEXT
            )
        """)
        
        # Settings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        """)
        
        # Set default retention period
        cursor.execute("""
            INSERT OR IGNORE INTO settings (key, value) 
            VALUES ('history_retention_days', 'forever')
        """)
        
        conn.commit()
        conn.close()
        logger.info("Database initialized")
    
    def save_result(self, task_id: str, encrypted_result: str, 
                   file_name: str, file_type: str, processing_time: float,
                   retention_days: Optional[int] = None):
        """Save encrypted processing result"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Calculate expiration
        if retention_days:
            expires_at = datetime.now() + timedelta(days=retention_days)
        else:
            expires_at = None
        
        cursor.execute("""
            INSERT OR REPLACE INTO processing_history 
            (task_id, file_name, file_type, encrypted_result, processing_time, status, expires_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (task_id, file_name, file_type, encrypted_result, processing_time, 'completed', expires_at))
        
        conn.commit()
        conn.close()
        logger.info(f"Saved encrypted result for task {task_id}")
    
    def save_audio(self, audio_id: str, task_id: str, encrypted_audio: bytes):
        """Save encrypted audio file (auto-expires in 30 days)"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        expires_at = datetime.now() + timedelta(days=30)
        
        cursor.execute("""
            INSERT OR REPLACE INTO audio_files 
            (audio_id, task_id, encrypted_audio, expires_at)
            VALUES (?, ?, ?, ?)
        """, (audio_id, task_id, encrypted_audio, expires_at))
        
        conn.commit()
        conn.close()
        logger.info(f"Saved encrypted audio for task {task_id} (expires in 30 days)")
    
    def get_result(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve encrypted result"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT task_id, created_at, file_name, file_type, 
                   encrypted_result, processing_time, status
            FROM processing_history
            WHERE task_id = ? AND (expires_at IS NULL OR expires_at > datetime('now'))
        """, (task_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        if row:
            return {
                'task_id': row[0],
                'created_at': row[1],
                'file_name': row[2],
                'file_type': row[3],
                'encrypted_result': row[4],
                'processing_time': row[5],
                'status': row[6]
            }
        return None
    
    def get_audio(self, audio_id: str) -> Optional[bytes]:
        """Retrieve encrypted audio file"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT encrypted_audio
            FROM audio_files
            WHERE audio_id = ? AND expires_at > datetime('now')
        """, (audio_id,))
        
        row = cursor.fetchone()
        conn.close()
        
        return row[0] if row else None
    
    def get_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent processing history"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT task_id, created_at, file_name, file_type, status, processing_time
            FROM processing_history
            WHERE expires_at IS NULL OR expires_at > datetime('now')
            ORDER BY created_at DESC
            LIMIT ?
        """, (limit,))
        
        rows = cursor.fetchall()
        conn.close()
        
        return [{
            'task_id': row[0],
            'created_at': row[1],
            'file_name': row[2],
            'file_type': row[3],
            'status': row[4],
            'processing_time': row[5]
        } for row in rows]
    
    def log_activity(self, task_id: str, action: str, status: str, details: str = ""):
        """Log activity"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO activity_logs (task_id, action, status, details)
            VALUES (?, ?, ?, ?)
        """, (task_id, action, status, details))
        
        conn.commit()
        conn.close()
    
    def cleanup_expired(self):
        """Delete expired records and audio files"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Count expired items
        cursor.execute("""
            SELECT COUNT(*) FROM processing_history 
            WHERE expires_at IS NOT NULL AND expires_at <= datetime('now')
        """)
        expired_results = cursor.fetchone()[0]
        
        cursor.execute("""
            SELECT COUNT(*) FROM audio_files 
            WHERE expires_at <= datetime('now')
        """)
        expired_audio = cursor.fetchone()[0]
        
        # Delete expired
        cursor.execute("""
            DELETE FROM processing_history 
            WHERE expires_at IS NOT NULL AND expires_at <= datetime('now')
        """)
        
        cursor.execute("""
            DELETE FROM audio_files 
            WHERE expires_at <= datetime('now')
        """)
        
        conn.commit()
        conn.close()
        
        logger.info(f"Cleanup: Deleted {expired_results} results, {expired_audio} audio files")
        return expired_results, expired_audio
    
    def set_retention_policy(self, days: str):
        """Set history retention policy"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            UPDATE settings SET value = ? WHERE key = 'history_retention_days'
        """, (days,))
        
        conn.commit()
        conn.close()
    
    def get_retention_policy(self) -> str:
        """Get current retention policy"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT value FROM settings WHERE key = 'history_retention_days'
        """)
        
        row = cursor.fetchone()
        conn.close()
        
        return row[0] if row else 'forever'
    
    def get_stats(self) -> Dict[str, int]:
        """Get database statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM processing_history")
        total_results = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM audio_files")
        total_audio = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM activity_logs")
        total_logs = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'total_results': total_results,
            'total_audio': total_audio,
            'total_logs': total_logs
        }
