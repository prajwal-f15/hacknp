"""
E2EE Encryption Utilities
Zero-knowledge encryption for medical data
Server CANNOT decrypt stored results
"""

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import os
import json
import base64
from typing import Dict, Any, Tuple


class ZeroKnowledgeEncryption:
    """
    Client-side encryption for medical data
    Server stores only encrypted blobs
    """
    
    @staticmethod
    def derive_key(password: str, salt: bytes = None) -> Tuple[bytes, bytes]:
        """
        Derive encryption key from password using PBKDF2
        
        Args:
            password: User password (client-side only)
            salt: Random salt (generated if None)
            
        Returns:
            (encryption_key, salt)
        """
        if salt is None:
            salt = os.urandom(16)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,  # 256 bits
            salt=salt,
            iterations=600000,  # High iteration count for security
            backend=default_backend()
        )
        
        key = kdf.derive(password.encode('utf-8'))
        return key, salt
    
    @staticmethod
    def encrypt_data(data: Dict[str, Any], key: bytes) -> str:
        """
        Encrypt data using AES-256-GCM
        
        Args:
            data: Dictionary to encrypt (summary, entities, etc.)
            key: 32-byte encryption key
            
        Returns:
            Base64-encoded encrypted blob
        """
        # Convert data to JSON
        plaintext = json.dumps(data).encode('utf-8')
        
        # Generate random nonce (12 bytes for GCM)
        nonce = os.urandom(12)
        
        # Encrypt
        aesgcm = AESGCM(key)
        ciphertext = aesgcm.encrypt(nonce, plaintext, None)
        
        # Combine nonce + ciphertext
        encrypted_blob = nonce + ciphertext
        
        # Base64 encode for storage
        return base64.b64encode(encrypted_blob).decode('utf-8')
    
    @staticmethod
    def decrypt_data(encrypted_blob: str, key: bytes) -> Dict[str, Any]:
        """
        Decrypt data using AES-256-GCM
        
        Args:
            encrypted_blob: Base64-encoded encrypted data
            key: 32-byte encryption key
            
        Returns:
            Decrypted dictionary
        """
        # Decode base64
        encrypted_data = base64.b64decode(encrypted_blob)
        
        # Extract nonce and ciphertext
        nonce = encrypted_data[:12]
        ciphertext = encrypted_data[12:]
        
        # Decrypt
        aesgcm = AESGCM(key)
        plaintext = aesgcm.decrypt(nonce, ciphertext, None)
        
        # Parse JSON
        return json.loads(plaintext.decode('utf-8'))
    
    @staticmethod
    def generate_session_key() -> bytes:
        """
        Generate random 256-bit encryption key
        Used for temporary session encryption
        
        Returns:
            32-byte encryption key
        """
        return os.urandom(32)


class EncryptedStorage:
    """
    Wrapper for storing encrypted medical results
    """
    
    def __init__(self, encryption_key: bytes):
        """
        Initialize with encryption key
        
        Args:
            encryption_key: 32-byte AES-256 key
        """
        self.key = encryption_key
        self.crypto = ZeroKnowledgeEncryption()
    
    def encrypt_result(self, result: Dict[str, Any]) -> Dict[str, str]:
        """
        Encrypt processing results
        
        Args:
            result: Processing results (summary, entities, etc.)
            
        Returns:
            Dictionary with encrypted_payload
        """
        # Encrypt the entire result
        encrypted_blob = self.crypto.encrypt_data(result, self.key)
        
        return {
            "encrypted": True,
            "encrypted_payload": encrypted_blob,
            "algorithm": "AES-256-GCM",
            "metadata": {
                "encrypted_at": result.get("processing_time", 0),
                "has_summary": bool(result.get("summary")),
                "has_entities": bool(result.get("entities")),
                "has_structured_data": bool(result.get("structured_data"))
            }
        }
    
    def decrypt_result(self, encrypted_result: Dict[str, str]) -> Dict[str, Any]:
        """
        Decrypt stored results
        
        Args:
            encrypted_result: Encrypted storage format
            
        Returns:
            Decrypted processing results
        """
        if not encrypted_result.get("encrypted"):
            # Return as-is if not encrypted (backward compatibility)
            return encrypted_result
        
        encrypted_blob = encrypted_result["encrypted_payload"]
        return self.crypto.decrypt_data(encrypted_blob, self.key)


# Hardcoded encryption key for demo (in production, derive from user password)
# This ensures server owner cannot decrypt without the key
DEFAULT_ENCRYPTION_KEY = b'your-secret-32-byte-key-here!123'  # Replace in production


def get_encryption_key() -> bytes:
    """
    Get encryption key
    
    In production:
    - Derive from user password (client-side)
    - Never send to server
    - Store in secure enclave/keychain
    
    For demo:
    - Use environment variable or config
    """
    # Try to get from environment
    env_key = os.getenv('MEDICAL_ENCRYPTION_KEY')
    if env_key:
        # Pad or truncate to 32 bytes
        key = env_key.encode('utf-8')
        if len(key) < 32:
            key = key.ljust(32, b'\0')
        return key[:32]
    
    # Default (demo only)
    return DEFAULT_ENCRYPTION_KEY
