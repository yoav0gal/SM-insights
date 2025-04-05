from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from typing import Dict
from ...process.deep_stc_analysis.shared_state import get_process_state, init_process_state
from ...process.deep_stc_analysis.stc_process import run_deep_stc_analysis
import time
import logging
router = APIRouter(prefix="/deep-stc", tags=["deep-stc-analysis"])

@router.post("/initialize-process")
async def initialize_process(
    background_tasks: BackgroundTasks,
    video_id: str = Query(..., description="YouTube video ID"),
    limit: int = Query(default=100, description="Number of comments to analyze", ge=1)
) -> Dict:
    """Initialize deep-stc analysis process for a video."""
    
    existing_state = get_process_state(video_id, limit)

    if existing_state:
        if existing_state["status"] == "running":
            return {"message": "Process is already running", "process_name": existing_state["name"]}
        elif existing_state["status"] == "completed":
            return {"message": "Process already completed", "process_name": existing_state["name"]}
     
    init_process_state(video_id, limit)
    process_name = f"{video_id}_{limit}"
    
    background_tasks.add_task(run_deep_stc_analysis, video_id, limit)
    
    return {"message": "Started running the process", "process_name": process_name}

@router.get("/process-status/{process_name}")
async def get_process_status(
    process_name: str,
    limit: int = Query(default=100, description="Number of comments analyzed", ge=1)
) -> Dict:
    """Get the current status of deep-stc analysis process."""
    
    video_id = process_name.rsplit('_', 1)[0] if '_' in process_name else process_name
    
    state = get_process_state(video_id, limit)
    
    if not state:
        raise HTTPException(
            status_code=404,
            detail=f"No process found with name {process_name}"
        )
    
    return {"status": state["status"]}

@router.get("/process-status")
async def get_process_status_by_params(
    video_id: str = Query(..., description="YouTube video ID"),
    limit: int = Query(default=100, description="Number of comments analyzed")
) -> Dict:
    """Get the current status of deep-stc analysis process using video ID and limit."""
    
    state = get_process_state(video_id, limit)
    
    if not state:
        raise HTTPException(
            status_code=404,
            detail=f"No process found for video {video_id} with limit {limit}"
        )
    
    return {"status": state["status"]}

@router.get("/analysis-results")
async def get_analysis_results(
    video_id: str = Query(..., description="YouTube video ID"),
    limit: int = Query(default=100, description="Number of comments analyzed", ge=1)
) -> Dict:
    """Get the STC analysis results for a completed process."""
    
    state = get_process_state(video_id, limit)
    
    if not state:
        raise HTTPException(
            status_code=404,
            detail=f"No process found for video {video_id} with limit {limit}"
        )
    
    if state["status"] == "completed":
        return {"results": state["stc_results"]}
    elif state["status"] == "error":
        return {"message": f"Analysis failed: {state['error_message']}"}
    else:
        return {"message": "Analysis is still in progress"}