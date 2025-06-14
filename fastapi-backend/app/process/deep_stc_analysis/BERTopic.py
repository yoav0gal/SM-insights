
from typing import List, Optional, TypedDict
import re
from .emojies import UNICODE_EMO
from .emoticons import EMOTICONS
from .gemini_labeling import representation_model
from sentence_transformers import SentenceTransformer
from bertopic import BERTopic

class ClusterData(TypedDict):
    label: str
    count: int
    members: List[str]
    subclusters: Optional['ClusterData']

def remove_emoji(text): return re.sub(r"["
    u"\U0001F600-\U0001F64F"
    u"\U0001F300-\U0001F5FF"
    u"\U0001F680-\U0001F6FF"
    u"\U0001F1E0-\U0001F1FF"
    "]+", "", text, flags=re.UNICODE)

def convert_emoticons(text):
    for emot in EMOTICONS:
        text = re.sub(u'('+emot+')', "_".join(EMOTICONS[emot].replace(",","").split()), text)
    return text

def convert_emojis(text):
    for emot in UNICODE_EMO:
        text = re.sub(r'('+emot+')', "_".join(UNICODE_EMO[emot].replace(",","").replace(":","").split()), text)
    return text


def clean_text(text: str) -> str:
    text = text.lower()
    text = convert_emojis(text)
    text = convert_emoticons(text)
    text = remove_emoji(text)
    return text


def extract_clusters_from_texts(texts: List[str]) -> List[ClusterData]:
    print("Starting BERTopic analysis...")
    cleaned_texts = [clean_text(t) for t in texts]
    cleaned_texts = [t for t in cleaned_texts if len(t.split()) > 3 and t.isascii()]
    if not cleaned_texts:   # Check if cleaned_texts is empty
        print("No valid texts to analyze after cleaning.")
        return []

    embedding_model = SentenceTransformer("all-mpnet-base-v2")
    topic_model = BERTopic(
        embedding_model=embedding_model, 
        verbose=True,
        #representation_model = representation_model, 
        nr_topics=5, 
        min_topic_size=10)

    print("hi")
    try:
        topics, _ = topic_model.fit_transform(cleaned_texts)
    except Exception as e:
        print("Error during topic modeling:", e)
        return []
    print("bye")
    
    print(topics)

    topic_info = topic_model.get_topic_info()
    result: List[ClusterData] = []

    print("AAA")
    for _, row in topic_info.iterrows():
        print("H")
        if row["Topic"] == -1:
            continue
        topic_label = topic_model.get_topic(row["Topic"])
        label = ", ".join([word for word, _ in topic_label[:3]])
        members = [texts[i] for i, topic_num in enumerate(topics) if topic_num == row["Topic"]]
        result.append({
            "label": label,
            "count": len(members),
            "members": members,
            "subclusters": None
        })

    print("C")
    return result
