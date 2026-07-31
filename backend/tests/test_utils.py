from app.utils import clean_text, assign_topic


def test_clean_text():
    text = "I LOVE AI!!!"

    result = clean_text(text)

    assert result == "i love ai!!!"


def test_assign_topic():
    text = "I love cricket"

    result = assign_topic(text)

    assert result == "Sports"