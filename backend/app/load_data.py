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
    "target", "id", "date", "flag", "user", "text"
]

reddit_df = pd.read_csv(
    "datasets/reddit/reddit_comments.csv",
    encoding="latin1"
)

print("TWITTER SHAPE:", twitter_df.shape)
print("REDDIT SHAPE:", reddit_df.shape)

# ----------------------------
# STEP 2: NORMALIZE COLUMNS
# ----------------------------
if "text" in twitter_df.columns:
    twitter_df = twitter_df.rename(columns={"text": "content"})

if "body" in reddit_df.columns:
    reddit_df = reddit_df.rename(columns={"body": "content"})
elif "comment" in reddit_df.columns:
    reddit_df = reddit_df.rename(columns={"comment": "content"})
elif "text" in reddit_df.columns:
    reddit_df = reddit_df.rename(columns={"text": "content"})

# ----------------------------
# STEP 3: MERGE
# ----------------------------
# ----------------------------
# STEP 3: MERGE
# ----------------------------
df = pd.concat([twitter_df, reddit_df], ignore_index=True)

print("MERGED SHAPE:", df.shape)
print(df.columns)

if "content" not in df.columns:
    raise Exception("content column missing")

print("ROWS BEFORE DATE CLEAN:", len(df))

print("\nSAMPLE DATE VALUES:")
print(df["date"].head(10))
# ----------------------------
# STEP 4: SENTIMENT ANALYSIS
# ----------------------------
sentiments = []
confidences = []

for text in df["content"]:

    result = analyze_sentiment(str(text))

    sentiments.append(
        result["sentiment"].lower()
    )

    confidences.append(
        result["confidence"]
    )
df["sentiment"] = sentiments
df["confidence_score"] = confidences
print("Rows after sentiment:", len(df))
print(df.head())
df = df[["date", "content", "sentiment", "confidence_score"]]

# ----------------------------
# STEP 5: SAVE
# ----------------------------
print("Saving CSV...")
df.to_csv("datasets/processed_sentiment.csv", index=False)

print("\nSCRIPT COMPLETED")