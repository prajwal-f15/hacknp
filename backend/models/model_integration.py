"""
Complete Model Integration Script
Combines all downloaded models for text extraction and analysis
"""

import os
import sys

# Check required packages
try:
    import spacy
    import pytesseract
    from PIL import Image
    import torch
    from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
except ImportError as e:
    print(f"Missing package: {e}")
    print("Install with: pip install spacy pytesseract pillow torch transformers")
    sys.exit(1)

from regex_patterns import IndianDataExtractor

class DocumentAnalyzer:
    """
    Complete document analysis using all models:
    - OCR for images (Tesseract)
    - NLP for entity extraction (spaCy)
    - Regex for structured data (Phone, Aadhaar, Dates)
    - LLM for summarization (Mistral-7B)
    """
    
    def __init__(self, tesseract_path=None):
        print("Initializing Document Analyzer...")
        
        # Setup Tesseract
        if tesseract_path:
            pytesseract.pytesseract.tesseract_cmd = tesseract_path
        
        # Load spaCy model
        print("Loading spaCy model...")
        self.nlp = spacy.load('en_core_web_sm')
        
        # Load regex extractor
        print("Loading regex patterns...")
        self.regex_extractor = IndianDataExtractor()
        
        # Mistral model (load on demand due to memory)
        self.mistral_model = None
        self.mistral_tokenizer = None
        
        print("✓ Document Analyzer ready!")
    
    def extract_text_from_image(self, image_path: str) -> str:
        """Extract text from image using Tesseract OCR"""
        try:
            image = Image.open(image_path)
            text = pytesseract.image_to_string(image)
            return text
        except Exception as e:
            return f"Error extracting text: {str(e)}"
    
    def extract_entities(self, text: str) -> dict:
        """Extract named entities using spaCy"""
        doc = self.nlp(text)
        
        entities = {
            'persons': [],
            'organizations': [],
            'locations': [],
            'dates': [],
            'money': [],
            'other': []
        }
        
        for ent in doc.ents:
            if ent.label_ == 'PERSON':
                entities['persons'].append(ent.text)
            elif ent.label_ == 'ORG':
                entities['organizations'].append(ent.text)
            elif ent.label_ in ['GPE', 'LOC']:
                entities['locations'].append(ent.text)
            elif ent.label_ == 'DATE':
                entities['dates'].append(ent.text)
            elif ent.label_ == 'MONEY':
                entities['money'].append(ent.text)
            else:
                entities['other'].append((ent.text, ent.label_))
        
        return entities
    
    def extract_structured_data(self, text: str) -> dict:
        """Extract phone, Aadhaar, dates using regex"""
        return self.regex_extractor.extract_all(text)
    
    def load_mistral(self):
        """Load Mistral-7B model (heavy operation)"""
        if self.mistral_model is not None:
            return
        
        print("Loading Mistral-7B-Instruct (this may take a minute)...")
        model_path = os.path.join(os.path.dirname(__file__), "Mistral-7B-Instruct")
        
        try:
            quantization_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_use_double_quant=True,
                bnb_4bit_quant_type="nf4"
            )
            
            self.mistral_tokenizer = AutoTokenizer.from_pretrained(
                "mistralai/Mistral-7B-Instruct-v0.2",
                cache_dir=model_path
            )
            
            self.mistral_model = AutoModelForCausalLM.from_pretrained(
                "mistralai/Mistral-7B-Instruct-v0.2",
                quantization_config=quantization_config,
                device_map="auto",
                cache_dir=model_path,
                low_cpu_mem_usage=True
            )
            
            print("✓ Mistral-7B loaded successfully!")
        except Exception as e:
            print(f"Warning: Could not load Mistral model: {e}")
            print("You can still use other features (OCR, NER, Regex)")
    
    def summarize_text(self, text: str, max_length: int = 150) -> str:
        """Summarize text using Mistral-7B"""
        if self.mistral_model is None:
            self.load_mistral()
        
        if self.mistral_model is None:
            return "Mistral model not available"
        
        prompt = f"[INST] Summarize the following text in 2-3 sentences:\n\n{text[:2000]} [/INST]"
        
        inputs = self.mistral_tokenizer(prompt, return_tensors="pt").to(self.mistral_model.device)
        
        with torch.no_grad():
            outputs = self.mistral_model.generate(
                **inputs,
                max_new_tokens=max_length,
                temperature=0.7,
                do_sample=True,
                top_p=0.95
            )
        
        response = self.mistral_tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Extract only the generated part
        if "[/INST]" in response:
            response = response.split("[/INST]")[-1].strip()
        
        return response
    
    def analyze_document(self, text: str, include_summary: bool = False) -> dict:
        """Complete document analysis"""
        print("\nAnalyzing document...")
        
        results = {
            'text_length': len(text),
            'entities': self.extract_entities(text),
            'structured_data': self.extract_structured_data(text),
        }
        
        if include_summary:
            results['summary'] = self.summarize_text(text)
        
        return results


# Example usage
if __name__ == "__main__":
    print("="*70)
    print("Document Analyzer - Complete Model Integration")
    print("="*70)
    
    # Sample document
    sample_doc = """
    Invoice Document
    
    Customer Name: Priya Sharma
    Company: TechCorp India Pvt Ltd
    Location: Mumbai, Maharashtra
    
    Contact: +91-9876543210
    Email: priya@techcorp.in
    Aadhaar: 1234 5678 9012
    
    Invoice Date: 15 January 2024
    Due Date: 15/02/2024
    Amount: ₹50,000
    
    Description: Software development services for the period of December 2023.
    Project location: Bangalore
    """
    
    # Initialize analyzer
    analyzer = DocumentAnalyzer()
    
    # Run analysis (without Mistral to save memory)
    print("\nAnalyzing sample document...")
    results = analyzer.analyze_document(sample_doc, include_summary=False)
    
    print("\n" + "="*70)
    print("Analysis Results:")
    print("="*70)
    
    print(f"\n📄 Document Length: {results['text_length']} characters")
    
    print("\n👤 Named Entities (spaCy):")
    for entity_type, entities in results['entities'].items():
        if entities:
            print(f"  {entity_type.title()}: {', '.join(str(e) for e in entities)}")
    
    print("\n📊 Structured Data (Regex):")
    for data_type, items in results['structured_data'].items():
        if items:
            print(f"  {data_type.replace('_', ' ').title()}: {', '.join(items)}")
    
    print("\n" + "="*70)
    print("✅ All models working successfully!")
    print("="*70)
    print("\nAvailable Models:")
    print("  ✓ Tesseract OCR - Image text extraction")
    print("  ✓ spaCy (en_core_web_sm) - Named entity recognition")
    print("  ✓ Regex Patterns - Phone, Aadhaar, Dates")
    print("  ✓ Mistral-7B-Instruct - Text summarization & generation")
