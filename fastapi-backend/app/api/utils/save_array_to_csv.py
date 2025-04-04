import csv
from typing import List, Dict

def save_array_to_csv(data: List[Dict], dataset_name: str):
    """Saves a list of dictionaries to a CSV file."""
    if not data:
        return


    save_path = f"./datasets/{dataset_name}.csv"    


    keys = data[0].keys()

    with open(save_path , "w", newline="", encoding="utf-8") as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)