import os
import json
from google import genai
from google.genai import types

class StoryProcessor:
    def __init__(self):
        # We will use the ultra-fast Gemini 2.5 Flash model
        # Ensure GEMINI_API_KEY is set in your environment
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        self.model_id = 'gemini-2.5-flash'

    def process_story(self, narrative_text: str, visual_style: str) -> list:
        """
        Intelligently segments a narrative and supercharges prompts for image generation.
        Fulfills Bonus Objectives: LLM-Powered Prompts & Visual Consistency.
        """
        
        system_prompt = f"""
        You are an expert cinematic storyboard director and AI prompt engineer. 
        Your job is to take a sales pitch or customer success story and break it down into 3 to 5 logical scenes.
        
        For each scene, generate a highly detailed, visually descriptive prompt for an AI image generator (like Stable Diffusion).
        
        CRITICAL INSTRUCTIONS FOR VISUAL CONSISTENCY:
        Every single image prompt MUST rigidly adhere to the following visual style: "{visual_style}".
        Append highly specific keywords related to this style (lighting, camera angle, medium) to every prompt to ensure all images look like they belong in the same presentation deck.
        
        Respond ONLY with a valid JSON array of objects. Do not use markdown blocks. Each object must have exactly two keys:
        1. "caption": The original segment of the story (1-2 sentences).
        2. "image_prompt": The supercharged, highly descriptive visual prompt ending with the style keywords.
        """

        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=narrative_text,
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.7, # Slight creativity for prompt generation
                    response_mime_type="application/json", # Forces Gemini to return pure JSON
                ),
            )
            
            # Parse the JSON string returned by Gemini into a Python list of dictionaries
            storyboard_data = json.loads(response.text)
            return storyboard_data
            
        except Exception as e:
            print(f"Error processing story with Gemini: {e}")
            raise e