from fastapi import APIRouter
from app.analytics_app import build_analytics

router = APIRouter()

@router.get("/sentiments")
async def sentiments():

    analytics = build_analytics()

    return analytics["sentiment_distribution"]