from fastapi import APIRouter, Depends
from app.trend_analysis import load_data
from app.topic_modeling import get_topic_frequency_ml
from app.auth.dependencies import get_current_user

router = APIRouter()

@router.get("/topics")
async def topics(
    current_user = Depends(get_current_user)
):

    df = load_data()

    return get_topic_frequency_ml(df)