import numpy as np
import pandas as pd
from scipy.stats import zscore
def detect_anomalies(df):

    # GROUP BY DAY INSTEAD OF FULL TIMESTAMP
    df["date"] = pd.to_datetime(df["date"]).dt.date

    volume_df = df.groupby("date").size().reset_index(name="post_volume")

    volume_df["post_volume"] = pd.to_numeric(
        volume_df["post_volume"],
        errors="coerce"
    )

    mean = volume_df["post_volume"].mean()
    std = volume_df["post_volume"].std()

    if std == 0:
        volume_df["z_score"] = 0
    else:
        volume_df["z_score"] = (
            volume_df["post_volume"] - mean
        ) 

    spikes = volume_df[volume_df["z_score"] > 2]

    return spikes
def detect_brand_alerts(df):

    if "brand" not in df.columns:
        return pd.DataFrame(columns=["date", "brand", "count", "z_score", "alert"])

    brand_volume = (
        df.groupby(["date", "brand"])
        .size()
        .reset_index(name="count")
    )

    # ✅ CLEAN HERE (IMPORTANT FIX)
    brand_volume = brand_volume.dropna(subset=["brand"])
    brand_volume = brand_volume[brand_volume["brand"] != "Unknown"]

    # REMOVE SMALL COUNTS
    brand_volume = brand_volume[brand_volume["count"] > 20]

    def safe_zscore(x):
        if len(x) < 2:
            return np.zeros(len(x))
        return zscore(x)

    brand_volume["z_score"] = (
        brand_volume.groupby("brand")["count"]
        .transform(safe_zscore)
    )

    brand_volume["alert"] = brand_volume["z_score"].apply(
        lambda x: "🔥 VIRAL SPIKE"
        if x > 2
        else ("⚠ TRENDING" if x > 1 else "NORMAL")
    )

    return brand_volume