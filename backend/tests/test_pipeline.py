from app.pipeline import run_pipeline


def test_pipeline():
    posts = [
        {"text": "I love this phone"},
        {"text": "Battery is terrible"}
    ]

    result = run_pipeline(posts)

    # Check that the pipeline returns the expected main sections
    assert "results" in result
    assert "keywords" in result
    assert "trends" in result
    assert "brand_analysis" in result

    # Check processed posts
    results = result["results"]

    assert len(results) == 2

    # Check required fields in the processed result
    assert "sentiment" in results[0]
    assert "confidence" in results[0]
    assert "model" in results[0]
    assert "prediction_time" in results[0]

    assert "sentiment" in results[1]
    assert "confidence" in results[1]
    assert "model" in results[1]
    assert "prediction_time" in results[1]

