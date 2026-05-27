from collections import Counter

from app.preprocess import clean_text


# -----------------------------------
# BRAND KEYWORD ANALYSIS
# -----------------------------------

def analyze_brand_keywords(posts, brand_keywords):

    matched_posts = []

    keyword_counter = Counter()

    # -----------------------------------
    # FIND MATCHING POSTS
    # -----------------------------------

    for post in posts:

        cleaned = clean_text(post["text"])

        words = cleaned.split()

        # check if any brand keyword exists
        if any(keyword in words for keyword in brand_keywords):

            matched_posts.append(post["text"])

            keyword_counter.update(words)

    # -----------------------------------
    # REMOVE BRAND WORDS THEMSELVES
    # -----------------------------------

    for keyword in brand_keywords:

        keyword_counter.pop(keyword, None)

    # -----------------------------------
    # TOP RELATED WORDS
    # -----------------------------------

    top_keywords = keyword_counter.most_common(10)

    return {

        "brand_keywords": brand_keywords,

        "matched_posts_count": len(matched_posts),

        "top_related_keywords": top_keywords,

        "sample_posts": matched_posts[:5]

    }