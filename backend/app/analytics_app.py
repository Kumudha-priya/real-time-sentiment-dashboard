from fastapi import APIRouter
import numpy as np
import pandas as pd

from app.trend_analysis import (
    load_data,
    get_daily_trends,
    get_weekly_trends,
    get_platform_trends,
    get_sentiment_distribution,
    get_brand_trends,
    add_moving_average,
    get_topic_frequency,
    get_keyword_frequency
)

from app.anomaly_detection import (
    detect_anomalies,
    detect_brand_alerts
)

router = APIRouter()


def build_analytics():

    df = load_data()

    # ----------------------------
    # SAFE DATE CLEANING
    # ----------------------------
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.dropna(subset=["date"])

    # ----------------------------
    # MOVING AVERAGE
    # ----------------------------
    df = add_moving_average(df)

    # ----------------------------
    # TRENDS
    # ----------------------------
    daily = get_daily_trends(df)
    weekly = get_weekly_trends(df)
    platform = get_platform_trends(df)
    sentiment_distribution = get_sentiment_distribution(df)
    brand_trends = get_brand_trends(df)

    # ----------------------------
    # ALERTS (SAFE)
    # ----------------------------
    alerts = detect_anomalies(df)
    brand_alerts = detect_brand_alerts(df)
   
    daily = daily.replace([np.inf, -np.inf], 0).fillna(0)
    weekly = weekly.replace([np.inf, -np.inf], 0).fillna(0)
    platform = platform.replace([np.inf, -np.inf], 0).fillna(0)
    brand_trends = brand_trends.replace([np.inf, -np.inf], 0).fillna(0)
    alerts = alerts.replace([np.inf, -np.inf], 0).fillna(0)
    brand_alerts = brand_alerts.replace([np.inf, -np.inf], 0).fillna(0)
    
    # ----------------------------
    # FINAL RESPONSE
    # ----------------------------
    return {
    "daily_trends": daily.to_dict(orient="records"),
    "weekly_trends": weekly.to_dict(orient="records"),
    "platform_trends": platform.to_dict(orient="records"),

    "sentiment_distribution": {
        "Positive": int(sentiment_distribution["Positive"].sum()),
        "Negative": int(sentiment_distribution["Negative"].sum()),
        "Neutral": int(sentiment_distribution["Neutral"].sum()),
    },

    "brand_trends": brand_trends.to_dict(orient="records"),

    "alerts": alerts.to_dict(orient="records") if not alerts.empty else [],
    "brand_alerts": brand_alerts.to_dict(orient="records") if not brand_alerts.empty else [],

    "topic_frequency": get_topic_frequency(df),
    "keyword_frequency": get_keyword_frequency(df),
}


@router.get("/analytics")
def analytics():
    return build_analytics()