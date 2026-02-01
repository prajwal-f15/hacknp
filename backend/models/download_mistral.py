"""
Download Mistral-7B-Instruct model with 4-bit quantization for RTX 4060 Laptop GPU
This script downloads the model optimized for systems with 4GB VRAM
"""

from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import torch
import os

# Set the models directory
models_dir = os.path.dirname(os.path.abspath(__file__))
model_name = "mistralai/Mistral-7B-Instruct-v0.2"
local_model_path = os.path.join(models_dir, "Mistral-7B-Instruct")

print(f"System Info:")
print(f"  PyTorch Version: {torch.__version__}")
print(f"  CUDA Available: {torch.cuda.is_available()}")
if torch.cuda.is_available():
    print(f"  CUDA Device: {torch.cuda.get_device_name(0)}")
    print(f"  CUDA Memory: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.2f} GB")
print()

# Configure 4-bit quantization
print("Configuring 4-bit quantization for efficient memory usage...")
quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

print(f"\nDownloading Mistral-7B-Instruct model...")
print(f"Model: {model_name}")
print(f"Saving to: {local_model_path}")
print(f"Configuration: 4-bit quantization (optimized for 4GB VRAM)")
print("\nThis may take several minutes depending on your internet speed...")
print("Model size: ~4GB (quantized from 14GB)")
print()

try:
    # Download tokenizer
    print("Downloading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(
        model_name,
        cache_dir=local_model_path,
        trust_remote_code=True
    )
    print("✓ Tokenizer downloaded successfully")
    
    # Download model with quantization
    print("\nDownloading model (this will take a while)...")
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        quantization_config=quantization_config,
        device_map="auto",
        cache_dir=local_model_path,
        trust_remote_code=True,
        low_cpu_mem_usage=True
    )
    print("✓ Model downloaded successfully")
    
    # Test the model
    print("\nTesting model with a simple prompt...")
    test_prompt = "What is artificial intelligence?"
    inputs = tokenizer(test_prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=50,
            temperature=0.7,
            do_sample=True
        )
    
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    print(f"\nTest Response:")
    print(f"Prompt: {test_prompt}")
    print(f"Response: {response}")
    
    print("\n" + "="*60)
    print("✅ Mistral-7B-Instruct successfully downloaded and tested!")
    print("="*60)
    print(f"\nModel Location: {local_model_path}")
    print("\nModel Details:")
    print("  - Parameters: 7 billion")
    print("  - Quantization: 4-bit NF4")
    print("  - Memory Usage: ~4GB VRAM + ~4GB RAM")
    print("  - Recommended for: RTX 4060 (4GB VRAM)")
    print("\nYou can now use this model for text generation and instruction following!")
    
except Exception as e:
    print(f"\n❌ Error downloading model: {str(e)}")
    print("\nIf you're running low on disk space or VRAM, consider:")
    print("  1. Using a smaller model like Mistral-7B-v0.1")
    print("  2. Using GGUF format with llama.cpp for CPU inference")
    print("  3. Using online APIs instead of local models")
