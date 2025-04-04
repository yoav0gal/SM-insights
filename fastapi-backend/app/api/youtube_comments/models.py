from typing import List, Optional, TypedDict, Literal
from pydantic import BaseModel
from datetime import datetime

class AuthorChannelId(TypedDict):
    value: str

class YoutubeCommentSnippet(TypedDict):
    authorDisplayName: str
    authorProfileImageUrl: str
    authorChannelUrl: str
    authorChannelId: AuthorChannelId
    channelId: str
    textDisplay: str
    textOriginal: str
    parentId: Optional[str]
    canRate: bool
    viewerRating: Literal['like', 'none']
    likeCount: int
    moderationStatus: Optional[Literal['heldForReview', 'likelySpam', 'published', 'rejected']]
    publishedAt: str
    updatedAt: str

class YoutubeComment(TypedDict):
    kind: Literal['youtube#comment']
    etag: str
    id: str
    snippet: YoutubeCommentSnippet

class YoutubeCommentThreadSnippet(TypedDict):
    channelId: str
    videoId: str
    topLevelComment: YoutubeComment
    canReply: bool
    totalReplyCount: int
    isPublic: bool

class YoutubeCommentThread(TypedDict):
    kind: Literal['youtube#commentThread']
    etag: str
    id: str
    snippet: YoutubeCommentThreadSnippet
    replies: Optional[dict[Literal['comments'], List[YoutubeComment]]] = None


class RawCommentSnippet(TypedDict):
    authorDisplayName: str
    authorProfileImageUrl: str
    authorChannelUrl: str
    textDisplay: str
    likeCount: int
    updatedAt: str

class RawComment(TypedDict):
    snippet: dict
    totalReplyCount: int

class RawReply(TypedDict):
    snippet: RawCommentSnippet

class TransformedComment(BaseModel):
    displayText: str
    authorDisplayName: str
    authorProfileImageUrl: str
    authorChannelUrl: str
    likeCount: int
    updatedAt: str
    totalReplyCount: int
    replies: Optional[List['TransformedComment']] = []

TransformedComment.update_forward_refs()