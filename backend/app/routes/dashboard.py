from fastapi import APIRouter, Query, Request, Depends

from app.core.limiter import limiter
from app.analytics_app import build_analytics
from app.trend_analysis import load_data
from app.auth.dependencies import get_current_user


router = APIRouter()



@router.get("/dashboard")
@limiter.limit("20/minute")
async def dashboard(

    request: Request,

    current_user: str = Depends(get_current_user),

    platform: str | None = Query(None),

    start_date: str | None = Query(None),

    end_date: str | None = Query(None),

    brand: str | None = Query(None)

):


    try:

        analytics = build_analytics(

            platform=platform,

            start_date=start_date,

            end_date=end_date,

            brand=brand

        )


    except Exception as e:

        print(
            "Dashboard Error:",
            e
        )

        return {
            "error":str(e)
        }



    return {


        "logged_in_user":
        current_user,



        "total_posts":

        (
            analytics.get("positive",0)
            +
            analytics.get("negative",0)
            +
            analytics.get("neutral",0)
        ),



        "positive":

        analytics.get(
            "positive",
            0
        ),



        "negative":

        analytics.get(
            "negative",
            0
        ),



        "neutral":

        analytics.get(
            "neutral",
            0
        ),



        "top_topics":

        analytics.get(
            "top_topics",
            []
        ),



        "top_keywords":

        analytics.get(
            "top_keywords",
            []
        ),



        "trend_data":

        analytics.get(
            "daily_trends",
            []
        ),



        "daily_trends":

        analytics.get(
            "daily_trends",
            []
        ),



        "weekly_trends":

        analytics.get(
            "weekly_trends",
            []
        ),



        "platform_trends":

        analytics.get(
            "platform_trends",
            []
        ),



        "brand_trends":

        analytics.get(
            "brand_trends",
            []
        ),



        "sentiment_distribution":

        analytics.get(
            "sentiment_distribution",
            []
        ),

        "alerts":

        analytics.get(
            "alerts",
            []
        ),

        "brand_alerts":

        analytics.get(
            "brand_alerts",
            []
        )

    }

@router.get("/brands")
def get_brands():


    df = load_data()


    if "brand" not in df.columns:

        return []


    return (
        df["brand"]
        .dropna()
        .unique()
        .tolist()
    )