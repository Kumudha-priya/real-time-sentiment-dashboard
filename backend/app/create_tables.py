from database import engine
from app.models import Base, Post, Topic   

print("SCRIPT STARTED")

print(Base.metadata.tables.keys())

Base.metadata.create_all(bind=engine)

print("Tables created successfully!")