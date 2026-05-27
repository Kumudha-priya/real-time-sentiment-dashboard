import pandas as pd
import re
from datetime import datetime

# CLEAN TEXT FUNCTION
def clean_text(text):
    if pd.isna(text):
        return ""

    text = text.lower()
    text = re.sub(r"http\S+", "", text)   # remove links
    text = re.sub(r"@\w+", "", text)      # remove mentions
    text = re.sub(r"#\w+", "", text)      # remove hashtags
    text = re.sub(r"[^a-z\s]", "", text)  # remove special chars
    text = re.sub(r"\s+", " ", text).strip()

    return text


# LOAD TWITTER
twitter = pd.read_csv("datasets/twitter/twitter_data.csv")

twitter = twitter.rename(columns={"text": "text"})
twitter["platform"] = "Twitter"

twitter["date"] = pd.to_datetime(
    twitter["date"],
    errors="coerce"
)

# LOAD REDDIT
reddit = pd.read_csv("datasets/reddit/reddit_comments.csv")

reddit["platform"] = "Reddit"
reddit["date"] = pd.to_datetime(datetime.now())

# STANDARD COLUMNS
twitter = twitter[["text", "date", "sentiment", "platform"]]
reddit = reddit[["text", "date", "sentiment", "platform"]]

# CLEAN TEXT
twitter["clean_text"] = twitter["text"].apply(clean_text)
reddit["clean_text"] = reddit["text"].apply(clean_text)

# COMBINE
df = pd.concat([twitter, reddit], ignore_index=True)

# SAVE CLEANED DATASET
df.to_csv("datasets/combined_cleaned.csv", index=False)

print("CLEAN PIPELINE COMPLETED")
print(df.head())