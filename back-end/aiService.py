from transformers import pipeline

# Load a text generation pipeline
generator = pipeline('text-generation', model='gpt2')

def generate_text(prompt):
    # Generate text using the model
    result = generator(prompt, max_length=50, num_return_sequences=1)
    return result[0]['generated_text']

if __name__ == "__main__":
    import sys
    prompt = sys.argv[1]
    print(generate_text(prompt))
