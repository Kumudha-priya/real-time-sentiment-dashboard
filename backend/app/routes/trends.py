from fastapi import APIRouter, Depends

from app.analytics_app import build_analytics
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/analytics",
    tags=["Trends"]
)


@router.get("/trends")
async def trends(
    current_user = Depends(get_current_user)
):

    analytics = build_analytics()

    return analytics["daily_trends"]