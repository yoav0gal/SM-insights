import numpy as np
from hdbscan import HDBSCAN
from sklearn.cluster import KMeans
from sklearn.metrics import davies_bouldin_score
from sklearn.base import ClusterMixin, BaseEstimator
import hdbscan

class HybridClustering(BaseEstimator, ClusterMixin):
    """
    A hybrid clustering model that combines HDBSCAN for noise filtering with
    optimized K-Means clustering.

    This approach can first use HDBSCAN to identify and filter out noise points
    from the dataset. Then, it automatically determines the optimal number of
    clusters (K) for the remaining data points using the Davies-Bouldin score.
    Finally, it applies K-Means clustering to the non-noise points.

    This method is designed to be compatible with the BERTopic clustering pipeline.
    """
    def __init__(self, min_cluster_size=7, cluster_selection_method='leaf', prediction_data=True, allow_single_cluster=False, gen_min_span_tree=True, max_k=20, use_hdbscan=True):
        """
        Initializes the HybridClustering model.

        Args:
            min_cluster_size (int): The minimum size of clusters for HDBSCAN.
            cluster_selection_method (str): The method for selecting clusters for HDBSCAN.
            prediction_data (bool): Whether to generate prediction data for HDBSCAN.
            allow_single_cluster (bool): Whether to allow a single cluster for HDBSCAN.
            gen_min_span_tree (bool): Whether to generate the minimum spanning tree for HDBSCAN.
            max_k (int): The maximum number of clusters to test for K-Means.
            use_hdbscan (bool): Whether to use HDBSCAN for noise filtering.
        """
        self.min_cluster_size = min_cluster_size
        self.cluster_selection_method = cluster_selection_method
        self.prediction_data = prediction_data
        self.allow_single_cluster = allow_single_cluster
        self.gen_min_span_tree = gen_min_span_tree
        self.max_k = max_k
        self.use_hdbscan = use_hdbscan

        if self.use_hdbscan:
            self.hdbscan_model = HDBSCAN(
                min_cluster_size=self.min_cluster_size,
                cluster_selection_method=self.cluster_selection_method,
                prediction_data=self.prediction_data,
                allow_single_cluster=self.allow_single_cluster,
                gen_min_span_tree=self.gen_min_span_tree,
            )
        else:
            self.hdbscan_model = None
            
        self.kmeans_model = None
        self.labels_ = None

    def _find_optimal_k(self, embeddings: np.ndarray) -> int:
        """
        Determines the optimal number of clusters (K) for K-Means using the
        Davies-Bouldin score.

        Args:
            embeddings (np.ndarray): The embeddings to cluster.

        Returns:
            int: The optimal number of clusters (K).
        """
        if len(embeddings) < 2:
            return 1

        k_range = range(2, min(self.max_k, len(embeddings)))
        if not k_range:
            return 1
            
        db_scores = []
        for k in k_range:
            kmeans = KMeans(n_clusters=k, random_state=42, n_init='auto')
            kmeans.fit(embeddings)
            labels = kmeans.labels_
            if len(np.unique(labels)) > 1:
                db_score = davies_bouldin_score(embeddings, labels)
                db_scores.append(db_score)
            else:
                db_scores.append(np.inf)

        if not db_scores:
            return 2

        optimal_k = k_range[np.argmin(db_scores)]
        return optimal_k

    def fit(self, embeddings: np.ndarray, y=None):
        """
        Fits the hybrid clustering model to the embeddings.

        Args:
            embeddings (np.ndarray): The embeddings to cluster.
            y: Not used, present for API consistency.

        Returns:
            self: The fitted model instance.
        """
        if self.use_hdbscan:
            # 1. Apply HDBSCAN to identify noise points
            self.hdbscan_model.fit(embeddings)
            hdbscan_labels = self.hdbscan_model.labels_

            noise_indices = np.where(hdbscan_labels == -1)[0]
            non_noise_indices = np.where(hdbscan_labels != -1)[0]

            print(f"Found {len(noise_indices)} noise points out of {len(embeddings)} total points.")

            if len(non_noise_indices) == 0:
                self.labels_ = hdbscan_labels
                return self

            non_noise_embeddings = embeddings[non_noise_indices]

            # 2. Automatically determine the optimal K value
            optimal_k = self._find_optimal_k(non_noise_embeddings)
            print(f"Optimal k selected - {optimal_k}")

            # 3. Perform K-Means clustering on the remaining points
            self.kmeans_model = KMeans(n_clusters=optimal_k, random_state=42, n_init='auto')
            self.kmeans_model.fit(non_noise_embeddings)
            kmeans_labels = self.kmeans_model.labels_

            # 4. Combine the labels
            final_labels = np.full(len(embeddings), -1, dtype=int)
            final_labels[non_noise_indices] = kmeans_labels

            self.labels_ = final_labels
        else:
            # Skip HDBSCAN and directly apply optimal K-Means
            optimal_k = self._find_optimal_k(embeddings)
            print(f"Optimal k selected - {optimal_k}")

            self.kmeans_model = KMeans(n_clusters=optimal_k, random_state=42, n_init='auto')
            self.kmeans_model.fit(embeddings)
            self.labels_ = self.kmeans_model.labels_
            
        return self

    def predict(self, embeddings: np.ndarray) -> np.ndarray:
        """
        Predicts cluster labels for new embeddings.

        Args:
            embeddings (np.ndarray): The new embeddings to predict.

        Returns:
            np.ndarray: The predicted cluster labels.
        """
        if self.kmeans_model is None:
            raise RuntimeError("The model has not been fitted yet.")

        if self.use_hdbscan:
            # Use HDBSCAN to identify noise points in the new data
            hdbscan_labels, _ = hdbscan.approximate_predict(self.hdbscan_model, embeddings)

            noise_indices = np.where(hdbscan_labels == -1)[0]
            non_noise_indices = np.where(hdbscan_labels != -1)[0]

            if len(non_noise_indices) == 0:
                return hdbscan_labels

            non_noise_embeddings = embeddings[non_noise_indices]

            # Predict clusters for non-noise points using the fitted K-Means model
            kmeans_labels = self.kmeans_model.predict(non_noise_embeddings)

            # Combine the labels
            final_labels = np.full(len(embeddings), -1, dtype=int)
            final_labels[non_noise_indices] = kmeans_labels

            return final_labels
        else:
            return self.kmeans_model.predict(embeddings)
