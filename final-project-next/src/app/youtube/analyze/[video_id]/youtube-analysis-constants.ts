import { type TransformedComment } from "@/app/api/youtube/comments/actions";

const DEFAULT_CREATOR_PREFERENCES =
  "personal, relevant to the video's message, demonstrate effort, and spark engagement";

export const TASK_NAMES = {
  KEY_TAKEAWAYS: "key_takeaways",
  RECOMMENDATIONS: "recommendations",
  NOTICEABLE_THREADS: "noticeable_threads",
  SEARCH: "search",
  DEEP_DIVE: "deep_dive",
  CLUSTER_BIG: "cluster_big",
  CLUSTER_SMALL: "cluster_small",
  CLUSTER_HIERARCHICAL: "cluster_hierarchical",
} as const;

const KEY_TAKEAWAYS_INSTRUCTIONS = `
Provide a concise summary of the YouTube video's main theme and the overall sentiment expressed in the comments section.
Highlight key insights and noteworthy observations.
Respond in Json format - {summary:string , takeaways: string[]}. 
`;

const RECOMMENDED_COMMENTS_INSTRUCTIONS = `
Recommend 3 distinct comments for the creator to read, prioritizing those that align with their stated preferences: ${DEFAULT_CREATOR_PREFERENCES}.
Ensure you do not recommend the same comment twice across multiple requests for recommendations. 
Respond in json format - { displayText: string, authorDisplayName: string, authorProfileImageUrl: string, authorChannelUrl: string, likeCount: number, updatedAt: string, totalReplyCount: number, replies: comment[] }[].
`;

const NOTICEABLE_THREADS_INSTRUCTIONS = `
Identify 3 noteworthy comment threads.
Prioritize threads that are personal related to the video's core message,involve in-depth discussion, demonstrate significant effort, or have high engagement (likes and replies).
All threads should be at list 2 comments long, from 2 different users (must have totalReplyCount >=2 ), if this is not met, provide less than 3 threads.
Provide a short summary of each conversation. 
Respond in json format - {comment: comment, summary: string, topic: string, totalReplyCount: number}[]
`;

const SEARCH_COMMENTS_INSTRUCTIONS = `
Search the comments for all comments that might be relevant in any way to query given.
Focus on relevance to the query's meaning, not just keyword matching for example if the quey was family, i would like to see all the comments that are related to family members.
Respond in json format - comment[]
`;

const DEEPER_DIVE_INSTRUCTIONS = `
Answer a specific question about the comments section.
Respond in a detailed yet concise, insightful manner.
Respond in a plain text format. 
`;

const COMMENTS_CLUSTERING_INSTRUCTIONS = `
Cluster the comments based on topic/theme.

For each clustering, provide a list of group names/labels and the number of comments in each group.

You must perform recursive hierarchical clustering:
- Each cluster should contain:
  - label: a descriptive name of the theme
  - count: total number of comments in this cluster
  - examples: 2–3 representative comment strings
  - subClusters: an array of child clusters in the same format

Each subCluster must follow the same structure and may include additional subClusters as needed, recursively. Continue drilling down until no meaningful subdivisions remain.

Respond in JSON format:

{ 
  label: string, 
  count: number, 
  examples: string[], 
  subClusters?: ClusterResult[] // For hierarchical clustering
}[]
`;

//TODO: add a generic way to convert all comments to a unified format (compact for gemini)
export const DEFAULT_CREATOR_ID = "Default_Creator_Id";

async function getCreatorPreferences(creatorId: string) {
  return await new Promise<string>((resolve) => {
    if (creatorId === DEFAULT_CREATOR_ID) {
      return resolve(DEFAULT_CREATOR_PREFERENCES);
    }
    //TODO: fetch creator preferences from the database
    return resolve(DEFAULT_CREATOR_PREFERENCES);
  });
}

export async function generateSystemInstructions(
  videoComments: TransformedComment[],
  videoUrl: string,
  creatorId: string = DEFAULT_CREATOR_ID
) {
  const creatorPreferences = await getCreatorPreferences(creatorId);

  return `You are a YouTube video comment analyst analyzing ${videoUrl}. 
     Your task is to provide insightful analysis based on the comments provided below.
     Focus on identifying key themes, user sentiment, and meaningful discussions.
     Prioritize comments that ${creatorPreferences}. 

     Here are the comments for this video:
    \`\`\`json
    ${JSON.stringify(videoComments)}
    \`\`\`

    When given a task, follow these instructions:

    Task Names:
    \`\`\`json
    ${JSON.stringify(TASK_NAMES, null, 2)}
    \`\`\`

    Task Instructions:
    *   \`${TASK_NAMES.KEY_TAKEAWAYS}\`: ${KEY_TAKEAWAYS_INSTRUCTIONS}
    *   \`${TASK_NAMES.RECOMMENDATIONS}\`: ${RECOMMENDED_COMMENTS_INSTRUCTIONS}
    *   \`${TASK_NAMES.NOTICEABLE_THREADS}\`: ${NOTICEABLE_THREADS_INSTRUCTIONS}
    *   \`${TASK_NAMES.SEARCH}\`: ${SEARCH_COMMENTS_INSTRUCTIONS}
    *   \`${TASK_NAMES.DEEP_DIVE}\`: ${DEEPER_DIVE_INSTRUCTIONS}
    *   \`${
      TASK_NAMES.CLUSTER_BIG
    }\`: ${COMMENTS_CLUSTERING_INSTRUCTIONS} (3-10 groups)
        *   \`${
          TASK_NAMES.CLUSTER_SMALL
        }\`: ${COMMENTS_CLUSTERING_INSTRUCTIONS} (10-25 groups)
        *   \`${
          TASK_NAMES.CLUSTER_HIERARCHICAL
        }\`: ${COMMENTS_CLUSTERING_INSTRUCTIONS} (hierarchical)
    
    Respond in JSON format where applicable.
    `;
}
