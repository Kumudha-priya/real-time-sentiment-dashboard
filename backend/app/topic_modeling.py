import re

from sklearn.feature_extraction.text import TfidfVectorizer
from bertopic import BERTopic
from sentence_transformers import SentenceTransformer


# -----------------------------------
# CLEAN TEXT
# -----------------------------------

def clean_text(text):

    text = text.lower()

    text = re.sub(r"[^a-zA-Z\s]", "", text)

    text = text.strip()

    return text


# -----------------------------------
# LOAD MODELS ONCE
# -----------------------------------

vectorizer = TfidfVectorizer(
    stop_words="english",
    max_features=100
)

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

topic_model = BERTopic(
    embedding_model=embedding_model,
    vectorizer_model=vectorizer,
    min_topic_size=2,
    verbose=False
)


# -----------------------------------
# EXTRACT TOPICS
# -----------------------------------

def extract_topics(posts):

    cleaned_posts = [clean_text(post) for post in posts]

    topics, probs = topic_model.fit_transform(cleaned_posts)

    topic_results = []

    unique_topics = set(topics)

    for topic in unique_topics:

        if topic != -1:

            words = topic_model.get_topic(topic)

            topic_name = " / ".join(
                [w[0].capitalize() for w in words[:3]]
            )

            topic_results.append({

                "topic_id": int(topic),

                "topic_name": topic_name,

                "keywords": [w[0] for w in words[:5]]

            })

    return topic_results