import os
import base64
import io
from huggingface_hub import InferenceClient

class ImageGenerator:
    def __init__(self):
        # Uses the Hugging Face token from your environment variables
        self.client = InferenceClient(token=os.environ.get("HF_TOKEN"))
        # Stable Diffusion XL provides state-of-the-art, high-resolution generation
        self.model_id = "stabilityai/stable-diffusion-xl-base-1.0"

    def generate_image(self, prompt: str) -> str:
        """
        Calls the HF Inference API to generate an image from the text prompt.
        Returns a Base64 encoded string of the PNG image.
        """
        try:
            # The client returns a PIL Image object
            image = self.client.text_to_image(
                prompt=prompt,
                model=self.model_id
            )
            
            # Convert the PIL image to a byte buffer, then to Base64
            buffered = io.BytesIO()
            image.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
            
            return img_str
        except Exception as e:
            print(f"Error generating image for prompt '{prompt}': {e}")
            # If the API times out or fails, return an empty string to prevent full crashes
            return ""