from dotenv import load_dotenv
import os


load_dotenv(dotenv_path="../.env.local")

YOUTUBE_DEFAULT_COMMENTS_LIMIT = 50
DOMAIN = os.getenv("DOMAIN", "http://localhost:8000")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

if not YOUTUBE_API_KEY:
    raise ValueError("YOUTUBE_API_KEY must be set in .env.local")