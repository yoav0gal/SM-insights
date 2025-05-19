from typing import List
import pandas as pd
import os

def csv_to_list(file_path: str) -> List[str]:
    data = pd.read_csv(file_path)
    data = data['text'].tolist()
    return data

def get_tweets(dataset_name: str = "tweets_timeLMS_processed") -> List[str]:
    dataset_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datasets", "tweets", "processed", f'{dataset_name}.csv')
    return csv_to_list(dataset_path)

def get_comments(dataset_name: str) -> List[str]:
    dataset_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "datasets", "youtube_comments", f'{dataset_name}.csv')
    return csv_to_list(dataset_path)