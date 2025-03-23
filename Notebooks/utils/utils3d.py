import pandas as pd
import umap
from typing import List, Union, Optional
import numpy as np
import plotly.graph_objects as go
import textwrap

def get_3d_fig(embeddings: Union[np.ndarray, List[List[float]]], comments: List[str], labels: List[int]):
    trace = _get_trace(embeddings, comments, labels)
    layout = _get_layout()
    return go.Figure(data=[trace], layout=layout)


def _create_umap_3d_dataframe(
    embeddings: Union[np.ndarray, List[List[float]]],
    n_neighbors: int = 12,
    min_dist: float = 0.5,
    spread: float = 1.0,
    low_memory: bool = False,
    n_epochs: int = 8000,
    learning_rate: float = 0.5,
    metric: str = 'cosine'
) -> pd.DataFrame:

    umap_3d_embeddings = umap.UMAP(
        n_neighbors=n_neighbors,
        n_components=3,
        min_dist=min_dist,
        spread=spread,
        low_memory=low_memory,
        n_epochs=n_epochs,
        learning_rate=learning_rate,
        metric=metric
    ).fit_transform(embeddings)

    return pd.DataFrame(umap_3d_embeddings, columns=['x', 'y', 'z'])

def _get_layout():
    axis = dict(
    showbackground=False,
    showline=False,
    zeroline=False,
    showgrid=False,
    showticklabels=False,
    showspikes=False,
    title='')

    layout = go.Layout(
    height=550,
    width=1270,
    margin=dict(
        l=0,
        r=0,
        b=0,
        t=0
    ),
    hovermode='closest',
    legend=dict(x=0.01, y=0.98),
    scene=dict(
        xaxis=dict(axis),
        yaxis=dict(axis),
        zaxis=dict(axis)
    ))

    return layout


def _get_trace(embeddings: Union[np.ndarray, List[List[float]]], comments: List[str], labels: List[int]) -> go.Scatter3d:
    result3d = _create_umap_3d_dataframe(embeddings)
    line_break_comments = _add_line_breaks_list(comments)

    trace = go.Scatter3d(
    x=result3d.x,
    y=result3d.y,
    z=result3d.z,
    mode='text+markers',
    text=labels,
    textfont=dict(size=9, family="Arial", color='rgba(128, 128, 128, 0.0)'),
    hoverinfo='text',
    hovertext=line_break_comments,
    name='BERT sentence embedding with sentences in hover',
    textposition='middle right',
    marker=dict(
        symbol='circle',
        opacity=1.0,
        sizemin=10,
        sizeref=1400,
        sizemode='diameter',
        color=np.array(labels),
        colorscale=[
            [0, "rgb(26,30,178)"],
            [0.25, "rgb(156,1,242)"],
            [0.45, "rgb(255,116,0)"],
            [0.65, "rgb(255,229,0)"],
            [0.85, "rgb(0,204,0)"],
            [1, "rgb(0,240,248)"]
        ],
        showscale=True,
        colorbar=dict(  # Add colorbar settings here
            title="Cluster",
            thicknessmode="pixels", thickness=12,
            lenmode="pixels", len=400,
            x=1.0, xanchor='right', xpad=5,
            yanchor="top", y=0.8,
            ypad=2, ticks="inside", ticksuffix="", dtick=1
        )
    ),
    showlegend=True,
    hovertemplate='%{hovertext}<extra></extra>')
    
    return trace


def _add_line_breaks_list(filtered_comments: List[str], wrap_width: int = 50) -> List[str]:
    modified_comments = []

    for comment in filtered_comments:
        if len(comment) > wrap_width:
            wrapped_comment = textwrap.fill(comment, width=wrap_width)
            modified_comments.append(wrapped_comment.replace('\n', '<br>'))
        else:
            modified_comments.append(comment)

    return modified_comments