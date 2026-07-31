from app.celery_worker import celery
from app.insert_data import insert_data
import pandas as pd

@celery.task
def ingest_dataset_task(records):

    print("Received records:", len(records))

    # Convert records → DataFrame
    df = pd.DataFrame(records)

    # optional cleanup (VERY IMPORTANT)
    df["text"] = df["text"].fillna("")

    # insert into DB
    insert_data(df)

    return {
        "status": "ingestion completed",
        "rows": len(df)
    }