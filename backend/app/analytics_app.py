from fastapi import APIRouter, Query
import numpy as np
import pandas as pd

from app.topic_modeling import get_topic_frequency_ml
from app.trend_analysis import get_keyword_frequency_ml

from app.trend_analysis import (
    load_data,
    get_daily_trends,
    get_weekly_trends,
    get_platform_trends,
    get_sentiment_distribution,
    get_brand_trends,
    add_moving_average,
)

from app.anomaly_detection import (
    detect_anomalies,
    detect_brand_alerts
)


router = APIRouter()



def build_analytics(
    platform=None,
    start_date=None,
    end_date=None,
    brand=None
):


    selected_platform = platform


    df = load_data()



    # ==========================
    # EMPTY DATA CHECK
    # ==========================

    if df.empty:

        return {

            "daily_trends":[],
            "weekly_trends":[],
            "platform_trends":[],
            "brand_trends":[],
            "sentiment_distribution":[],
            "alerts":[],
            "brand_alerts":[],
            "topic_frequency":[],
            "keyword_frequency":[],
            "top_topics":[],
            "top_keywords":[],
            "positive":0,
            "negative":0,
            "neutral":0

        }




    print("\nDATA COLUMNS")
    print(df.columns.tolist())



    # ==========================
    # FILTER PLATFORM
    # ==========================

    if platform:

        df = df[
            df["platform"]
            .astype(str)
            .str.lower()
            ==
            platform.lower()
        ]



    # ==========================
    # FILTER DATE
    # ==========================

    if start_date:

        df = df[
            pd.to_datetime(
                df["date"],
                errors="coerce"
            )
            >=
            pd.to_datetime(start_date)
        ]



    if end_date:

        df = df[
            pd.to_datetime(
                df["date"],
                errors="coerce"
            )
            <=
            pd.to_datetime(end_date)
        ]



    # ==========================
    # FILTER BRAND
    # ==========================

    if brand:

        df = df[
            df["brand"]
            .astype(str)
            .str.lower()
            .str.contains(
                brand.lower(),
                na=False
            )
        ]



    if df.empty:

        return {

            "daily_trends":[],
            "weekly_trends":[],
            "platform_trends":[],
            "brand_trends":[],
            "sentiment_distribution":[],
            "alerts":[],
            "brand_alerts":[],
            "topic_frequency":[],
            "keyword_frequency":[],
            "top_topics":[],
            "top_keywords":[],
            "positive":0,
            "negative":0,
            "neutral":0

        }



    # ==========================
    # DATE CLEAN
    # ==========================

    df["date"] = pd.to_datetime(
        df["date"],
        errors="coerce"
    )


    df = df.dropna(
        subset=["date"]
    )



    # ==========================
    # MOVING AVG
    # ==========================

    df = add_moving_average(df)




    # ==========================
    # ANALYTICS
    # ==========================

    daily = get_daily_trends(df)

    weekly = get_weekly_trends(df)

    platform_trends = get_platform_trends(df)

    sentiment_distribution = get_sentiment_distribution(df)

    brand_trends = get_brand_trends(df)




    # ==========================
    # TOPICS KEYWORDS
    # ==========================

    topics = get_topic_frequency_ml(
        df,
        selected_platform
    )


    keywords = get_keyword_frequency_ml(df)



    print("\nTOPICS")
    print(topics[:10])


    print("\nKEYWORDS")
    print(keywords[:10])





    # ==========================
    # ALERTS
    # ==========================

    alerts = detect_anomalies(df)

    brand_alerts = detect_brand_alerts(df)





    # ==========================
    # CLEAN NAN VALUES
    # ==========================

    for item in [
        daily,
        weekly,
        platform_trends,
        brand_trends
    ]:

        item.replace(
            [np.inf,-np.inf],
            0,
            inplace=True
        )

        item.fillna(
            0,
            inplace=True
        )




    # ==========================
    # SENTIMENT COUNTS
    # ==========================

    sentiment_series = (
        df["sentiment"]
        .astype(str)
        .str.lower()
    )



    positive = int(
        (sentiment_series=="positive")
        .sum()
    )


    negative = int(
        (sentiment_series=="negative")
        .sum()
    )


    neutral = int(
        (sentiment_series=="neutral")
        .sum()
    )





    # ==========================
    # RESPONSE
    # ==========================


    return {


        "daily_trends":
        daily.to_dict(
            orient="records"
        ),



        "weekly_trends":
        weekly.to_dict(
            orient="records"
        ),



        "platform_trends":
        platform_trends.to_dict(
            orient="records"
        ),



        "brand_trends":
        brand_trends.to_dict(
            orient="records"
        ),



        "sentiment_distribution":
        sentiment_distribution.to_dict(
            orient="records"
        ),



        "alerts":
        (
            alerts.to_dict(
                orient="records"
            )
            if not alerts.empty
            else []
        ),



        "brand_alerts":
        (
            brand_alerts.to_dict(
                orient="records"
            )
            if not brand_alerts.empty
            else []
        ),



        "topic_frequency":
        topics,



        "keyword_frequency":
        keywords,



        "top_topics":
        topics[:10],



        "top_keywords":
        keywords[:40],



        "positive":
        positive,



        "negative":
        negative,



        "neutral":
        neutral

    }






@router.get("/analytics")
def analytics(

    platform: str | None = Query(None),

    start_date: str | None = Query(None),

    end_date: str | None = Query(None),

    brand: str | None = Query(None)

):


    return build_analytics(

        platform=platform,

        start_date=start_date,

        end_date=end_date,

        brand=brand

    )