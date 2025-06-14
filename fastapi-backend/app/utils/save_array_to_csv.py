import os
import csv
from typing import List, Dict
from ..definitions import ROOT_DIR

def save_array_to_csv(data: List[Dict], dataset_name: str) -> str:
    """Saves a list of dictionaries to a CSV file."""
    if not data:
        return

    # Assuming "datasets" folder is one level up from this utils folder
    base_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "datasets")
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
        
    keys = data[0].keys()  # Get the keys from the first dictionary to use as headers
    
    save_path = os.path.join(base_dir, f"{dataset_name}.csv")
    with open(save_path, "w", newline="", encoding="utf-8") as output_file:
        writer = csv.writer(output_file, keys=keys)
        writer.writeheader()
        writer.writerows(data)
        
    return save_path