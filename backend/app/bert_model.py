from transformers import pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "all-MiniLM-L6-v2",
    local_files_only=True
)
# -----------------------------------
# LOAD DISTILBERT MODEL (CACHED)
# -----------------------------------

classifier = pipeline(
    "sentiment-analysis",
    model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"
)

# -----------------------------------
# LOAD VADER ANALYZER
# -----------------------------------

vader = SentimentIntensityAnalyzer()

# -----------------------------------
# SAMPLE POSTS
# -----------------------------------

posts = [

    "This dashboard is amazing!",

    "The UI is terrible and slow.",

    "The app is okay for now.",

    "I absolutely love the charts.",

    "This is the worst update ever."

]

# -----------------------------------
# SENTIMENT COMPARISON FUNCTION
# -----------------------------------

def compare_models(text):

    print("\nPOST:", text)

    # VADER RESULT
    vader_score = vader.polarity_scores(text)

    print("VADER:", vader_score)

    # DISTILBERT RESULT
    bert_result = classifier(text)

    print("DistilBERT:", bert_result)

# -----------------------------------
# RUN TESTS
# -----------------------------------

for post in posts:

    compare_models(post)