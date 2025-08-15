from typing import List, Optional, TypedDict, Any, Dict
import re
from .emojies import UNICODE_EMO
from .emoticons import EMOTICONS
from bertopic import BERTopic
from .models import umap_model, hdbscan_model, representation_model, embedding_model, kmeans_model
from sklearn.base import clone
from sklearn.cluster import KMeans
from .subclusters import build_subclusters_umap


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


def clean_text(text: str | int | float) -> str:
    text = str(text)
    text = text.lower()
    # text = convert_emojis(text)
    # text = convert_emoticons(text)
    # text = remove_emoji(text)
    return text



def extract_clusters_from_texts(texts: List[str]) -> List[Dict[str, Any]]:
    print("Starting BERTopic analysis...")

    # keep original indices so we can return original texts (not cleaned)
    cleaned_pairs = [(i, clean_text(t)) for i, t in enumerate(texts)]
    kept = [(i, t) for i, t in cleaned_pairs if len(t.split()) > 3 and t.isascii()]
    if not kept:
        print("No valid texts to analyze after cleaning.")
        return []

    orig_idx = [i for i, _ in kept]
    cleaned_texts = [t for _, t in kept]

    topic_model = BERTopic(
        embedding_model=embedding_model,
        verbose=True,
        representation_model=representation_model,
        umap_model=umap_model,
        hdbscan_model=hdbscan_model,
    )

    try:
        topics, _ = topic_model.fit_transform(cleaned_texts)
    except Exception as e:
        print("Error during topic modeling:", e)
        return []

    # UMAP coordinates used by HDBSCAN; same order as cleaned_texts
    umap_coords = topic_model.umap_model.embedding_

    topic_info = topic_model.get_topic_info()
    result: List[Dict[str, Any]] = []

    for _, row in topic_info.iterrows():
        topic_id = row["Topic"]
        if topic_id == -1:
            continue

        topic_info = topic_model.get_topic(topic_id)
        parent_label = topic_info[0][0]

        # indices into cleaned_texts for this topic
        doc_ids = [i for i, t in enumerate(topics) if t == topic_id]

        # members mapped back to original texts, in the same order as doc_ids
        parent_members = [texts[orig_idx[j]] for j in doc_ids]

        # --- KMeans subclustering in UMAP space (k=5, capped to size) ---
        subclusters = build_subclusters_umap(
            parent_label=parent_label,
            doc_ids=doc_ids,
            umap_coords=umap_coords,
            parent_members=parent_members,
            kmeans_template=kmeans_model,
            k=5,
        )

        result.append({
            "label": parent_label,
            "count": len(parent_members),
            "members": parent_members,
            "subclusters": subclusters
        })

    return result
