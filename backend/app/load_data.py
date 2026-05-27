from app.sentiment import analyze_sentiment
import pandas as pd

print("SCRIPT STARTED...\n")

# ----------------------------
# STEP 1: LOAD DATASETS
# ----------------------------
twitter_df = pd.read_csv(
    "datasets/twitter/twitter_data.csv",
    encoding="latin1",
    header=None
)
twitter_df.columns = [
    "target",
    "id",
    "date",
    "flag",
    "user",
    "text"
]

reddit_df = pd.read_csv(
    "datasets/reddit/reddit_comments.csv",
    encoding="latin1"
)

print("TWITTER SHAPE:", twitter_df.shape)
print("REDDIT SHAPE:", reddit_df.shape)

# ----------------------------
# STEP 2: CHECK + NORMALIZE COLUMNS SAFELY
# ----------------------------
print("\nTWITTER COLUMNS:", twitter_df.columns)
print("REDDIT COLUMNS:", reddit_df.columns)

# Twitter column fix
if "text" in twitter_df.columns:
    twitter_df = twitter_df.rename(columns={"text": "content"})
elif "tweet" in twitter_df.columns:
    twitter_df = twitter_df.rename(columns={"tweet": "content"})

# Reddit column fix
if "body" in reddit_df.columns:
    reddit_df = reddit_df.rename(columns={"body": "content"})
elif "comment" in reddit_df.columns:
    reddit_df = reddit_df.rename(columns={"comment": "content"})
elif "text" in reddit_df.columns:
    reddit_df = reddit_df.rename(columns={"text": "content"})

# ----------------------------
# STEP 3: MERGE DATASETS
# ----------------------------
df = pd.concat([twitter_df, reddit_df], ignore_index=True)

# Safety check
if "content" not in df.columns:
    print("\nERROR: 'content' column not found!")
    print(df.columns)
    raise Exception("Column mapping failed. Fix dataset column names.")

# ----------------------------
# STEP 4: APPLY SENTIMENT ANALYSIS
# ----------------------------
sentiments = []
confidences = []

for text in df["content"]:
    sentiment, confidence = analyze_sentiment(str(text))
    sentiments.append(sentiment)
    confidences.append(confidence)

df["sentiment"] = sentiments
df["confidence_score"] = confidences

# ----------------------------
# STEP 5: SAVE OUTPUT DATASET
# ----------------------------
df.to_csv("datasets/processed_sentiment.csv", index=False)

print("\nSAMPLE DATA:")
print(df.head())

# ----------------------------
# STEP 6: STATISTICS
# ----------------------------
total = len(df)

print("\n--- SENTIMENT STATS ---")
print("Positive:", len(df[df["sentiment"] == "Positive"]))
print("Negative:", len(df[df["sentiment"] == "Negative"]))
print("Neutral:", len(df[df["sentiment"] == "Neutral"]))

print("\nAvg Confidence:", df["confidence_score"].mean())

print("\nPercentages:")
print("Positive %:", len(df[df["sentiment"] == "Positive"]) / total * 100)
print("Negative %:", len(df[df["sentiment"] == "Negative"]) / total * 100)
print("Neutral %:", len(df[df["sentiment"] == "Neutral"]) / total * 100)

# ----------------------------
# STEP 7: FRONTEND ANALYTICS DATA
# ----------------------------
analytics = {
    "positive": int(len(df[df["sentiment"] == "Positive"])),
    "negative": int(len(df[df["sentiment"] == "Negative"])),
    "neutral": int(len(df[df["sentiment"] == "Neutral"])),
    "avg_confidence": float(df["confidence_score"].mean())
}

print("\n--- FRONTEND ANALYTICS ---")
print(analytics)

print("\nSCRIPT COMPLETED SUCCESSFULLY")