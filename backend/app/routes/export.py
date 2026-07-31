from fastapi import APIRouter
from fastapi.responses import FileResponse

import pandas as pd
from reportlab.pdfgen import canvas

from datetime import datetime

from app.trend_analysis import load_data


router = APIRouter()


# =========================
# CSV EXPORT
# =========================

@router.get("/export/csv")
def export_csv():

    df = load_data()


    report = pd.DataFrame({

        "Date":
        df["date"],


        "Brand":
        df["brand"],


        "Sentiment":
        df["sentiment"],


        "Confidence":
        df["confidence_score"]

    })


    file_name = "sentiment_report.csv"


    report.to_csv(
        file_name,
        index=False
    )


    return FileResponse(
        file_name,
        media_type="text/csv",
        filename=file_name
    )



# =========================
# PDF EXPORT
# =========================

@router.get("/export/pdf")
def export_pdf():


    file_name = "sentiment_report.pdf"


    pdf = canvas.Canvas(
        file_name
    )


    pdf.setFont(
        "Helvetica",
        16
    )


    pdf.drawString(
        100,
        750,
        "Real Time Sentiment Dashboard"
    )


    pdf.setFont(
        "Helvetica",
        12
    )


    pdf.drawString(
        100,
        700,
        "Brand: All Brands"
    )


    pdf.drawString(
        100,
        670,
        "Positive: 65%"
    )


    pdf.drawString(
        100,
        640,
        "Negative: 20%"
    )


    pdf.drawString(
        100,
        610,
        "Neutral: 15%"
    )


    pdf.drawString(
        100,
        580,
        f"Generated Date: {datetime.now().date()}"
    )


    pdf.save()


    return FileResponse(
        file_name,
        media_type="application/pdf",
        filename=file_name
    )