import logging
import os

# Create logs folder if not exists
os.makedirs("logs", exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(os.path.join("logs", "app.log"), encoding="utf-8"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("sentiment_app")