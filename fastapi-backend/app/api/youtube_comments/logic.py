from googleapiclient.discovery import build
from typing import List, Dict, Any, cast
from .models import (
    TransformedComment,
    YoutubeComment,
    YoutubeCommentThread,
    YoutubeCommentSnippet,
    YoutubeCommentThreadSnippet
)
from ...clients.youtube_client import youtube
from ...utils.save_array_to_csv import save_array_to_csv
from googleapiclient import errors

YOUTUBE_DEFAULT_COMMENTS_LIMIT = 200


def transform_comment(item: YoutubeCommentSnippet, total_reply_count: int = 0) -> TransformedComment:
    """Transforms a raw comment snippet into a TransformedComment."""
    return TransformedComment(
        displayText=item["textDisplay"],
        authorDisplayName=item["authorDisplayName"],
        authorProfileImageUrl=item["authorProfileImageUrl"],
        authorChannelUrl=item["authorChannelUrl"],
        likeCount=item["likeCount"],
        updatedAt=item["updatedAt"],
        totalReplyCount=total_reply_count,
        replies=[]
    )
    

async def fetch_replies_batched(comment_ids: List[str]) -> Dict[str, List[TransformedComment]]:
    """Fetches replies for multiple comment IDs in batches."""
    all_replies: Dict[str, List[TransformedComment]] = {}
    
    batch_size = 50
    for i in range(0, len(comment_ids), batch_size):
        batch_ids = comment_ids[i:i + batch_size]
        
        for comment_id in batch_ids:
            try:
                next_page_token = None
                all_replies[comment_id] = []
                
                while True:
                    response = youtube.comments().list(
                        part=["snippet"],
                        parentId=comment_id,
                        maxResults=100,
                        pageToken=next_page_token,
                        textFormat="plainText"
                    ).execute()

                    if response.get("items"):
                        comments = cast(List[YoutubeComment], response["items"])
                        for comment in comments:
                            all_replies[comment_id].append(transform_comment(comment["snippet"]))                    
                    next_page_token = response.get("nextPageToken")
                    if not next_page_token:
                        break
                        
            except errors.HttpError as e:
                print(f"Error fetching replies for comment {comment_id}: {e}")
                continue

    return all_replies

async def get_video_comments_logic(video_id: str, limit: int = YOUTUBE_DEFAULT_COMMENTS_LIMIT) -> Dict[str, Any]:
    """Fetches and processes comments for a given video ID with batched reply fetching."""
    all_comments: List[TransformedComment] = []
    next_page_token: str | None = None

    try:
        while len(all_comments) < limit:
            response = youtube.commentThreads().list(
                part=["snippet"],
                videoId=video_id,
                maxResults=min(limit - len(all_comments), 100),  
                pageToken=next_page_token,
                textFormat="plainText",
            ).execute()

            if not response.get("items"):
                break

            comment_threads = cast(List[YoutubeCommentThread], response["items"])
            comment_ids = [thread["snippet"]["topLevelComment"]["id"] for thread in comment_threads]
            
            replies_by_comment_id = await fetch_replies_batched(comment_ids)
           
            transformed_comments = []
            for thread in comment_threads:
                thread_snippet = cast(YoutubeCommentThreadSnippet, thread["snippet"])
                top_level_comment = thread_snippet["topLevelComment"]
                comment_id = top_level_comment["id"]
                transformed_comment = transform_comment(
                    top_level_comment["snippet"],
                    thread_snippet["totalReplyCount"],
                )
                transformed_comment.replies = replies_by_comment_id.get(comment_id, [])
                transformed_comments.append(transformed_comment)

            all_comments.extend(transformed_comments)
            next_page_token = response.get("nextPageToken")

            if not next_page_token:
                break

        return {"comments": all_comments[:limit], "commentsCount": len(all_comments)}
    except Exception as e:
        print(f"Error fetching comments from Google API: {e}")
        raise e


async def create_youtube_comments_dataset(video_id: str, limit: int, dataset_name: str) -> str:
    """
    Creates a dataset of YouTube comments for a given video ID and saves it to a CSV file.
    
    Args:
        video_id: YouTube video ID
        limit: Maximum number of comments to retrieve
        dataset_name: Name of the dataset to save
        
    Returns:
        A message indicating where the dataset was saved
    """
    comments_data = await get_video_comments_logic(video_id, limit)
    comments = comments_data["comments"]

    csv_data = [
        {
            "text": comment.displayText,
            "author": comment.authorDisplayName,
            "likes": comment.likeCount,
            "replyCount": comment.totalReplyCount,
        }
        for comment in comments
    ]

    save_path = save_array_to_csv(csv_data, f'{dataset_name}_{limit}')
    return save_path
