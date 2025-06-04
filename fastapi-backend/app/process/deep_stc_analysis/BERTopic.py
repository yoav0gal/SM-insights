
from typing import List, Optional, TypedDict
import re
import string
import nltk
from nltk.corpus import stopwords, wordnet
from nltk.stem import PorterStemmer, WordNetLemmatizer
from sentence_transformers import SentenceTransformer
from bertopic import BERTopic

# Ensure nltk resources are available
nltk.download("wordnet")
nltk.download("averaged_perceptron_tagger")
nltk.download("punkt")
nltk.download("stopwords")

class ClusterData(TypedDict):
    label: str
    count: int
    members: List[str]
    subclusters: Optional['ClusterData']

STOPWORDS = set(stopwords.words("english"))
stemmer = PorterStemmer()
lemmatizer = WordNetLemmatizer()
wordnet_map = {"N": wordnet.NOUN, "V": wordnet.VERB, "J": wordnet.ADJ, "R": wordnet.ADV}

def remove_punctuation(text): return text.translate(str.maketrans('', '', string.punctuation))
def remove_stopwords(text): return " ".join([word for word in text.split() if word not in STOPWORDS])
def remove_numbers(text): return re.sub(r"\d+", "", text)
def remove_emoji(text): return re.sub(r"["
    u"\U0001F600-\U0001F64F"
    u"\U0001F300-\U0001F5FF"
    u"\U0001F680-\U0001F6FF"
    u"\U0001F1E0-\U0001F1FF"
    "]+", "", text, flags=re.UNICODE)
def stem_words(text): return " ".join([stemmer.stem(word) for word in text.split()])
def lemmatize_words(text): 
    return " ".join([lemmatizer.lemmatize(word) for word in text.split()])


def clean_text(text: str) -> str:
    text = text.lower()
    text = remove_punctuation(text)
    text = remove_emoji(text)
    text = remove_numbers(text)
    text = remove_stopwords(text)
    text = lemmatize_words(text)
    return text

def extract_clusters_from_texts(texts: List[str], nr_topics: Optional[int] = None, min_topic_size: int = 10) -> List[ClusterData]:
    cleaned_texts = [clean_text(t) for t in texts]
    cleaned_texts = [t for t in cleaned_texts if len(t.split()) > 3 and t.isascii()]

    embedding_model = SentenceTransformer("all-mpnet-base-v2")
    topic_model = BERTopic(embedding_model=embedding_model, verbose=True, nr_topics=nr_topics, min_topic_size=min_topic_size)

    topics, _ = topic_model.fit_transform(cleaned_texts)

    topic_info = topic_model.get_topic_info()
    result: List[ClusterData] = []

    for _, row in topic_info.iterrows():
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

    return result
