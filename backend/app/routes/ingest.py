from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd

from app.tasks_ingestion import ingest_dataset_task


router = APIRouter()



@router.post("/ingest")
async def ingest(
    file: UploadFile = File(...)
):

    # ==============================
    # VALIDATE FILE
    # ==============================

    if not file.filename.endswith(".csv"):

        raise HTTPException(
            status_code=400,
            detail="Only CSV files allowed"
        )



    # ==============================
    # READ CSV
    # ==============================

    try:

        try:

            df = pd.read_csv(
                file.file,
                encoding="utf-8"
            )


        except UnicodeDecodeError:

            file.file.seek(0)

            df = pd.read_csv(
                file.file,
                encoding="latin1"
            )


    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=f"Invalid CSV file: {str(e)}"
        )



    # ==============================
    # HANDLE CSV WITHOUT HEADER
    # ==============================


    if all(isinstance(col, int) for col in df.columns):


        file.file.seek(0)


        df = pd.read_csv(
            file.file,
            header=None,
            encoding="latin1"
        )



        # Sentiment140 dataset

        if len(df.columns) == 6:


            df.columns = [

                "sentiment",
                "id",
                "date",
                "query",
                "user",
                "text"

            ]



        # Reddit / single text column

        elif len(df.columns) == 1:


            df.columns = [

                "text"

            ]




    # ==============================
    # HANDLE SENTIMENT140 HEADER ISSUE
    # ==============================


    elif len(df.columns) == 6:


        if str(df.columns[0]) == "0":


            df.columns = [

                "sentiment",
                "id",
                "date",
                "query",
                "user",
                "text"

            ]




    # ==============================
    # HANDLE PROCESSED DATASETS
    # ==============================


    if "cleaned_text" in df.columns and "text" not in df.columns:


        df.rename(
            columns={
                "cleaned_text":"text"
            },
            inplace=True
        )



    elif "original_text" in df.columns and "text" not in df.columns:


        df.rename(
            columns={
                "original_text":"text"
            },
            inplace=True
        )




    # ==============================
    # FIND TEXT COLUMN AUTOMATICALLY
    # ==============================


    if "text" not in df.columns:


        possible_columns = [

            "tweet",
            "sentence",
            "content",
            "message",
            "Text",
            "comment",
            "body"

        ]


        found = None



        for col in possible_columns:


            if col in df.columns:

                found = col

                break




        if found:


            df.rename(

                columns={
                    found:"text"
                },

                inplace=True

            )


        else:


            raise HTTPException(

                status_code=400,

                detail=f"CSV must contain text column. Found columns: {list(df.columns)}"

            )




    # ==============================
    # CLEAN DATA
    # ==============================


    df = df.dropna(
        subset=["text"]
    )



    if len(df) == 0:


        raise HTTPException(

            status_code=400,

            detail="No valid text found"

        )




    # ==============================
    # SEND DATA TO CELERY IN CHUNKS
    # ==============================


    chunk_size = 10000


    task_ids = []



    try:


        for start in range(
            0,
            len(df),
            chunk_size
        ):


            chunk = df.iloc[
                start:start + chunk_size
            ]



            records = chunk.to_dict(
                orient="records"
            )



            task = ingest_dataset_task.delay(
                records
            )



            task_ids.append(
                task.id
            )



    except Exception as e:


        raise HTTPException(

            status_code=500,

            detail=f"Pipeline error: {str(e)}"

        )




    # ==============================
    # PREVIEW
    # ==============================


    sample = []



    for row in df.head(5).itertuples():


        sample.append({

            "original": str(row.text),

            "cleaned": str(row.text)

        })





    return {


        "message":
        f"{len(df)} rows uploaded successfully",


        "sample":
        sample,


        "task_ids":
        task_ids

    }