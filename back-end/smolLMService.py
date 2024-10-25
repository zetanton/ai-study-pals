from transformers import pipeline
import torch

# Check if MPS is available and set the device accordingly
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

# Load a text generation pipeline with DistilGPT-2
generator = pipeline("text-generation", model="distilgpt2", device=0 if device.type == "mps" else -1)

def generate_text(prompt, priming_text="", max_length=200, num_return_sequences=1, temperature=1.0, top_k=50, top_p=0.95):
    # Combine priming text with the user's prompt
    full_prompt = priming_text + prompt
    
    # Generate text using the model with the combined prompt
    result = generator(
        full_prompt, 
        max_length=max_length, 
        num_return_sequences=num_return_sequences, 
        temperature=temperature, 
        top_k=top_k, 
        top_p=top_p
    )
    return result[0]['generated_text']

if __name__ == "__main__":
    import sys
    prompt = sys.argv[1]
    print(generate_text(prompt))
