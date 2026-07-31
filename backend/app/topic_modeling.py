import re
from sklearn.feature_extraction.text import TfidfVectorizer, ENGLISH_STOP_WORDS
from bertopic import BERTopic
from sentence_transformers import SentenceTransformer
from app.utils import smart_topic_name
import os

# -----------------------------
# STOPWORDS
# -----------------------------
CUSTOM_STOPWORDS = {
    "amp","im","just","got","dont","know","like","really","today",
    "day","time","good","going","want","work","night","lol","think",
    "haha","hahaha","yeah","hey","oh","ill","ive","thats","youre",
    "didnt","gonna","cant","wont","twitter","tweet","tweets",
    "facebook","youtube","link","http","thank","thanks","omg",
    "quot","funquot","feel","best","actually","doing","bad","did",
    "dude","far","sleep","birthday","happy","welcome","song","rain","movie","school","lunch","sick"
}
os.environ["HF_HUB_DISABLE_TELEMETRY"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"


# -----------------------------
# CLEAN TEXT FUNCTION
# -----------------------------
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#", "", text)
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()

    words = text.split()
    words = [
        w for w in words
        if w not in ENGLISH_STOP_WORDS
        and len(w) > 2
    ]
    return " ".join(words)

# -----------------------------
# MODELS
# -----------------------------
vectorizer = TfidfVectorizer(
    stop_words=list(ENGLISH_STOP_WORDS.union(CUSTOM_STOPWORDS)),
    max_features=5000,
    min_df=1
)

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

topic_model = BERTopic(
    embedding_model=embedding_model,
    vectorizer_model=vectorizer,
    min_topic_size=15,
    nr_topics="auto",
    verbose=False
)

TOPIC_CACHE = {}

# -----------------------------
# EXTRACT TOPICS (FIXED)
# -----------------------------
def extract_topics(posts):

    # ✅ CLEANING INSIDE FUNCTION (FIXED INDENTATION)
    cleaned_posts = [
        clean_text(post)
        for post in posts
        if isinstance(post, str)
        and len(post.strip()) > 15
        and not post.isdigit()
    ]

    if len(cleaned_posts) == 0:
        return []
    if len(cleaned_posts) < 5:
        return [{
        "topic_id": 0,
        "topic_name": "General Discussion",
        "count": len(cleaned_posts),
        "keywords": []
    }]

    topics, probs = topic_model.fit_transform(cleaned_posts)

    topic_counts = {}

    for topic in topics:
        if topic == -1:
            continue
        topic_counts[topic] = topic_counts.get(topic, 0) + 1

    topic_results = []

    for topic, count in topic_counts.items():

        if count < 5:
            continue

        words = topic_model.get_topic(topic)
        if not words:
            continue

        topic_words = [
            w[0]
            for w in words
            if len(w[0]) > 3
            and w[0].lower() not in CUSTOM_STOPWORDS
            and w[0].isalpha()
        ]

        topic_name = smart_topic_name(topic_words)

        topic_results.append({
            "topic_id": int(topic),
            "topic_name": topic_name,
            "count": count,
            "keywords": [w[0] for w in words[:5]]
        })

    return topic_results

# -----------------------------
# MAIN FUNCTION
# -----------------------------
def get_topic_frequency_ml(df, platform=None):

    global TOPIC_CACHE

    cache_key = platform or "all"

    if cache_key in TOPIC_CACHE:
        return TOPIC_CACHE[cache_key]

    if platform:
        df = df[df["platform"].astype(str).str.lower() == platform.lower()]

    texts = (
        df["clean_text"]
        .dropna()
        .astype(str)
        .head(10000)
        .tolist()
    )

    topics = extract_topics(texts)

    TOPIC_CACHE[cache_key] = sorted(
        [
            {
                "topic": t.get("topic_name", "Unknown"),
                "count": t.get("count", 0)
            }
            for t in topics
            if t.get("count", 0) > 0
        ],
        key=lambda x: x["count"],
        reverse=True
    )

    return TOPIC_CACHE[cache_key]