from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
from dotenv import load_dotenv
import asyncio

# Challenge 1 Imports
from emotion_analyzer import EmotionAnalyzer
from tts_engine import TTSEngine

# Challenge 2 Imports
from story_processor import StoryProcessor
from image_generator import ImageGenerator

load_dotenv()

app = FastAPI(title="Darwix AI Unified Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize all models on startup
analyzer = EmotionAnalyzer()
tts = TTSEngine()
story_processor = StoryProcessor()
image_generator = ImageGenerator()

# --- CHALLENGE 1 ENDPOINT ---
class VoiceInput(BaseModel):
    text: str

@app.post("/api/generate-voice")
async def generate_empathetic_voice(input_data: VoiceInput):
    analysis = analyzer.analyze(input_data.text)
    ssml_code, audio_bytes = tts.generate_audio(
        text=input_data.text, 
        emotion=analysis["emotion"], 
        intensity=analysis["intensity"]
    )
    audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
    
    return {
        "metadata": {
            "primary_emotion": analysis["emotion"],
            "intensity_score": analysis["intensity"],
            "emotion_distribution": analysis["top_three"],
            "ssml_generated": ssml_code
        },
        "audio_data": audio_base64
    }

# --- CHALLENGE 2 ENDPOINT ---
class StoryInput(BaseModel):
    text: str
    style: str = "Cinematic lighting, photorealistic, 8k resolution" # Default style

@app.post("/api/generate-storyboard")
async def generate_storyboard(input_data: StoryInput):
    try:
        # 1. Ask Gemini to segment the story and engineer the prompts
        print(f"Segmenting story with style: {input_data.style}")
        storyboard_data = story_processor.process_story(input_data.text, input_data.style)
        
        # 2. Iterate through the Gemini segments and generate images sequentially
        # (Sequential is safer for the free Hugging Face API tier to avoid rate limits)
        for panel in storyboard_data:
            print(f"Generating image for: {panel['caption'][:30]}...")
            b64_image = image_generator.generate_image(panel['image_prompt'])
            panel['image_base64'] = b64_image
            
        return {"storyboard": storyboard_data}

    except Exception as e:
        print(f"Storyboard Generation Failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)