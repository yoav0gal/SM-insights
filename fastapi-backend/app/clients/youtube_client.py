from googleapiclient.discovery import build
from ..core.config import YOUTUBE_API_KEY

youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)