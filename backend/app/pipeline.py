from app.preprocess import clean_text
from app.sentiment import analyze_roberta_sentiment
from app.keywords import extract_keywords
from app.brand_analysis import analyze_brand_keywords
from app.export_utils import export_results_csv
from app.trend_analysis import detect_trends

# -----------------------------------
# MAIN PIPELINE
# -----------------------------------

def run_pipeline(posts):

    results = []

    cleaned_posts = []

    # -----------------------------------
    # PREPROCESSING
    # -----------------------------------

    for post in posts:

        cleaned = clean_text(post["text"])

        cleaned_posts.append(cleaned)

    # -----------------------------------
    # SENTIMENT ANALYSIS
    # -----------------------------------

    sentiments = []

    for text in cleaned_posts:

        result = analyze_roberta_sentiment(text)

        sentiments.append({
            "sentiment": result["sentiment"],
            "confidence": result["confidence"]
})

    # -----------------------------------
    # KEYWORD EXTRACTION
    # -----------------------------------

    keywords = extract_keywords(cleaned_posts)

    # -----------------------------------
    # FINAL RESULTS
    # -----------------------------------

    for i in range(len(posts)):

        results.append({

            "original_text": posts[i]["text"],

            "cleaned_text": cleaned_posts[i],

            "sentiment": sentiments[i]["sentiment"],

            "confidence": sentiments[i]["confidence"],
            "model": sentiments[i]["model"],
            "prediction_time": sentiments[i]["prediction_time"]

        })

    # -----------------------------------
    # BRAND ANALYSIS
    # -----------------------------------

    apple_analysis = analyze_brand_keywords(
        posts,
        ["apple", "iphone", "ios"]
    )

    samsung_analysis = analyze_brand_keywords(
        posts,
        ["samsung", "galaxy", "android"]
    )

    # -----------------------------------
    # TREND ANALYSIS
    # -----------------------------------

    trends = detect_trends(results)

    # -----------------------------------
    # EXPORT CSV
    # -----------------------------------

    export_results_csv(results)

    # -----------------------------------
    # RETURN FINAL OUTPUT
    # -----------------------------------

    return {

        "results": results,

        "keywords": keywords,

        "trends": trends,

        "brand_analysis": {

            "apple": apple_analysis,

            "samsung": samsung_analysis

        }

    }