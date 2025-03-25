from typing import List
import pandas as pd
import os

def get_comments(dataset_name: str) -> List[str]:
    dataset_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datasets", "youtube_comments", f'{dataset_name}.csv')
    dataset_df = pd.read_csv(dataset_path)
    data = dataset_df['text'].tolist()

    return data