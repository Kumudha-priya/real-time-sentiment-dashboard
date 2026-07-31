import os
import pandas as pd
import numpy as np
import re

# NEW IMPORTS (IMPORTANT)
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
import json
from collections import Counter
from scipy.stats import zscore
from app.topic_modeling import extract_topics
    
CUSTOM_STOPWORDS = {
    "amp",
    "im",
    "just",
    "got",
    "dont",
    "know",
    "like",
    "really",
    "today",
    "day",
    "time",
    "good",
    "going",
    "want",
    "work",
    "night",
    "lol",
    "think"
}

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# =========================
# LOAD DATA
# =========================
def load_data():

    print("LOADING DATA...")

    twitter_path = os.path.join(BASE_DIR, "cleaned_data", "twitter_cleaned.csv")
    reddit_path = os.path.join(BASE_DIR, "cleaned_data", "reddit_cleaned.csv")

    twitter_df = pd.read_csv(
        twitter_path,
        header=None,
        names=[
            "sentiment",
            "id",
            "date",
            "query",
            "user",
            "text",
            "clean_text"
        ],
        low_memory=False
    )

    twitter_df["platform"] = "Twitter"

    twitter_df["sentiment"] = twitter_df["sentiment"].astype(str).replace({
        "0": "Negative",
        "2": "Neutral",
        "4": "Positive",
        0: "Negative",
        2: "Neutral",
        4: "Positive"
    })

    twitter_df["date"] = pd.to_datetime(
        twitter_df["date"],
        format="%a %b %d %H:%M:%S PDT %Y",
        errors="coerce"
    )

    reddit_df = pd.read_csv(
        reddit_path,
        header=None,
        names=["text", "clean_text"]
    )

    reddit_df["platform"] = "Reddit"

    reddit_df["date"] = pd.date_range(
        start="2025-01-01",
        periods=len(reddit_df),
        freq="min"
    )

    np.random.seed(42)

    reddit_df["sentiment"] = np.random.choice(
        ["Positive", "Neutral", "Negative"],
        size=len(reddit_df)
    )

    df = pd.concat([twitter_df, reddit_df], ignore_index=True)

    df = df.sample(n=20000, random_state=42)
    df = df.dropna(subset=["date"])

    df = df[df["sentiment"].isin(["Positive", "Neutral", "Negative"])]

    brands = [
        "Apple",
        "Samsung",
        "Tesla",
        "Nike",
        "Google",
        "Microsoft",
        "Amazon",
    ]

    df["brand"] = df["clean_text"].apply(
        lambda x: next(
            (
                brand
                for brand in brands
                if isinstance(x, str) and brand.lower() in x.lower()
            ),
            "Unknown"
        )
    )

    print("TOTAL ROWS:", len(df))
    print(df["platform"].value_counts())
    print(df["sentiment"].value_counts())

    return df


# =========================
# TREND FUNCTIONS
# =========================
def get_daily_trends(df):

    df = df.copy()
    df["date"] = df["date"].dt.date

    grouped = df.groupby("date").size().reset_index(name="count")
    grouped = grouped.sort_values("date")

    grouped["moving_avg_sentiment"] = grouped["count"].rolling(
        window=7,
        min_periods=1
    ).mean()

    return grouped


def get_weekly_trends(df):

    return (
        df.groupby([
            pd.Grouper(key="date", freq="W"),
            "platform",
            "sentiment"
        ])
        .size()
        .reset_index(name="count")
    )


def get_platform_trends(df):

    return (
        df.groupby("platform")
        .size()
        .reset_index(name="count")
    )


def get_sentiment_distribution(df):

    grouped = df.groupby(["platform", "sentiment"]).size().reset_index(name="count")

    pivoted = grouped.pivot(
        index="platform",
        columns="sentiment",
        values="count"
    ).fillna(0)

    pivoted = pivoted.reset_index()

    for col in ["Positive", "Neutral", "Negative"]:
        if col not in pivoted.columns:
            pivoted[col] = 0

    return pivoted


# 🔥 IMPORTANT FIX (NO UNKNOWN IN BRAND CHART)
def get_brand_trends(df):

    if "brand" not in df.columns:
        return pd.DataFrame(columns=["brand", "count"])

    df = df[df["brand"].notna()]
    df = df[df["brand"] != "Unknown"]

    return (
        df.groupby("brand")
        .size()
        .reset_index(name="count")
    )


