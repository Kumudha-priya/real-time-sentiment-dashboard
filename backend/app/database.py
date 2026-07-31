from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base


print("SCRIPT STARTED")

DATABASE_URL = "postgresql://postgres:Madhusql%40123@localhost:5432/sentiment_db"

# Engine
engine = create_engine(DATABASE_URL)

# Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Test connection
try:
    connection = engine.connect()
    print("PostgreSQL Database Connected Successfully")
    connection.close()

except Exception as e:
    print("Connection Failed:", e)