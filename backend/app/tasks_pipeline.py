from app.celery_worker import celery

from app.pipeline import run_pipeline

from app.anomaly_detection import (
    detect_negative_sentiment_spike
)

import pandas as pd



@celery.task
def run_pipeline_task():

    posts = [

        {
            "text": "I love this phone"
        },

        {
            "text": "Battery is terrible"
        },

        {
            "text": "Camera is amazing"
        }

    ]


    result = run_pipeline(posts)



    try:

        df = pd.DataFrame(result)

        detect_negative_sentiment_spike(df)


    except Exception as e:

        print(
            "Anomaly detection skipped:",
            e
        )


    return result