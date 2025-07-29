from __future__ import annotations
from typing import List, Dict, TypedDict, Optional, Tuple
from collections import defaultdict
import pandas as pd

# --- Your TopicCluster type ---
class TopicCluster(TypedDict):
    label: str
    description: str
    members: List[str]
    subclusters: List["TopicCluster"]  # empty list at leaves
