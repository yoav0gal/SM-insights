from fastapi import APIRouter, Query, HTTPException
from typing import List
import time
from .logic import get_video_comments_logic, create_youtube_comments_dataset
from .models import TransformedComment
from ...core.config import DOMAIN

router = APIRouter()

@router.get("/youtube_comments")
async def get_youtube_comments(
    video_id: str = Query(..., description="YouTube video ID"),
    limit: int = Query(100, description="Maximum number of comments to retrieve"),
    dataset_name: str = Query(..., description="Name of the dataset to save")
) -> str:
    """
    Fetches YouTube comments for a given video ID and saves them to a CSV file.
    """
    if "localhost" not in DOMAIN:
        raise HTTPException(status_code=400, detail="This route is valid only locally for now")

    try:
        result = await create_youtube_comments_dataset(video_id, limit, dataset_name)
        return f"message: {result}" 

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comments: {str(e)}")