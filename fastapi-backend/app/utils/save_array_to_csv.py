import os
import pandas as pd
from typing import List, Dict
from ..definitions import ROOT_DIR

def get_save_path(dataset_name: str) -> str:
    """Generates the save path for the dataset."""
    base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "datasets")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
    return os.path.join(base_dir, f"{dataset_name}.csv")

def save_array_to_csv(data: List[Dict], dataset_name: str) -> str:
    """Saves a list of dictionaries to a CSV file."""
    if not data:
        return

    # Assuming "datasets" folder is one level up from this utils folder

    
    save_path = get_save_path(dataset_name)
    
    
    # Create a DataFrame and save it to CSV
    df = pd.DataFrame(data)
    
    df.to_csv(save_path, index=False)
    print(f"Dataset saved to {save_path}")
    return save_path