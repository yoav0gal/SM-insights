from typing import List, Any, Dict
from sklearn.base import clone
from sklearn.cluster import KMeans
from .models.representation import llm, prompt

def build_subclusters_umap(
    parent_label: str,
    doc_ids: List[int],               # indices into cleaned_texts for this topic
    umap_coords,                      # array-like; same order as cleaned_texts
    parent_members: List[str],        # texts for this topic in the same order as doc_ids
    kmeans_template: KMeans,
    k: int = 5,
) -> List[Dict[str, Any]]:
    """Cluster in UMAP space and return mocked-label subclusters (no NumPy)."""
    if len(doc_ids) < 2:
        return []

    k_eff = min(max(2, k), len(doc_ids))
    X = [list(umap_coords[i]) for i in doc_ids]  # slice the UMAP rows we need

    km : KMeans = clone(kmeans_template)
    km.set_params(n_clusters=k_eff)
    labels = km.fit_predict(X)

    # group local positions by label
    groups: Dict[int, List[int]] = {}
    for pos, lbl in enumerate(labels):
        groups.setdefault(int(lbl), []).append(pos)
        

    # build subclusters (positions map directly into parent_members)
    subclusters: List[Dict[str, Any]] = []
    for sub_id in sorted(groups.keys()):
        positions = groups[sub_id]
        sub_texts = [parent_members[p] for p in positions]
        sub_label = generate_subcluster_label(sub_texts)
        subclusters.append({
            "label": sub_label,
            "count": len(sub_texts),
            "members": sub_texts,
            "subclusters": []
        })

    # largest first
    subclusters.sort(key=lambda s: s["count"], reverse=True)
    return subclusters


def generate_subcluster_label(members: List[str]) -> str:
    """Return a short label for the subcluster using the preconfigured LLM and prompt."""
    if not members:
        return "Subtopic"

    documents_block = "\n".join(f"- {m}" for m in members[:25])
    filled_prompt = (
        prompt
        .replace("[DOCUMENTS]", documents_block)
        .replace("[KEYWORDS]", "")
        .strip()
    )

    try:
        response = llm.invoke(filled_prompt)
        text = getattr(response, "content", None) or str(response)
        for line in text.splitlines():
            line = line.strip()
            if line:
                return line
    except Exception:
        pass

    return "Subtopic"