import pickle
from bertopic import BERTopic
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction import text
from sklearn.feature_extraction.text import CountVectorizer
import os

bertopic_model_file = "bertopic_model.pkl"
sentence_transformer_name = "sentence_transformer_model"
models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
bertopic_model_path = f'{models_dir}/{bertopic_model_file}'
sentence_transformer_path = f'{models_dir}/{sentence_transformer_name}'

def create_sentence_transformer_model() -> SentenceTransformer:
    model = SentenceTransformer('all-mpnet-base-v2')
    save_sentence_transformer_model(model)
    return model

def get_trained_sentence_transformer() -> SentenceTransformer:
    # works onlt if you trained the model, can download the folder from drive instead (GIY LFS was too mucgh for yoav ..)
    # https://drive.google.com/drive/folders/1sNtvm0IrMmYlvZalasULVxYBhWT_5WAP?usp=drive_link
    # put the trained_miniLM_twitter directory in models
    return SentenceTransformer( os.path.join(models_dir, 'trained_miniLM_twitter'))

def get_sentence_transformer_model() -> SentenceTransformer:
    if os.path.exists(sentence_transformer_path):
        return SentenceTransformer(sentence_transformer_path)
    else:
        return create_sentence_transformer_model()

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
    if os.path.exists(bertopic_model_path):
        with open(bertopic_model_path, "rb") as file:
            return pickle.load(file)
    else:
        return create_model()