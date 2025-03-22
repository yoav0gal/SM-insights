import pickle
from bertopic import BERTopic
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction import text
from sklearn.feature_extraction.text import CountVectorizer
import os

bertopic_model_file = "bertopic_model.pkl"
sentence_transformer_name = "sentence_transformer"
models_dir = os.path.dirname(os.path.abspath(__file__))
bertopic_model_path = f'{models_dir}/{bertopic_model_file}'
sentence_transformer_path = f'{models_dir}/{sentence_transformer_name}'

def get_sentence_transformer_model() -> SentenceTransformer:
    return SentenceTransformer(sentence_transformer_path)

def save_sentence_transformer_model(model: SentenceTransformer):
    model.save(sentence_transformer_path)

def create_model() -> BERTopic:
    vectorizer_model = CountVectorizer(stop_words="english")
    sentence_model = get_sentence_transformer_model()

    bertopic_model = BERTopic(
        vectorizer_model=vectorizer_model,
        embedding_model=sentence_model,
        language='english',
        calculate_probabilities=True,
        verbose=True)
    
    with open(bertopic_model_path, "wb") as file:
        pickle.dump(bertopic_model, file)

    return bertopic_model

def get_model() -> BERTopic:
    with open(bertopic_model_path, "rb") as file:
        return pickle.load(file)