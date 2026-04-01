# Darwix AI: Unified Platform Architecture

**Internship Assessment Engineering Document**

## 📌 Executive Summary

Instead of submitting two completely seperate scripts for this assessment, I decided to engineer a unified, production-ready enterprise web platform. This application bridges the gap between raw machine learning models and human-centric UX. It utilizes a FastAPI backend to orchestrate multiple state-of-the-art models (NLP, LLMs, Image Diffusion, and TTS) and serves them through a modular, state-preserving React dashboard styled with Tailwind CSS v4.

Below is a detailed breakdown of the setup, architectural decisions, logical mappings, and critical limitations encountered during development.

## 🚀 Live Production Deployment

Before diving into the local setup, you can check out the fully deployed, live production version of the platform here:  
**[https://empathy-engine-pitch-visualizer.vercel.app/](https://empathy-engine-pitch-visualizer.vercel.app/)**

---

## GitHub Repository link

**[https://github.com/pranjalpathak7/empathy-engine_pitch-visualizer/](https://github.com/pranjalpathak7/empathy-engine_pitch-visualizer/)**

---

## 🛠️ Local Setup & Execution Instructions

If you want to run this architecture on your local machine, follow these detailed steps. This project relies on several cloud services, so authetication is a critical first step.

### Prerequisites

* **Python 3.9+** (For the FastAPI backend)
* **Node.js v18+** (For the Vite/React frontend)
* **Google Cloud CLI** (Required for secure TTS authentication)

### Step 1: Installing Google Cloud CLI & TTS Connection

Because Challenge 1 uses Google Cloud Wavenet for enterprise-grade audio, we need to securely connect to Google's servers. Instead of downloading highly insecure `.json` service account keys and leaving them in our codebase, we use **Application Default Credentials (ADC)**.

1. **Install the CLI:** Download and install the Google Cloud SDK for your specific OS from the [official Google Cloud docs](https://cloud.google.com/sdk/docs/install).
2. **Initialize & Login:** Open your Google cloud SDK shell and run the following command to log into your Google Cloud account and set your active project (ensure your project has the Cloud Text-to-Speech API enabled):

```bash
gcloud init
```

Generate the ADC: Run this specific command to securely download your temporary credentials to your local machine's hidden config folder. The Python google-cloud-texttospeech library will automatically find them here without us writing any authentication code!

```bash
gcloud auth application-default login
```

(A browser window will open. Click allow to grant permissions).

### Step 2: Backend Enviroment Setup (FastAPI)

Now we will set up the Python backend that orchestrates all the AI models.

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

Create and activate a secure virtual enviroment so we don't pollute your global Python installation:

* Windows: `python -m venv venv` then `.\venv\Scripts\activate`
* Mac/Linux: `python3 -m venv venv` then `source venv/bin/activate`

Install the required heavy machine learning dependencies (PyTorch, Transformers, FastAPI, etc.):

```bash
pip install -r requirements.txt
```

(Note: I specifically configured requirements.txt to download the CPU-only version of PyTorch to save massive amounts of disk space and memory).

### Step 3: Configuring the .env File (Crucial)

To run Challenge 2 (The Pitch Visualizer), we need to connect to Google Gemini and Hugging Face. We must store these keys securely.

Inside your backend/ folder, create a new file named exactly .env (do not add a .txt extension).

Paste your free API keys into this file exactly like this (no quotes around the values):

```plaintext
GEMINI_API_KEY=your_actual_gemini_key_here
HF_TOKEN=your_actual_huggingface_token_here
```

Why this matters: The main.py file uses python-dotenv to load these keys into memory the second the server boots. This ensures your keys are persistant across terminal sessions and securely hidden from version control (they are listed in our .dockerignore and .gitignore).

Boot the server!

```bash
python main.py
```

(The first run will take a minute as it downloads the HuggingFace distilroberta model to your local cache).

### Step 4: Frontend Setup (React + Vite)

With the backend humming along on port 8000, let's boot up the UI.

Open a seperate terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install the Node modules:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to http://localhost:5173.

Architectural Note on Routing: You do not need to configure any API URLs on the frontend! I engineered a smart switch (import.meta.env.DEV) inside the React components. When you run npm run dev, it automatically knows to route traffic to your local Python server (127.0.0.1:8000). When the app is built for production on Vercel, it automatically switches to route traffic to the live Google Cloud Run backend.

You are now succesfully running the entire Darwix AI Unified Platform locally!

---

## 🧠 Challenge 1: The Empathy Engine

The goal of this module was to escape the monotonic, robotic nature of standard text-to-speech by dynamically modulating vocal characteristics based on the source text's emotional undertone.

### 1. NLP Architecture & Intensity Scaling

I completely bypassed basic positive/negative sentiment analysis. To achive deep emotional resonance, I integrated the `j-hartmann/emotion-english-distilroberta-base` model via Hugging Face. This neural network classifies text into 7 granular emotions (joy, sadness, anger, fear, surprise, disgust, neutral) and returns a specific confidence score.

**The "Intensity" Logic:** I mapped the model's confidence score directly to an `intensity` variable. This means the engine doesn't just know *what* emotion to play, but *how hard* to play it. If the model is 95% confident the text is angry, the SSML paramaters are pushed to their absolute maximum limits. If it's only 55% confident, the engine applies a much softer, subtle modulation to avoid sounding un-natural.

### 2. Emotion-to-Voice SSML Mapping Strategy

To manipulate the audio, I programmatically generate complex Speech Synthesis Markup Language (SSML) payloads.

* **Anger (The "Seething" Effect):** Anger isn't always loud and fast; sometimes it is quiet and forceful. I drop the pitch heavily ($-5.0st$). If intensity is $\ge 0.8$, the algorithm splits the text string and injects harsh `150ms` `<break>` tags between *every single word*, wrapping the entire phrase in `<emphasis level="strong">`. This perfectly simulates a human speaking through gritted teeth.
* **Sadness:** Rate drops drastically (down to 70%), pitch is lowered to $-6.0st$, and volume is softened to emulate physical exhaustion and lethargy.
* **Fear & Surprise:** Fear utilizes a high pitch but specifically sets the volume to `soft` to create a breathy, trembling delivery. Surprise maximizes both pitch ($+6.0st$) and volume for sudden, jarring shock.
* **Joy (The "Euphoric" State):** Joy is relatively straighforward to synthesize because it aligns closely with the default "helpful" tone of standard TTS models. When the intensity is high, I increase the speaking rate to 115% and bump the pitch by +3.0st. This creates a sense of forward momentum and excitment without sounding artificially sped up.
* **Neutral (The Bypass Architecture):** If the NLP model returns 'Neutral', or if the calculated intensity of any emotion falls below our baseline threshold, the Empathy Engine executes an SSML bypass. Instead of applying unnesessary parametric tags, it passes the raw text directly to Google's API. This is a deliberate architectural choice to save compute cycles and allow the model to use its naturally optimized, conversational latent space for standard dialogue.

### ⚠️ Critical Discussion: The Limitations of Google Cloud TTS

While Google Cloud Wavenet sounds incredibly natural for standard reading, I quickly discovered a massive architectural limitation: **It is fundamentally incapable of expressing extreme, visceral emotions.** Google's models are trained primarily for virtual assistants, GPS navigation, and audiobook narration. They have a heavy "corporate neutral" bias baked into their latent space. When we try to force the engine to sound absolutely terrified or blindingly enraged using SSML tags (like cranking the pitch and rate), we aren't actually changing the *emotional intent* of the AI's voice actor. We are just taking a calm voice and artificially speeding it up or pitching it down. This inevitably causes the audio to slip back into the "uncanny valley," where extreme fear just sounds like a robot rushing through its words.

**The Enterprise Solution:** To solve this in a real production enviroment, we need to abandon parametric manipulation (SSML) and move to native neural emotional rendering. Paid alternatives like **ElevenLabs** or **OpenAI's TTS-1-HD** do not rely on SSML tags. Instead, their models understand the semantic context of the text and inherently generate the audio with the correct emotional inflection embedded directly into the waveform. Upgrading the backend to use the ElevenLabs API would instantly solve this bottleneck and allow for true, theatrical-grade emotional synthesis.

---

## 🎨 Challenge 2: The Pitch Visualizer

The Pitch Visualizer was fundamentally more complex because it required chaining two entirely different AI models together asynchronously. 

### 1. The LLM Brain (Gemini 2.5 Flash)

Instead of using basic python libraries like NLTK to blindly split sentences by periods, I implemented Google's Gemini 2.5 Flash as the core orchestration engine. Gemini acts as an autonomous, cinematic Prompt Engineer.  
I engineered a strict system prompt that forces Gemini to:

1. Read the raw customer success story.
2. Segment it into logical, dramatic "beats" (scenes).
3. Supercharge each simple sentence into a massive, highly descriptive prompt optimized specifically for image diffusion models.
4. Return the data as a strictly typed JSON array so the React frontend won't crash from unpredicable markdown formatting.

### 2. The Visual Cortex & Style Consistency Logic

To render the storyboard, I piped the Gemini-engineered prompts into Stable Diffusion XL via the Hugging Face Serverless Inference API. 

**The Visual Consistency Architecture:** Generating random images is easy; generating images that look like they belong in the same presentation deck is incredibly hard. To achive the "Visual Consistency" requirement, I implemented a Style Injection Engine. The frontend allows the user to select a preset style (e.g., "Cyberpunk Neon" or "Corporate Vector Art") or type their own. The backend passes this string to Gemini, and Gemini is strictly instructed to append specific lighting, camera angle, and medium keywords related to that style to the very end of *every single panel prompt*. This mathematically locks the diffusion model's latent space into a specific aesthetic, ensuring all 4 panels look unified.

### 3. Frontend UI/UX Architecture

Instead of saving `.mp3` or `.png` files to the server's hard drive (which causes massive I/O bottlenecks and requires cleanup crons), the backend encodes both the audio and the images directly into Base64 strings. This makes the API entirely stateless and lightning fast.

For the UI, I avoided the classic vertical layout which causes severe scroll fatiuge. I engineered a responsive, horizontal "Neural Timeline" using CSS Grid. Furthermore, to prevent losing expensive API generations when the user switches between the Empathy Engine and Pitch Visualizer tabs, I utilized CSS state preservation (`display: block` vs `hidden`) rather than standard React unmounting. This keeps the entire DOM in memory for a flawless user experience.