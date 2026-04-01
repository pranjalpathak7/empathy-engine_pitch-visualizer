# Darwix AI: Unified Platform Architecture
**Internship Assessment Submission**

## 📌 Project Overview
Instead of submitting two disjointed scripts, I decided to engineer a unified, enterprise-grade web application that houses both Challenge 1 (The Empathy Engine) and Challenge 2 (The Pitch Visualizer). 

This project bridges the gap between raw AI models and human-centric UX. It utilizes a FastAPI backend to orchestrate multiple state-of-the-art machine learning models (NLP, LLMs, Diffusion, and TTS) and serves them through a modular, state-preserving React dashboard styled with Tailwind CSS v4.

---

## 🚀 Setup & Execution Instructions

Follow these steps to get the enviroment running locally on your machine.

### Prerequisites
* Python 3.9+
* Node.js (v18+)
* Google Cloud CLI (`gcloud`) installed
* Free API Keys: Google Gemini & Hugging Face

### 1. API Key & Authentication Setup
This platform requires three distinct authentication methods to function properly:

**A. Google Cloud Wavenet (Application Default Credentials)**
We use ADC instead of insecure JSON keys. Open your terminal and run:

    gcloud auth application-default login

*(Follow the browser prompts to log in and select your Google Cloud Project with the Text-to-Speech API enabled).*

**B. External API Keys**
You need to set two enviroment variables in your backend terminal for Challenge 2:

* **Windows (PowerShell):**
  
        $env:GEMINI_API_KEY="your_gemini_key_here"
        $env:HF_TOKEN="your_huggingface_token_here"

* **Mac/Linux:**
  
        export GEMINI_API_KEY="your_gemini_key_here"
        export HF_TOKEN="your_huggingface_token_here"

### 2. Backend Initialization (FastAPI)
Open a terminal and navigate to the `backend` directory:

    cd backend
    python -m venv venv

Activate the virtual environment:
* Windows: `.\venv\Scripts\activate`
* Mac/Linux: `source venv/bin/activate`

Install dependencies and run the server:

    pip install -r requirements.txt
    python main.py

*(Note: The first run will take a moment to download the Hugging Face RoBERTa model to your local cache).*

### 3. Frontend Initialization (React + Vite)
Open a seperate terminal window, navigate to the `frontend` directory:

    cd frontend
    npm install
    npm run dev

Open `http://localhost:5173` in your browser to access the Darwix AI Unified Dashboard!

---

## 🧠 Challenge 1: The Empathy Engine

### Architectural Choices
* **TTS Engine:** I evaluated local models (`pyttsx3`) and cinematic APIs (ElevenLabs). `pyttsx3` failed the uncanny valley test, and ElevenLabs' free tier is too volatile for production assessments. I chose **Google Cloud Wavenet** because it strikes the perfect balance: it sounds incredibly human while allowing for strict, programmatic SSML manipulation.
* **Granular NLP:** I utilized the `j-hartmann/emotion-english-distilroberta-base` model. It detects 7 granular emotions and returns confidence scores, which I leverage for the "Intensity Scaling" bonus objective.
* **Base64 Transport:** Instead of saving `.mp3` files to the server and serving paths (which causes I/O bottlenecks), the audio is encoded directly to a Base64 string and sent inside a rich JSON payload alongside the neural metadata.

### Emotion-to-Voice Mapping Logic
The engine dynamically scales paramaters based on the model's confidence (`intensity`). 

* **Anger (The "Seething" Effect):** Pitch drops to -5.0st, volume is set to x-loud. If intensity is $\ge 0.8$, the algorithm splits the text and injects harsh `150ms` micro-pauses between every single word, wrapped in `<emphasis level="strong">`. This perfectly simulates a human speaking through gritted teeth.
* **Sadness:** Rate drops drastically (down to 70%), pitch is lowered to -6.0st, and volume is softened to emulate lethargy.
* **Joy:** Rate increases (up to 110%), pitch jumps to +5.0st, and volume is loud.
* **Fear & Surprise:** Fear utilizes a high pitch but soft volume for a breathy delivery, while Surprise maximizes pitch (+6.0st) and volume for sudden shock.

---

## 🎨 Challenge 2: The Pitch Visualizer

### Architectural Choices
* **The Brain (Gemini 2.5 Flash):** I used Gemini as the orchestration engine. It acts as an autonomous Prompt Engineer. It takes the raw narrative, slices it into dramatic beats, and supercharges each sentence into a highly detailed stable diffusion prompt. It was specifically instructed to return pure JSON, making the API response perfectly predictable.
* **The Visual Cortex (Hugging Face SDXL):** I piped the Gemini prompts into Stable Diffusion XL via the Hugging Face Serverless Inference API for high-resolution, state-of-the-art storyboard generation.
* **Visual Consistency Injection:** To achive the Visual Consistency bonus objective, I implemented a custom style parameter. The user can select a preset (e.g., "Cyberpunk Neon") or type their own custom aesthetic. Gemini algorithmically appends these lighting, camera, and medium keywords to *every single panel prompt* to ensure they look like a cohesive slide deck.

### UI / UX Design Philosophy
* **Horizontal Filmstrip:** Instead of a vertical layout that causes scroll-fatigue, I engineered a responsive, horizontal "neural timeline" that aligns perfectly using fixed-height image containers.
* **State Preservation:** To ensure a seamless experience when the user switches between the Empathy Engine and Pitch Visualizer tabs, I modularized the React components and used CSS rendering (`display: block` vs `hidden`) rather than React unmounting. This preserves all generated audio and Base64 images in memory without forcing the user to re-generate content when toggling views.