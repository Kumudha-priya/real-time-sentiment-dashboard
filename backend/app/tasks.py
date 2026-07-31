from app.celery_worker import celery

from app.preprocess import clean_text
from app.sentiment import analyze_roberta_sentiment
from app.keywords import extract_keywords
from app.utils import assign_topic

from app.database import SessionLocal
from app.models import LiveFeed


@celery.task
def analyze_text_task(text: str):

    db = SessionLocal()

    try:

        # NLP pipeline
        cleaned = clean_text(text)

        sentiment_result = analyze_roberta_sentiment(cleaned)

        keywords = extract_keywords(cleaned)

        topic_name = assign_topic(cleaned)


        # Convert keyword dictionaries to list
        keyword_list = [
            k["keyword"]
            for k in keywords
        ]


        # Save into PostgreSQL
        live = LiveFeed(
    text=text,
    sentiment=sentiment_result["sentiment"].lower(),
    confidence=sentiment_result["confidence_score"],
    topic=topic_name,
    keywords=",".join(keyword_list)
)


        db.add(live)

        print("INSERTING INTO DATABASE:")
        print(live.text)
        print(live.sentiment)
        print(live.confidence)

        db.commit()

        print("DATABASE COMMIT SUCCESS")

        db.refresh(live)

        return {

            "original_text": text,

            "cleaned_text": cleaned,

            "sentiment": sentiment_result["sentiment"],

            "confidence_score": sentiment_result["confidence_score"],

            "topic": topic_name,

            "keywords": keywords

        }


    except Exception as e:

        db.rollback()

        raise e


    finally:

        db.close()