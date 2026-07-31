from app.sentiment import analyze_roberta_sentiment


def test_positive_sentiment():
    result = analyze_roberta_sentiment("I love this phone")
    assert result["sentiment"].lower() == "positive"


def test_negative_sentiment():
    result = analyze_roberta_sentiment("I hate this phone")
    assert result["sentiment"].lower() == "negative"


def test_neutral_sentiment():
    result = analyze_roberta_sentiment("The phone is on the table.")
    assert result["sentiment"].lower() == "neutral"