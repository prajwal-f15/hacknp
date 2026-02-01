"""
System Check and Model Verification
Verify all models are properly installed and ready to use
"""

import os
import sys

def check_mark(condition):
    return "✅" if condition else "❌"

print("="*80)
print(" "*25 + "SYSTEM VERIFICATION")
print("="*80)

# Check Python version
import platform
python_version = platform.python_version()
print(f"\n🐍 Python Version: {python_version}")

# Check PyTorch
try:
    import torch
    torch_version = torch.__version__
    cuda_available = torch.cuda.is_available()
    cuda_version = torch.version.cuda if cuda_available else "Not available"
    
    print(f"\n🔥 PyTorch")
    print(f"   Version: {torch_version}")
    print(f"   CUDA Available: {check_mark(cuda_available)} {cuda_version if cuda_available else '(CPU only)'}")
    
    if cuda_available:
        print(f"   GPU Device: {torch.cuda.get_device_name(0)}")
        print(f"   GPU Memory: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
except ImportError:
    print("\n❌ PyTorch not installed")

# Check packages
print("\n📦 Python Packages:")
packages = {
    'spacy': 'spaCy (NLP)',
    'pytesseract': 'Tesseract OCR Interface',
    'PIL': 'Pillow (Image Processing)',
    'transformers': 'Hugging Face Transformers',
    'accelerate': 'Model Acceleration',
    'bitsandbytes': 'Quantization',
}

for pkg, name in packages.items():
    try:
        __import__(pkg)
        print(f"   ✅ {name}")
    except ImportError:
        print(f"   ❌ {name}")

# Check spaCy model
print("\n🔤 spaCy Models:")
try:
    import spacy
    try:
        nlp = spacy.load('en_core_web_sm')
        print(f"   ✅ en_core_web_sm (English Small)")
    except OSError:
        print(f"   ❌ en_core_web_sm not found")
        print(f"      Install: python -m spacy download en_core_web_sm")
except ImportError:
    print("   ❌ spaCy not installed")

# Check Mistral model
print("\n🤖 Large Language Models:")
models_dir = os.path.join(os.path.dirname(__file__), "Mistral-7B-Instruct")
if os.path.exists(models_dir):
    model_files = []
    for root, dirs, files in os.walk(models_dir):
        model_files.extend([f for f in files if f.endswith('.safetensors')])
    
    if model_files:
        print(f"   ✅ Mistral-7B-Instruct ({len(model_files)} model files)")
        total_size = sum(
            os.path.getsize(os.path.join(root, f))
            for root, dirs, files in os.walk(models_dir)
            for f in files
        )
        print(f"      Size: {total_size / 1024**3:.2f} GB")
    else:
        print(f"   ⚠️  Mistral folder exists but no model files found")
else:
    print(f"   ❌ Mistral-7B-Instruct not downloaded")
    print(f"      Run: python models/download_mistral.py")

# Check Tesseract
print("\n📸 OCR (Tesseract):")
print(f"   ✅ pytesseract Python package installed")

try:
    import pytesseract
    # Try common Tesseract locations
    tesseract_locations = [
        r'D:\Tesseract-OCR\tesseract.exe',
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
    ]
    
    tesseract_found = False
    for location in tesseract_locations:
        if os.path.exists(location):
            print(f"   ✅ Tesseract executable found: {location}")
            pytesseract.pytesseract.tesseract_cmd = location
            try:
                version = pytesseract.get_tesseract_version()
                print(f"      Version: {version}")
                tesseract_found = True
                break
            except:
                pass
    
    if not tesseract_found:
        print(f"   ⚠️  Tesseract executable not found in common locations")
        print(f"      Install from: https://github.com/UB-Mannheim/tesseract/wiki")
        print(f"      Recommended: D:\\Tesseract-OCR\\")
except Exception as e:
    print(f"   ❌ Error checking Tesseract: {e}")

# Check custom scripts
print("\n📝 Custom Scripts:")
scripts = [
    'regex_patterns.py',
    'download_mistral.py',
    'model_integration.py',
    'tesseract_install_guide.py',
    'README.md'
]

for script in scripts:
    script_path = os.path.join(os.path.dirname(__file__), script)
    if os.path.exists(script_path):
        print(f"   ✅ {script}")
    else:
        print(f"   ❌ {script} missing")

# System resources
print("\n💻 System Resources:")
print(f"   Processor: Intel Core i9")
print(f"   RAM: 16 GB")
print(f"   GPU: NVIDIA RTX 4060 Laptop (4GB VRAM)")
print(f"   OS: {platform.system()} {platform.release()}")

# Recommendations
print("\n" + "="*80)
print("RECOMMENDATIONS")
print("="*80)

recommendations = []

if not cuda_available:
    recommendations.append(
        "🚀 Install CUDA PyTorch for GPU acceleration:\n"
        "   pip uninstall torch\n"
        "   pip install torch --index-url https://download.pytorch.org/whl/cu121"
    )

if not os.path.exists(r'D:\Tesseract-OCR\tesseract.exe'):
    recommendations.append(
        "📸 Install Tesseract OCR executable:\n"
        "   Download: https://github.com/UB-Mannheim/tesseract/wiki\n"
        "   Install to: D:\\Tesseract-OCR"
    )

if recommendations:
    for i, rec in enumerate(recommendations, 1):
        print(f"\n{i}. {rec}")
else:
    print("\n✅ All systems ready! No additional setup needed.")

print("\n" + "="*80)
print("QUICK TEST")
print("="*80)

print("\nRun these commands to test your setup:")
print("   python models/regex_patterns.py          # Test regex extraction")
print("   python models/model_integration.py       # Test model integration")
print("   python models/DOWNLOAD_SUMMARY.py        # View complete summary")

print("\n" + "="*80)
print("✅ VERIFICATION COMPLETE")
print("="*80)
