from typing import Dict, Optional
import asyncio
import pandas as pd
from ...api.youtube_comments.logic import create_youtube_comments_dataset
from .shared_state import init_process_state, set_process_state, ProcessState
from .BERTopic import extract_clusters_from_texts

async def run_deep_stc_analysis(video_id: str, limit: int) -> None:
    """Background task to run deep-stc analysis on YouTube comments."""
    try:
        init_process_state(video_id, limit)
        
        dataset_name = f"{video_id}_{limit}"
        dataset_path = await create_youtube_comments_dataset(video_id, limit, video_id)
        
        # Read the dataset
        df = pd.read_csv(dataset_path)
        
        # Extract comments text for analysis
        comments = df['text'].tolist()
        
        print(f"Running deep STC analysis for video {video_id} with limit {limit}")
        # Run BERTopic analysis
        stc_results = extract_clusters_from_texts(comments, min_topic_size=5)

        state: ProcessState = {
            "name": dataset_name,
            "status": "completed",
            "dataset_path": dataset_path,
            "stc_results": stc_results,
            "error_message": None
        }
        
        set_process_state(video_id, limit, state)
        
    except Exception as e:
        error_state: ProcessState = {
            "name": f"{video_id}_{limit}",
            "status": "error",
            "dataset_path": "",
            "stc_results": None,
            "error_message": str(e)
        }
        set_process_state(video_id, limit, error_state)