from typing import Dict, List, Optional, TypedDict, Union, Literal

class ClusterData(TypedDict):
    label: str
    count: int
    members: List[str]
    subclusters: Optional['ClusterData']

class ProcessState(TypedDict):
    name: str
    status: Literal["running", "completed", "error"]
    dataset_path: str
    stc_results: Optional[ClusterData]
    error_message: Optional[str]

# Shared state dictionary to track process status
process_state: Dict[str, ProcessState] = {}

def get_process_key(video_id: str, limit: int) -> str:
    return f"{video_id}_{limit}"

def get_process_state(video_id: str, limit: int) -> Optional[ProcessState]:
    key = get_process_key(video_id, limit)
    return process_state.get(key)

def set_process_state(video_id: str, limit: int, state: ProcessState) -> None:
    key = get_process_key(video_id, limit)
    process_state[key] = state

def init_process_state(video_id: str, limit: int) -> None:
    key = get_process_key(video_id, limit)
    process_state[key] = {
        "name": key,
        "status": "running",
        "dataset_path": f"./datasets/{key}.csv",
        "stc_results": None,
        "error_message": None
    }