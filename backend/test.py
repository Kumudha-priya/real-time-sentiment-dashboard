from bertopic import BERTopic
from sentence_transformers import SentenceTransformer

docs = [
    # AI / Tech cluster
    "I love AI and machine learning",
    "Python is amazing for NLP",
    "Deep learning is powerful",
    "Transformers changed NLP",
    "ChatGPT is very useful",
    "I enjoy coding in Python",
    "Machine learning is interesting",
    "Artificial intelligence is growing fast",
    "Data science is exciting",
    "Neural networks are complex",

    # Negative / complaint cluster
    "I hate slow internet",
    "This movie was terrible",
    "The service was very bad",
    "I am frustrated with this app",
    "The laptop battery drains quickly",
    "Customer support was awful",
    "This phone overheats a lot",
    "The food tasted horrible",
    "Traffic is very annoying",
    "The website crashes frequently",

    # NEW IMPORTANT FIX (ADD DIVERSITY)
    "The AI model improved accuracy significantly",
    "Python helps automate tasks easily",
    "I had a great experience with this app",
    "Customer service was very helpful today",
    "The system performance is excellent"
]

print("Loading BERTopic...")

embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

topic_model = BERTopic(
    embedding_model=embedding_model,
    min_topic_size=3
)

topics, probs = topic_model.fit_transform(docs)

print("\nTopics:")
print(topics)

print("\nTopic Info:")
print(topic_model.get_topic_info())
from app.trend_analysis import load_data

df = load_data()

print("\nDataset Columns:")
print(df.columns.tolist())