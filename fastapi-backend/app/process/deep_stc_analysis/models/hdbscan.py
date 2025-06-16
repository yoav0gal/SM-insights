from hdbscan import HDBSCAN

hdbscan_model = HDBSCAN(
    min_cluster_size=10,
    cluster_selection_method='leaf',
    prediction_data=True,
    allow_single_cluster=False,
    gen_min_span_tree=True,
)