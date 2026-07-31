from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user
from app.database import SessionLocal
from app.models import LiveFeed

router = APIRouter()

@router.get("/live")
def get_live_posts(


    current_user = Depends(get_current_user),
    limit: int = 20
):

    db = SessionLocal()

    try:

        posts = db.query(LiveFeed)\
                  .order_by(LiveFeed.id.desc())\
                  .limit(limit)\
                  .all()

        return [
            {
                 "id": p.id,
                "text": p.text,
                "sentiment": p.sentiment,
                "confidence_score": p.confidence,
                "topic_name": p.topic,
                "created_at": p.created_at,
                "keywords": (
                    p.keywords.split(",")
                    if p.keywords
                    else []
                )
            }
            for p in posts
        ]

    finally:
        db.close()