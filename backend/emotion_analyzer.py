from transformers import pipeline

class EmotionAnalyzer:
    def __init__(self):
        # Initialize the pipeline. Downloading the model happens automatically on first run.
        # return_all_scores=True allows us to see the confidence level of all emotions.
        self.classifier = pipeline(
            "text-classification",
            model="j-hartmann/emotion-english-distilroberta-base",
            top_k=None 
        )

    def analyze(self, text: str) -> dict:
        """
        Analyzes text and returns the primary emotion, its intensity, and top 3 distributions.
        """
        results = self.classifier(text)[0]
        
        # Sort results by score to find the highest probability emotions
        sorted_results = sorted(results, key=lambda x: x['score'], reverse=True)
        primary_emotion = sorted_results[0]
        
        return {
            "emotion": primary_emotion['label'],
            "intensity": primary_emotion['score'], 
            "top_three": sorted_results[:3], # Used to build the UI confidence meters
            "all_scores": sorted_results # Kept for potential future debugging logging
        }