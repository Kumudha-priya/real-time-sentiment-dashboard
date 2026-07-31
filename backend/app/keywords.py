from sklearn.feature_extraction.text import TfidfVectorizer
import nltk
from nltk.corpus import stopwords

nltk.download("stopwords")

stop_words = set(stopwords.words("english"))

def extract_keywords(posts, top_n=10):

    if isinstance(posts, str):
        posts = [posts]

    vectorizer = TfidfVectorizer(
        stop_words="english",
        max_features=100
    )

    tfidf_matrix = vectorizer.fit_transform(posts)

    feature_names = vectorizer.get_feature_names_out()

    scores = tfidf_matrix.sum(axis=0).A1

    word_scores = list(zip(feature_names, scores))

    sorted_keywords = sorted(
        word_scores,
        key=lambda x: x[1],
        reverse=True
    )

    results = []

    for word, score in sorted_keywords[:top_n]:

        results.append({
            "keyword": word,
            "score": round(float(score), 2)
        })

    return results