from typing import List, Any, Dict
from .models import HybridClustering
import json

from .models.representation import llm, prompt  # prompt is not used in batch mode

# ----- BATCH PROMPT TEMPLATES ----- 
system_prompt = """
<s>[INST] <<SYS>>
You label groups of comments.
Rules:
1) Output exactly one short label per group, in order.
2) Return the labels as a JSON array of strings, nothing else.
3) No lead-ins, no explanations, no extra text.
4) Be specific and informative; avoid bland labels.
5) English only; use Title Case or Sentence Case.
<</SYS>>
"""

example_prompt = """
Here are some groups of comments:
Group 0:
- I love the new update!
- The UI is so much better now.

Group 1:
- Why does the app keep crashing?
- It freezes every time I try to upload.

Return the labels as a JSON array, in order.

["Positive Feedback", "App Stability Issues"]
"""

main_prompt = """
Here are  some groups of comments:
{GROUPS}

Return the labels as a JSON array, in order.
"""

# ----- BATCH LABELING HELPER ----- 
def generate_labels_batch(group_texts: List[List[str]]) -> List[str]:
    """
    Batch-label groups of texts using one LLM call.
    Returns a list of labels aligned with the order of group_texts.
    Falls back to 'Subtopic' if parsing fails.
    """
    if not group_texts:
        return []

    # Build GROUPS section with stable order Group 0..N-1
    def fmt_group(i: int, texts: List[str]) -> str:
        # limit to first 25 per group (like your single-cluster helper)
        items = "\n".join(f"- {t}" for t in texts[:25])
        return f"Group {i}:\n{items if items else '- (empty)'}"

    groups_block = "\n\n".join(fmt_group(i, texts) for i, texts in enumerate(group_texts))
    full_prompt = system_prompt + example_prompt + main_prompt.format(GROUPS=groups_block)

    # Call LLM and parse JSON array
    try:
        response = llm.invoke(full_prompt)
        text = getattr(response, "content", None) or str(response)

        # Trim junk if any; try to locate a JSON array
        start = text.find("[")
        end = text.rfind("]")
        if start != -1 and end != -1 and end > start:
            text = text[start:end + 1]

        labels = json.loads(text)

        # Basic validation
        if not isinstance(labels, list) or any(not isinstance(x, str) for x in labels):
            raise ValueError("LLM did not return a JSON array of strings.")
        if len(labels) != len(group_texts):
            # If count mismatch, pad/trim to align
            if len(labels) < len(group_texts):
                labels = labels + ["Subtopic"] * (len(group_texts) - len(labels))
            else:
                labels = labels[:len(group_texts)]
        # Normalize empties
        labels = [lbl.strip() or "Subtopic" for lbl in labels]
        return labels
    except Exception:
        # Total fallback
        return ["Subtopic"] * len(group_texts)


def build_subclusters_umap(
    parent_label: str,
    doc_ids: List[int],               # indices into cleaned_texts for this topic
    umap_coords,
    parent_members: List[str],        # texts for this topic in the same order as doc_ids
) -> List[Dict[str, Any]]:
    """Cluster in UMAP space and return batch-labeled subclusters (no NumPy)."""
    if len(doc_ids) < 2:
        return []

    # Slice UMAP rows we need in local order
    X = [list(umap_coords[i]) for i in doc_ids]

    # ---- HybridClustering runs ONCE here ----
    hybrid_model = HybridClustering(use_hdbscan=False, max_k=5)
    hybrid_model.fit(X)
    labels = hybrid_model.labels_

    # Group local positions by predicted label
    groups: Dict[int, List[int]] = {}
    for pos, lbl in enumerate(labels):
        groups.setdefault(int(lbl), []).append(pos)

    if not groups:
        return []

    # Build a stable index order for batching (Group 0..N-1)
    # Use sorted cluster IDs to keep determinism across runs with same random_state
    sub_ids_sorted = sorted(groups.keys())

    # Prepare texts per group in that order
    group_texts: List[List[str]] = []
    for sub_id in sub_ids_sorted:
        positions = groups[sub_id]
        texts = [parent_members[p] for p in positions]
        group_texts.append(texts)

    # ---- Single LLM call for all labels ----
    batch_labels = generate_labels_batch(group_texts)

    # Assemble subclusters with the returned labels
    subclusters: List[Dict[str, Any]] = []
    for idx, sub_id in enumerate(sub_ids_sorted):
        positions = groups[sub_id]
        texts = [parent_members[p] for p in positions]
        subclusters.append({
            "label": batch_labels[idx],
            "count": len(texts),
            "members": texts,
            "subclusters": []
        })

    # Largest first
    subclusters.sort(key=lambda s: s["count"], reverse=True)
    return subclusters
