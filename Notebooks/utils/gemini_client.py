import os
from pathlib import Path
from typing import List

import numpy as np
import pandas as pd
from datasets import Dataset
from dotenv import load_dotenv
from google import genai
from scipy.stats import pearsonr, spearmanr
from sklearn.metrics.pairwise import cosine_similarity
from tqdm import tqdm

script_dir: Path = Path(__file__)
rood_dir: Path = script_dir.parent.parent.parent
dotenv_path = rood_dir / "final-project-next" / ".env"
load_dotenv(dotenv_path=dotenv_path)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

google_client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-embedding-001"
OUTPUT_DIMENSIONALITY = 768
BATCH_SIZE = 36
SEMANTIC_SIMILARITY_TASK = "SEMANTIC_SIMILARITY"


def add_embedding_dimensions(df, all_embeddings):
    if len(all_embeddings) > 0 and all_embeddings[0] is not None:
        dims_amount = len(all_embeddings[0])
        for dim in range(dims_amount):
            df[f"embed_dim_{dim}"] = [
                emb[dim] if emb is not None else None for emb in all_embeddings
            ]

    return df


def add_embeddings_to_dataframe(
    df,
    model_name=MODEL_NAME,
    task_type=SEMANTIC_SIMILARITY_TASK,
    output_dimensionality=OUTPUT_DIMENSIONALITY,
    batch_size=BATCH_SIZE,
):
    """
    Generates embeddings for a DataFrame's 'text' column using the Gemini API
    and adds the resulting embedding dimensions as new columns to the DataFrame.

    This function iterates through the input DataFrame in batches, sends the
    'text' content to the Gemini embedding model, and then expands the returned
    embedding vectors into individual columns (e.g., 'embed_dim_0', 'embed_dim_1', etc.)
    within the original DataFrame.
    """
    print("Generating embeddings...")
    texts = df["text"].tolist()
    all_embeddings = []

    # tqdm is assumed to be imported (e.g., from tqdm import tqdm)
    # google_client is assumed to be initialized globally (e.g., genai.Client(api_key=GEMINI_API_KEY))
    for i in tqdm(
        range(0, len(texts), batch_size),
        desc="Processing embeddings batches",
        unit="batch",
    ):
        batch_texts = texts[i : i + batch_size]
        try:
            embeddings_response = google_client.models.embed_content(
                model=model_name,
                contents=batch_texts,
                config={
                    "task_type": task_type,
                    "output_dimensionality": output_dimensionality,
                },
            )
            # Accessing .values assumes the embedding object has a 'values' attribute,
            # which is common for this API.
            all_embeddings.extend(
                [item.values for item in embeddings_response.embeddings]
            )

        except Exception as e:
            print(f"Error during embedding batch {i // batch_size}: {e}")
            # If an error occurs, append a list of Nones for each text in the failed batch
            # to maintain the DataFrame's alignment.
            all_embeddings.extend([None] * len(batch_texts))

    # add_embedding_dimensions is assumed to be another function that takes the df
    # and all_embeddings list and adds the dimensions as new columns.
    add_embedding_dimensions(df, all_embeddings)

    return df


def evaluate_gemini_sts(eval_dataset: Dataset):
    """
    Evaluates the performance of Gemini embeddings on a Semantic Textual Similarity (STS) task.

    This function generates embeddings for provided sentence pairs using the globally
    initialized Gemini embedding model, calculates cosine similarities between these
    embeddings, and then computes Pearson and Spearman correlation with the given
    ground truth scores.

    Returns:
        tuple: A tuple containing:
               - pearson_correlation (float): Pearson correlation coefficient.
               - spearman_correlation (float): Spearman correlation coefficient.
               Returns (None, None) if embedding generation fails or inputs are invalid.
    """
    sentences1: List[str] = eval_dataset["sentence1"]
    sentences2: List[str] = eval_dataset["sentence2"]
    ground_truth_scores: np.ndarray = np.array(eval_dataset["score"])

    df_sentences1 = pd.DataFrame({"text": sentences1})
    df_sentences2 = pd.DataFrame({"text": sentences2})

    # Generate embeddings using the local add_embeddings_to_dataframe function
    df_with_embeddings1: pd.DataFrame = add_embeddings_to_dataframe(df_sentences1)
    df_with_embeddings2: pd.DataFrame = add_embeddings_to_dataframe(df_sentences2)

    embedding_cols1 = [
        col for col in df_with_embeddings1.columns if col.startswith("embed_dim_")
    ]
    embedding_cols2 = [
        col for col in df_with_embeddings2.columns if col.startswith("embed_dim_")
    ]

    # Extract the embedding values as NumPy arrays
    # .values converts the selected DataFrame slice into a NumPy array
    embeddings1 = df_with_embeddings1[embedding_cols1].values
    embeddings2 = df_with_embeddings2[embedding_cols2].values

    calculated_similarities_matrix = cosine_similarity(embeddings1, embeddings2)
    # We need the similarity for each (sentence1_i, sentence2_i) pair, which is on the diagonal
    calculated_similarities = np.diag(calculated_similarities_matrix)

    pearson_corr, _ = pearsonr(ground_truth_scores, calculated_similarities)
    spearman_corr, _ = spearmanr(ground_truth_scores, calculated_similarities)

    return pearson_corr, spearman_corr
