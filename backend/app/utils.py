from app.logger import logger
import re

# ---------------------------
# 1. Remove URLs
# ---------------------------
def remove_urls(text):
    return re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)


# ---------------------------
# 2. Remove emojis
# ---------------------------
def remove_emojis(text):
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # emoticons
        "\U0001F300-\U0001F5FF"  # symbols & pictographs
        "\U0001F680-\U0001F6FF"  # transport & map symbols
        "\U0001F1E0-\U0001F1FF"  # flags
        "]+",
        flags=re.UNICODE
    )
    return emoji_pattern.sub(r'', text)


# ---------------------------
# 3. Remove hashtags (keep word)
# Example: #happy → happy
# ---------------------------
def clean_hashtags(text):
    return re.sub(r'#', '', text)


# ---------------------------
# 4. Remove mentions (@user)
# ---------------------------
def remove_mentions(text):
    return re.sub(r'@\w+', '', text)


# ---------------------------
# 5. Convert to lowercase
# ---------------------------
def to_lowercase(text):
    return text.lower()


# ---------------------------
# 6. Remove extra spaces
# ---------------------------
def remove_extra_spaces(text):
    return re.sub(r'\s+', ' ', text).strip()


# ---------------------------
# 7. MASTER CLEANING FUNCTION
# This is what you'll use in your pipeline
# ---------------------------
def clean_text(text):
    try:
        logger.info(f"Cleaning text: {text}")

        text = remove_urls(text)
        text = remove_emojis(text)
        text = clean_hashtags(text)
        text = remove_mentions(text)
        text = to_lowercase(text)
        text = remove_extra_spaces(text)

        logger.info(f"Cleaned text: {text}")

        return text

    except Exception as e:
        logger.error(f"Error in text cleaning: {str(e)}")
        return text
    # ---------------------------
# 8. SIMPLE TOPIC ASSIGNMENT
# ---------------------------
def assign_topic(text):

    text = clean_text(text)

    topics = {

        "Sports": [
            "cricket",
            "football",
            "soccer",
            "basketball",
            "tennis",
            "match",
            "player",
            "tournament",
            "ipl",
            "score",
            "sport",
            "team"
        ],


        "Technology": [
    "technology",
    "tech",
    "software",
    "hardware",
    "computer",
    "python",
    "coding",
    "programming",
    "artificial intelligence",
    "ai",
    "application",
    "android",
    "iphone",
    "phone",
    "mobile",
    "laptop",
    "device",
    "camera",
    "battery"
],


       "Entertainment": [
    "movie",
    "film",
    "actor",
    "cinema",
    "netflix",
    "series",
    "show",
    "music",
    "song",
    "album",
    "kpop",
    "game",
    "gaming",
    "anime"
],


        "Food": [
            "food",
            "dinner",
            "lunch",
            "breakfast",
            "restaurant",
            "recipe",
            "eat",
            "cooking"
        ],


        "Health": [
            "doctor",
            "hospital",
            "medicine",
            "health",
            "fever",
            "pain",
            "fitness"
        ],


        "Education": [
            "school",
            "college",
            "university",
            "exam",
            "student",
            "study",
            "course",
            "education"
        ],


        "Travel": [
            "travel",
            "trip",
            "flight",
            "hotel",
            "vacation",
            "tour"
        ],


        "Business": [
            "business",
            "company",
            "stock",
            "market",
            "finance",
            "investment",
            "money"
        ],


        "Religion": [
            "church",
            "faith",
            "god",
            "religion",
            "prayer",
            "spiritual"
        ],

        "Social Media": [
    "twitter",
    "tweet",
    "reddit",
    "post",
    "comment",
    "followers",
    "instagram",
    "facebook"
],


        "Politics": [
            "government",
            "election",
            "president",
            "minister",
            "politics"
        ]

    }


    words = text.split()


    topic_scores = {}


    for topic, keywords in topics.items():

        score = 0

        for keyword in keywords:

            if keyword in text:
                score += 1


        topic_scores[topic] = score



    best_topic = max(
        topic_scores,
        key=topic_scores.get
    )


    if topic_scores[best_topic] > 0:
        return best_topic


    return smart_topic_name(text.split())
# ---------------------------
# SMART TOPIC NAMING (NEW)
# ---------------------------
# ---------------------------
# SMART TOPIC NAMING (NEW)
# ---------------------------
def smart_topic_name(words):

    text = " ".join(words).lower()


    if any(w in text for w in ["football", "cricket", "tennis", "match"]):
        return "Sports"


    if any(w in text for w in ["movie", "film", "actor", "cinema","netflix","series","show","kpop","game","gaming","anime"]):
        return "Entertainment"


    if any(w in text for w in ["music", "song", "album"]):
        return "Music"


    if any(w in text for w in ["school", "college", "exam"]):
        return "Education"


    if any(w in text for w in ["food", "dinner", "lunch", "breakfast"]):
        return "Food"


    if any(w in text for w in ["doctor", "hospital", "pain", "sick"]):
        return "Health"


    if any(w in text for w in [
    "tech",
    "ai",
    "software",
    "app",
    "phone",
    "mobile",
    "laptop",
    "camera",
    "battery",
    "computer"
]):
     return "Technology"


    if any(w in text for w in ["travel", "trip", "flight"]):
        return "Travel"


    if any(w in text for w in ["stock", "business", "money"]):
        return "Business"

    return "General"