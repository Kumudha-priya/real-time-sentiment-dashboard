from app.database import SessionLocal
from app.models import Post
from app.utils import assign_topic


def insert_data(dataframe):

    session = SessionLocal()

    posts = []

    try:

        for _, row in dataframe.iterrows():

            try:

                # Support different dataset column names
                text = (
                    row.get("text")
                    or row.get("content")
                    or row.get("post")
                    or "No Text"
                )

                sentiment = (
                    row.get("sentiment")
                    or "neutral"
                )

                confidence = (
                    row.get("confidence_score")
                    or 0
                )

                source = (
                    row.get("source")
                    or "dataset"
                )

                post = Post(
                    text=str(text),
                    cleaned_text=None,
                    source=str(source),
                    sentiment=str(sentiment),
                    confidence_score=float(confidence),
                    topic_name=assign_topic(str(text))
                )

                posts.append(post)

            except Exception as e:

                print(
                    "Skipped row:",
                    e
                )

        if posts:

            session.bulk_save_objects(posts)

            session.commit()

        print(
            "DATA INSERTED SUCCESSFULLY:",
            len(posts),
            "rows"
        )

    except Exception as e:

        session.rollback()

        print(
            "INSERT ERROR:",
            e
        )

    finally:

        session.close()