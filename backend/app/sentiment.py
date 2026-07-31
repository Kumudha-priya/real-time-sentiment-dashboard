import time

from transformers import pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

from app.logger import logger


# ----------------------------------
# LOAD MODELS
# ----------------------------------

analyzer = SentimentIntensityAnalyzer()


# Twitter RoBERTa model
# Loaded once when backend starts

classifier = pipeline(
    "sentiment-analysis",
    model="cardiffnlp/twitter-roberta-base-sentiment-latest"
)



# ----------------------------------
# SENTIMENT SUMMARY
# ----------------------------------

def sentiment_summary(df):

    return {

        "positive":
            len(df[df["sentiment"] == "positive"]),

        "negative":
            len(df[df["sentiment"] == "negative"]),

        "neutral":
            len(df[df["sentiment"] == "neutral"])

    }



# ----------------------------------
# VADER FALLBACK
# ----------------------------------

def get_sentiment(text):

    try:

        scores = analyzer.polarity_scores(
            str(text)
        )


        compound = scores["compound"]


        if compound >= 0.05:
            sentiment = "positive"

        elif compound <= -0.05:
            sentiment = "negative"

        else:
            sentiment = "neutral"



        return {

            "sentiment": sentiment,

            "confidence":
                round(abs(compound) * 100, 2),

            "scores": scores

        }


    except Exception as e:

        logger.error(
            f"VADER error {e}"
        )


        return {

            "sentiment":"neutral",

            "confidence":0.0,

            "scores":{}

        }



# ----------------------------------
# MAIN SENTIMENT FUNCTION
# ----------------------------------

def analyze_roberta_sentiment(text):

    start_time = time.time()

    try:

        result = classifier(
            str(text),
            truncation=True,
            max_length=512
        )[0]


        label = result["label"].lower()

        confidence = result["score"]


        if label in ["positive", "label_2"]:
            sentiment = "positive"

        elif label in ["negative", "label_0"]:
            sentiment = "negative"

        elif label in ["neutral", "label_1"]:
            sentiment = "neutral"

        else:
            sentiment = "neutral"



        return {

            "model":
                "Twitter-RoBERTa",

            "sentiment":
                sentiment,

            "confidence_score":
                round(confidence * 100, 2),

            "prediction_time":
                round(
                    time.time() - start_time,
                    4
                )

        }


    except Exception as e:

        logger.error(
            f"RoBERTa failed {e}"
        )


        vader = get_sentiment(text)


        return {

            "model":
                "VADER",

            "sentiment":
                vader["sentiment"],

            "confidence_score":
                vader["confidence"],

            "prediction_time":
                round(
                    time.time() - start_time,
                    4
                )

        }




# ----------------------------------
# TESTING
# ----------------------------------

if __name__ == "__main__":

    posts = [

        "i love this product",

        "this product is terrible",

        "the product is okay"

    ]


    for post in posts:

        print("\nPOST:", post)

        print("RAW MODEL OUTPUT:")

        print(
            classifier(post)
        )

        print("FINAL OUTPUT:")

        print(
            analyze_roberta_sentiment(post)
        )