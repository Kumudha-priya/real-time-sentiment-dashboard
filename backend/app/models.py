from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import declarative_base
from datetime import datetime, UTC


Base = declarative_base()

# -----------------------------
# POSTS TABLE
# -----------------------------
class Post(Base):

    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, autoincrement=True)

    text = Column(String)
    cleaned_text = Column(String)

    source = Column(String)

    sentiment = Column(String)
    
    manual_sentiment = Column(String, nullable=True)

    confidence_score = Column(Float)

    platform = Column(String)

    topic_id = Column(Integer)

    topic_name = Column(
    String,
    default="General"
)

    processed_at = Column(
    DateTime,
    default=lambda: datetime.now(UTC)
)


# -----------------------------
# TOPICS TABLE
# -----------------------------
class Topic(Base):

    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, autoincrement=True)

    topic_id = Column(Integer, unique=True)
    topic_name = Column(String)


# -----------------------------
# LIVE FEED TABLE (FIXED)
# -----------------------------
class LiveFeed(Base):

    __tablename__ = "live_feed"

    id = Column(Integer, primary_key=True, index=True)

    text = Column(String)

    sentiment = Column(String)

    confidence = Column(Float)

    topic = Column(String)

    keywords = Column(Text)
    created_at = Column(
    DateTime,
    default=datetime.utcnow
)

manual_sentiment = Column(String, nullable=True)
    
class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String,
        nullable=True
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )