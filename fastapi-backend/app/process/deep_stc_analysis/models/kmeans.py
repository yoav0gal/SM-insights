from sklearn.cluster import KMeans

kmeans_model = KMeans(
    n_clusters=5,
    max_iter=300,
    verbose=True,
)