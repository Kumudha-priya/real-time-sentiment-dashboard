from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.analytics_app import router as analytics_router
from app.pipeline import run_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analytics_router)

@app.get("/")
def home():
    return {"message": "Backend Running"}

@app.post("/run-pipeline")
def execute_pipeline():

    posts = [
        {"text": "I love this phone"},
        {"text": "Battery is terrible"},
        {"text": "Camera quality is amazing"}
    ]

    results = run_pipeline(posts)

    return results
from app.trend_analysis import (
    load_data,
    get_daily_trends,
    get_sentiment_distribution,
    add_moving_average
)
