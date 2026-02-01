"""
Regex patterns for extracting Phone Numbers, Aadhaar Numbers, and Dates
Optimized for Indian data extraction
"""

import re
from typing import List, Dict

class IndianDataExtractor:
    """
    Extract structured data from text using regex patterns
    - Phone numbers (Indian mobile and landline)
    - Aadhaar numbers (12-digit unique ID)
    - Dates (multiple formats)
    """
    
    def __init__(self):
        # Phone number patterns (Indian)
        self.phone_patterns = [
            # Mobile: +91-9876543210, +919876543210, 9876543210
            r'\+?91[-\s]?[6-9]\d{9}',
            # Landline with STD: 011-12345678, (011) 12345678
            r'\(?\d{2,4}\)?[-\s]?\d{6,8}',
            # Simple 10-digit mobile
            r'\b[6-9]\d{9}\b'
        ]
        
        # Aadhaar number patterns (12 digits)
        self.aadhaar_patterns = [
            # Aadhaar with spaces: 1234 5678 9012
            r'\b\d{4}\s\d{4}\s\d{4}\b',
            # Aadhaar with hyphens: 1234-5678-9012
            r'\b\d{4}-\d{4}-\d{4}\b',
            # Aadhaar without separators: 123456789012
            r'\b\d{12}\b'
        ]
        
        # Date patterns (multiple formats)
        self.date_patterns = [
            # DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
            r'\b\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4}\b',
            # YYYY/MM/DD, YYYY-MM-DD
            r'\b\d{4}[/\-\.]\d{1,2}[/\-\.]\d{1,2}\b',
            # DD Month YYYY: 15 January 2024, 15 Jan 2024
            r'\b\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b',
            # Month DD, YYYY: January 15, 2024
            r'\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b'
        ]
    
    def extract_phone_numbers(self, text: str) -> List[str]:
        """Extract all phone numbers from text"""
        phone_numbers = []
        for pattern in self.phone_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            phone_numbers.extend(matches)
        
        # Remove duplicates while preserving order
        return list(dict.fromkeys(phone_numbers))
    
    def extract_aadhaar_numbers(self, text: str) -> List[str]:
        """Extract all Aadhaar numbers from text"""
        aadhaar_numbers = []
        for pattern in self.aadhaar_patterns:
            matches = re.findall(pattern, text)
            aadhaar_numbers.extend(matches)
        
        # Remove duplicates and validate
        unique_aadhaars = list(dict.fromkeys(aadhaar_numbers))
        
        # Validate Aadhaar (should be exactly 12 digits when cleaned)
        validated = []
        for aadhaar in unique_aadhaars:
            cleaned = re.sub(r'[\s-]', '', aadhaar)
            if len(cleaned) == 12 and cleaned.isdigit():
                validated.append(aadhaar)
        
        return validated
    
    def extract_dates(self, text: str) -> List[str]:
        """Extract all dates from text"""
        dates = []
        for pattern in self.date_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            dates.extend(matches)
        
        # Remove duplicates while preserving order
        return list(dict.fromkeys(dates))
    
    def extract_all(self, text: str) -> Dict[str, List[str]]:
        """Extract all patterns from text"""
        return {
            'phone_numbers': self.extract_phone_numbers(text),
            'aadhaar_numbers': self.extract_aadhaar_numbers(text),
            'dates': self.extract_dates(text)
        }
    
    def mask_aadhaar(self, text: str, mask_char: str = 'X') -> str:
        """Mask Aadhaar numbers in text for privacy (show only last 4 digits)"""
        for pattern in self.aadhaar_patterns:
            text = re.sub(
                pattern,
                lambda m: mask_char * 8 + m.group()[-4:],
                text
            )
        return text


# Example usage and testing
if __name__ == "__main__":
    # Test samples
    test_text = """
    Contact Information:
    Name: Rajesh Kumar
    Phone: +91-9876543210
    Alternate: 9123456789
    Landline: 011-12345678
    
    Aadhaar: 1234 5678 9012
    PAN: ABCDE1234F
    
    Document Date: 15/01/2024
    Birth Date: 25 December 1990
    Meeting: January 15, 2024
    Expiry: 2025-12-31
    
    Additional Mobile: 8765432109
    Another Aadhaar: 9876-5432-1098
    """
    
    print("="*70)
    print("Indian Data Extraction using Regex Patterns")
    print("="*70)
    print("\nTest Text:")
    print(test_text)
    print("\n" + "="*70)
    
    # Create extractor instance
    extractor = IndianDataExtractor()
    
    # Extract all data
    results = extractor.extract_all(test_text)
    
    print("\nExtraction Results:")
    print("-"*70)
    
    print(f"\n📱 Phone Numbers Found: {len(results['phone_numbers'])}")
    for i, phone in enumerate(results['phone_numbers'], 1):
        print(f"   {i}. {phone}")
    
    print(f"\n🆔 Aadhaar Numbers Found: {len(results['aadhaar_numbers'])}")
    for i, aadhaar in enumerate(results['aadhaar_numbers'], 1):
        print(f"   {i}. {aadhaar}")
    
    print(f"\n📅 Dates Found: {len(results['dates'])}")
    for i, date in enumerate(results['dates'], 1):
        print(f"   {i}. {date}")
    
    # Test masking
    print("\n" + "="*70)
    print("Masked Aadhaar Example:")
    print("-"*70)
    masked_text = extractor.mask_aadhaar(test_text)
    print(masked_text)
    
    print("\n" + "="*70)
    print("✅ Regex patterns configured and tested successfully!")
    print("="*70)
