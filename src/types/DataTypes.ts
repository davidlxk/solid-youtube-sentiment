export interface GetVideoCommentsRequest {

    key: string;
    part: string;
    videoId: string;
}

export interface GetVideoCommentsResponse {

    items: YouTubeVideoComment[];

}

export interface YouTubeVideoComment {

    id: string;
    snippet: YoutubeVideoCommentSnippet;
}

export interface YoutubeVideoCommentSnippet {

    videoId: string;
    topLevelComment: YoutubeVideoTopLevelComment;
}

export interface YoutubeVideoTopLevelComment {

    id: string;
    snippet: YoutubeCommentSnippetDetails;
}

export interface YoutubeCommentSnippetDetails {

    textOriginal: string;
    authorDisplayName: string;
    publishedAt: string;
    updatedAt: string;
}