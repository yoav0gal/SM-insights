
from ast import Dict, Tuple
from typing import List, Optional, TypedDict
import re
from .emojies import UNICODE_EMO
from .emoticons import EMOTICONS
from bertopic import BERTopic
from .models import umap_model, hdbscan_model, representation_model, embedding_model
from .TopicCluster import TopicCluster
import pandas as pd
from collections import defaultdict
from functools import lru_cache


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

def convert_clusters(heirarchy: List[List[int]]) -> List[ClusterData]:
    result: List[ClusterData] = []
    for cluster in heirarchy:
        result.append({
            "label": cluster[0],
            "count": len(cluster),
            "members": cluster,
            "subclusters": None
        })
    return result


topic_model = BERTopic(
    embedding_model=embedding_model, 
    verbose=True,
    representation_model = representation_model, 
    umap_model=umap_model,
    hdbscan_model=hdbscan_model,
    )

# def extract_clusters_from_texts(texts: List[str]) -> List[ClusterData]:
#     print("Starting BERTopic analysis...")
#     cleaned_texts = [clean_text(t) for t in texts]
#     cleaned_texts = [t for t in cleaned_texts if len(t.split()) > 3 and t.isascii()]
#     if not cleaned_texts:   # Check if cleaned_texts is empty
#         print("No valid texts to analyze after cleaning.")
#         return []


#     try:
#         topics, _ = topic_model.fit_transform(cleaned_texts)
        
#     except Exception as e:
#         print("Error during topic modeling:", e)
#         return []

#     topic_info = topic_model.get_topic_info()
#     result: List[ClusterData] = []

#     for _, row in topic_info.iterrows():
#         if row["Topic"] == -1:
#             continue
#         topic_label = topic_model.get_topic(row["Topic"])
#         label = ", ".join([word for word, _ in topic_label[:3]])
        
#         members = [texts[i] for i, topic_num in enumerate(topics) if topic_num == row["Topic"]]
#         result.append({
#             "label": label,
#             "count": len(members),
#             "members": members,
#             "subclusters": None
#         })

#     return result


def _clean_and_filter_texts(texts: List[str]):
    """Clean texts and return both cleaned texts and original indices."""
    cleaned_texts = []
    original_indices = []
    
    for i, text in enumerate(texts):
        if text and len(text.split()) > 3 and text.isascii():
            cleaned_texts.append(text)
            original_indices.append(i)
    
    return cleaned_texts, original_indices


def _build_topic_hierarchy(cleaned_texts: List[str]):
    """Build hierarchical relationships using BERTopic's hierarchical_topics."""
    hier = topic_model.hierarchical_topics(cleaned_texts)
    
    # Build parent -> children mapping
    children = defaultdict(list)
    for _, row in hier.iterrows():
        parent_id = int(row["Parent_ID"])
        left_child = int(row["Child_Left_ID"])
        right_child = int(row["Child_Right_ID"])
        
        children[parent_id].extend([left_child, right_child])
    
    return children


def _get_topic_data(original_texts: List[str], original_indices: List[int], topics: List[int]) :
    """Extract topic labels, descriptions, counts, and member texts."""
    # Get topic info from BERTopic
    info = topic_model.get_topic_info()
    info = info[info["Topic"] != -1]  # Remove outliers
    
    # Build basic topic data
    topic_labels = {}
    topic_descriptions = {}
    topic_counts = {}
    
    for _, row in info.iterrows():
        topic_id = int(row["Topic"])
        topic_labels[topic_id] = str(row["Representation"][0])
        topic_descriptions[topic_id] = str(row["Description"][0])
        topic_counts[topic_id] = int(row["Count"])
    
    # Map original texts to topics
    topic_members = defaultdict(list)
    for i, topic_id in enumerate(topics):
        if topic_id != -1:  # Skip outliers
            original_text = original_texts[original_indices[i]]
            topic_members[topic_id].append(original_text)
    
    return topic_labels, topic_descriptions, topic_counts, topic_members


def _build_hierarchical_clusters(
    topic_labels: Dict[int, str],
    topic_descriptions: Dict[int, str], 
    topic_members: Dict[int, List[str]],
    children: Dict[int, List[int]]
) -> List[TopicCluster]:
    """Build hierarchical topic clusters."""
    
    # Find root nodes (parents that are not children)
    all_children = set()
    for child_list in children.values():
        all_children.update(child_list)
    
    all_parents = set(children.keys())
    roots = all_parents - all_children
    
    # If no hierarchy, use all topics as roots
    if not roots:
        roots = set(topic_labels.keys())
    
    def build_cluster(topic_id: int) -> TopicCluster:
        """Recursively build a cluster with its subclusters."""
        # Get members for this topic (including from subclusters)
        members = topic_members.get(topic_id, [])
        
        # If this is a merged node, aggregate from children
        if topic_id in children and topic_id not in topic_labels:
            child_clusters = [build_cluster(child_id) for child_id in children[topic_id]]
            # Aggregate members and count from children
            all_members = []
            for child in child_clusters:
                all_members.extend(child["members"])
            
            return {
                "label": f"Merged Topic {topic_id}",
                "description": " / ".join([child["label"] for child in child_clusters]),
                "members": all_members,
                "subclusters": child_clusters
            }
        
        # Regular topic cluster
        subclusters = []
        if topic_id in children:
            subclusters = [build_cluster(child_id) for child_id in children[topic_id]]
            # Add subcluster members to total
            for subcluster in subclusters:
                members.extend(subcluster["members"])
                count += subcluster["count"]
        
        return {
            "label": topic_labels.get(topic_id, f"Topic {topic_id}"),
            "description": topic_descriptions.get(topic_id, ""),
            "members": members,
            "subclusters": subclusters
        }
    
    return [build_cluster(root_id) for root_id in sorted(roots)]


def extract_clusters_from_texts(texts: List[str]) -> List[TopicCluster]:
    """Extract hierarchical topic clusters from texts using BERTopic."""
    print("Starting BERTopic analysis...")
    
    # Step 1: Clean and filter texts
    cleaned_texts, original_indices = _clean_and_filter_texts(texts)
    if not cleaned_texts:
        print("No valid texts to analyze after cleaning.")
        return []

    # Step 2: Fit the model
    try:
        topics, _ = topic_model.fit_transform(cleaned_texts)
    except Exception as e:
        print(f"Error during topic modeling: {e}")
        return []

    # Step 3: Get topic data (labels, descriptions, counts, members)
    topic_labels, topic_descriptions, topic_members = _get_topic_data(
        texts, original_indices, topics
    )
    
    # Step 4: Build hierarchical structure
    children = _build_topic_hierarchy(cleaned_texts)
    
    # Step 5: Build hierarchical clusters
    return _build_hierarchical_clusters(
        topic_labels, topic_descriptions, topic_members, children
    )