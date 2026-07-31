from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.database import SessionLocal
from app.models import Post,Topic
from app.sentiment import analyze_roberta_sentiment
from app.utils import assign_topic


router = APIRouter()


@router.get("/dataset")
def get_dataset(
    current_user = Depends(get_current_user)
):

    db = SessionLocal()

    try:

        posts = (
            db.query(Post)
            .order_by(Post.processed_at.desc())
            .limit(500)
            .all()
        )


        results = []


        for post in posts:


            sentiment_result = analyze_roberta_sentiment(
                post.text
            )


            sentiment = sentiment_result.get(
               "sentiment",
               "Unknown"
            ).lower()


            confidence = sentiment_result.get(
                "confidence_score",
                0
            )


            topic_name = assign_topic(post.text)



            results.append({

                "id": post.id,

                "text": post.text,

                "sentiment": sentiment,

                "manual_sentiment":
                    post.manual_sentiment,


                "confidence_score":
                    round(
                        confidence,
                        4
                    ),


                "topic_name":
                    topic_name

            })


        return results


    finally:

        db.close()