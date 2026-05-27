import nltk
import time

# backend/app/sentiment.py or main.py

from transformers import pipeline

sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"
)
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from app.logger import logger

# nltk.download('vader_lexicon')  # run once only

analyzer = SentimentIntensityAnalyzer()
# -------------------------------
# LOAD DISTILBERT MODEL
# -------------------------------

classifier = pipeline(
    "sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"
)


# ----------------------------
# MAIN FUNCTION (for backend / API / dashboard)
# ----------------------------
def get_sentiment(text):
    try:
        logger.info(f"Processing text: {text}")

        scores = analyzer.polarity_scores(text)
        compound = scores['compound']

        if compound >= 0.05:
            sentiment = "positive"
        elif compound <= -0.05:
            sentiment = "negative"
        else:
            sentiment = "neutral"

        result = {
            "sentiment": sentiment,
            "confidence": abs(compound),
            "scores": scores
        }

        logger.info(f"Sentiment result: {result}")

        return result

    except Exception as e:

        logger.error(f"Error in get_sentiment: {e}")
        
        return {
            "sentiment": "neutral",
            "confidence": 0.0,
            "scores": {}
        }


# ----------------------------
# DAY 2 REQUIRED FUNCTION (simple output)
# ----------------------------
def analyze_sentiment(text):
    try:
        scores = analyzer.polarity_scores(text)

        compound = scores['compound']

        if compound >= 0.05:
            sentiment = "Positive"
        elif compound <= -0.05:
            sentiment = "Negative"
        else:
            sentiment = "Neutral"

        confidence = abs(compound)

        return sentiment, confidence
    except Exception as e:

        logger.error(f"Error in analyze_sentiment: {e}")

        return "Neutral", 0.0
    # -------------------------------
# DISTILBERT SENTIMENT FUNCTION
# -------------------------------

def analyze_bert_sentiment(text):

    start_time = time.time()

    try:

        logger.info(f"Running DistilBERT on: {text}")

        # -------------------------------
        # DISTILBERT PREDICTION
        # -------------------------------

        result = classifier(text)

        label = result[0]["label"]
        score = result[0]["score"]

        # -------------------------------
        # LABEL CONVERSION
        # -------------------------------

        if label == "POSITIVE":
            sentiment = "Positive"
        else:
            sentiment = "Negative"

        end_time = time.time()

        prediction_time = round(end_time - start_time, 4)

        final_result = {
            "model": "DistilBERT",
            "sentiment": sentiment,
            "confidence_score": round(score, 4),
            "prediction_time": prediction_time
        }

        logger.info(f"DistilBERT Result: {final_result}")

        return final_result

    except Exception as e:

        logger.error(f"DistilBERT failed: {e}")

        # -------------------------------
        # FALLBACK TO VADER
        # -------------------------------

        vader_score = analyzer.polarity_scores(text)

        compound = vader_score["compound"]

        if compound >= 0.05:
            sentiment = "Positive"

        elif compound <= -0.05:
            sentiment = "Negative"

        else:
            sentiment = "Neutral"

        end_time = time.time()

        prediction_time = round(end_time - start_time, 4)

        fallback_result = {
            "model": "VADER Fallback",
            "sentiment": sentiment,
            "confidence_score": round(abs(compound), 4),
            "prediction_time": prediction_time
        }

        logger.info(f"Fallback Result: {fallback_result}")

        return fallback_result

# ----------------------------
# TESTING BLOCK
# ----------------------------
if __name__ == "__main__":

    sample_posts = [

        "This dashboard is amazing!",

        "The UI is terrible and slow.",

        "The app is okay for now.",

        "I absolutely love the charts.",

        "This is the worst update ever."

    ]

    for post in sample_posts:

        print("\n============================")
        print("POST:", post)

        print("\nVADER RESULT:")
        print(get_sentiment(post))

        print("\nDISTILBERT RESULT:")
        print(analyze_bert_sentiment(post))