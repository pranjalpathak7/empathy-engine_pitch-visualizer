import os
from google.cloud import texttospeech

class TTSEngine:
    def __init__(self):
        # Initializes the Google Cloud TTS client.
        self.client = texttospeech.TextToSpeechClient()
        self.voice = texttospeech.VoiceSelectionParams(
            language_code="en-US",
            name="en-US-Wavenet-D"
        )

    def _generate_ssml(self, text: str, emotion: str, intensity: float) -> str:
        """
        Maps emotions and intensity to specific SSML vocal parameters.
        Implements advanced phonetic pacing for extreme emotions.
        """
        rate_val = 95
        pitch_val = 0.0
        volume = "medium"
        
        is_high = intensity >= 0.8
        is_low = intensity < 0.5
        
        # We will dynamically wrap the text in emphasis or breaks if needed
        processed_text = text

        if emotion == "joy":
            rate_val = 110 if is_high else (95 if is_low else 105)
            pitch_val = 5.0 if is_high else (1.5 if is_low else 3.0)
            volume = "loud"
            if is_high:
                processed_text = f'<emphasis level="moderate">{text}</emphasis>'

        elif emotion == "sadness":
            rate_val = 70 if is_high else (85 if is_low else 75)
            pitch_val = -6.0 if is_high else (-2.0 if is_low else -4.0)
            volume = "soft"

        elif emotion == "anger":
            rate_val = 105 if is_high else (90 if is_low else 95)
            pitch_val = -5.0 if is_high else (-1.0 if is_low else -3.0)
            volume = "x-loud"
            
            # The "Seething" effect: If high intensity, force micro-pauses between words
            if is_high:
                words = text.split()
                # Joins words with a harsh, unnatural 150ms break to simulate gritted teeth
                seething_text = ' <break time="150ms"/> '.join(words)
                processed_text = f'<emphasis level="strong">{seething_text}</emphasis>'

        elif emotion == "surprise":
            rate_val = 115 if is_high else (100 if is_low else 110)
            pitch_val = 6.0 if is_high else (2.0 if is_low else 4.0)
            volume = "loud"

        elif emotion == "fear":
            rate_val = 110 if is_high else (95 if is_low else 105)
            pitch_val = 4.0 if is_high else (1.0 if is_low else 2.5)
            volume = "soft"

        else: # neutral
            rate_val = 95
            pitch_val = 0.0
            volume = "medium"

        rate_str = f"{rate_val}%"
        pitch_str = f"{'+' if pitch_val >= 0 else ''}{pitch_val}st"

        # Formatted specifically to look clean in the React UI code block
        ssml = f"""<speak>
    <break time="200ms"/>
    <prosody rate="{rate_str}" pitch="{pitch_str}" volume="{volume}">
        {processed_text}
    </prosody>
    <break time="200ms"/>
</speak>"""
        return ssml

    def generate_audio(self, text: str, emotion: str, intensity: float):
        """
        Generates the audio and returns both the SSML string and raw audio bytes.
        """
        ssml_text = self._generate_ssml(text, emotion, intensity)

        synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )

        response = self.client.synthesize_speech(
            input=synthesis_input, voice=self.voice, audio_config=audio_config
        )

        # We no longer save to disk; we return the raw byte payload directly
        return ssml_text, response.audio_content