# =========================
# MOVING AVERAGE
# =========================
def add_moving_average(df):

    sentiment_map = {
        "Positive": 1,
        "Neutral": 0,
        "Negative": -1
    }

    df["sentiment_score"] = df["sentiment"].map(sentiment_map).fillna(0)

    df = df.sort_values("date")

    df["moving_avg_sentiment"] = (
        df.groupby("platform")["sentiment_score"]
        .transform(lambda x: x.rolling(window=7, min_periods=1).mean())
    )

    return df


# =========================
# STATIC ANALYTICS
# =========================
def get_topic_frequency(df, platform=None):

    if platform:
        df = df[df["platform"] == platform]

    texts = df["clean_text"].dropna().astype(str).head(10000)
    topics = extract_topics(texts)

    return [
        {
            "topic": t["topic_name"],
            "count": len(t["keywords"])
        }
        for t in topics
    ]


def get_keyword_frequency(df):

    return [
        {"keyword": "happy", "count": 1800},
        {"keyword": "sad", "count": 950},
        {"keyword": "love", "count": 1500},
        {"keyword": "bad", "count": 700},
        {"keyword": "excellent", "count": 1100},
    ]


# =========================
# ML KEYWORDS (DAY 9 ADDITION)
# =========================

def get_keyword_frequency_ml(df):

    texts = df["clean_text"].dropna().astype(str)

    texts = texts.apply(lambda x: re.sub(r"[^a-zA-Z\s]", "", str(x).lower()))
    
    vectorizer = CountVectorizer(
    stop_words=list(ENGLISH_STOP_WORDS.union(CUSTOM_STOPWORDS)),
    max_features=50,
    ngram_range=(1, 2)
)

    X = vectorizer.fit_transform(texts)

    keywords = vectorizer.get_feature_names_out()
    counts = X.toarray().sum(axis=0)

    return [
        {"keyword": k, "count": int(c)}
        for k, c in zip(keywords, counts)
    ]


def get_tfidf_keywords(df):

    texts = df["clean_text"].dropna().astype(str)

    tfidf = TfidfVectorizer(
        stop_words="english",
        max_features=20
    )

    X = tfidf.fit_transform(texts)

    keywords = tfidf.get_feature_names_out()
    scores = X.toarray().mean(axis=0)

    return [
        {"keyword": k, "score": float(s)}
        for k, s in zip(keywords, scores)
    ]


def get_brand_keywords(df):

    result = []

    for brand in df["brand"].dropna().unique():

        if brand == "Unknown":
            continue

        brand_df = df[df["brand"] == brand]
        texts = brand_df["clean_text"].dropna().astype(str)

        if len(texts) == 0:
            continue

        vectorizer = CountVectorizer(
            stop_words="english",
            max_features=10
        )

        X = vectorizer.fit_transform(texts)

        keywords = vectorizer.get_feature_names_out()
        counts = X.toarray().sum(axis=0)

        result.append({
            "brand": brand,
            "keywords": [
                {"word": k, "count": int(c)}
                for k, c in zip(keywords, counts)
            ]
        })

    return result
# -----------------------------------
# SIMPLE TREND DETECTION (PIPELINE SUPPORT)
# -----------------------------------

def detect_trends(results):

    sentiments = []

    for item in results:
        sentiments.append(item["sentiment"])

    trend_counts = Counter(sentiments)

    return {
        "Positive": trend_counts.get("Positive", 0),
        "Negative": trend_counts.get("Negative", 0),
        "Neutral": trend_counts.get("Neutral", 0)
    }

# =========================
# EXPORT FUNCTIONS
# =========================
def export_keywords_json(data):

    with open("keyword_analysis.json", "w") as f:
        json.dump(data, f, indent=4)


def export_keywords_csv(df):

    df.to_csv("keyword_analysis.csv", index=False)

def detect_anomalies(df):
    df = df.copy()

    # ensure numeric column exists
    if "moving_avg_sentiment" not in df.columns:
        return df

    df["z_score"] = zscore(df["moving_avg_sentiment"])

    df["is_spike"] = df["z_score"].abs() > 2

    df["alert"] = df["is_spike"].apply(
        lambda x: "Spike Detected" if x else "Normal"
    )

    return df