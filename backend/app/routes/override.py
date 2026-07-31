from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.database import SessionLocal
from app.models import LiveFeed


router = APIRouter()


class OverrideRequest(BaseModel):

    sentiment: str



@router.put("/override/{id}")
def override_sentiment(
    id:int,
    request:OverrideRequest
):

    db = SessionLocal()


    post = (
        db.query(LiveFeed)
        .filter(
            LiveFeed.id == id
        )
        .first()
    )


    if not post:

        db.close()

        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )


    post.manual_sentiment = request.sentiment


    db.commit()


    db.refresh(post)


    db.close()


    return {

        "message":
        "Sentiment updated successfully",

        "id":
        id,

        "manual_sentiment":
        post.manual_sentiment
    }