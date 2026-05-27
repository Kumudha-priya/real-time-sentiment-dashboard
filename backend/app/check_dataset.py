import pandas as pd

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

# ---------------- REDDIT ----------------

reddit_df = pd.read_csv(
"datasets/reddit/reddit_comments.csv",
encoding="latin1"
)

# ---------------- PRINT COLUMNS ----------------

print("TWITTER COLUMNS:")
print(twitter_df.columns)

print("\nREDDIT COLUMNS:")
print(reddit_df.columns)

# ---------------- SAMPLE DATA ----------------

print("\nTWITTER SAMPLE:")
print(twitter_df.head())

print("\nREDDIT SAMPLE:")
print(reddit_df.head())
