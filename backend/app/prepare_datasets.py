import pandas as pd
from datetime import datetime
import random

from keywords import detect_brand
# ---------------- TWITTER ----------------
twitter_columns = [
"sentiment",
"id",
"date",
"query",
"user",
"text"
]
twitter_df = pd.read_csv(
"datasets/twitter/twitter_data.csv",
encoding="latin1",
names=twitter_columns
)
# KEEP REQUIRED COLUMNS
twitter_df = twitter_df[["text", "date", "sentiment"]]
# CONVERT SENTIMENT
twitter_df["sentiment"] = twitter_df["sentiment"].map({
0: "Negative",
4: "Positive"
})
# ADD PLATFORM
twitter_df["platform"] = "Twitter"
# ADD CONFIDENCE SCORE
twitter_df["confidence_score"] = [
round(random.uniform(0.70, 0.99), 2)
for _ in range(len(twitter_df))
]

# ADD TOPIC

twitter_df["topic_name"] = "General"

# ADD BRAND

twitter_df["brand"] = twitter_df["text"].apply(
    detect_brand
)
# ---------------- REDDIT ----------------

reddit_df = pd.read_csv(
"datasets/reddit/reddit_comments.csv",
encoding="latin1"
)

# KEEP TEXT ONLY

reddit_df = reddit_df[["text"]]

# ADD FAKE DATE

reddit_df["date"] = datetime.now().strftime("%Y-%m-%d")

# RANDOM SENTIMENT

reddit_df["sentiment"] = [
random.choice([
"Positive",
"Neutral",
"Negative"
])
for _ in range(len(reddit_df))
]

# ADD PLATFORM

reddit_df["platform"] = "Reddit"

# ADD CONFIDENCE SCORE

reddit_df["confidence_score"] = [
round(random.uniform(0.65, 0.98), 2)
for _ in range(len(reddit_df))
]

# ADD TOPIC

reddit_df["topic_name"] = "General"
# ADD BRAND 
reddit_df["brand"] = reddit_df["text"].apply( detect_brand )

# ---------------- COMBINE ----------------

combined_df = pd.concat(
[twitter_df, reddit_df],
ignore_index=True
)

# SAVE FINAL DATASET

combined_df.to_csv(
"datasets/combined_dataset.csv",
index=False
)

print("Combined dataset created successfully!")

print(combined_df.head())
