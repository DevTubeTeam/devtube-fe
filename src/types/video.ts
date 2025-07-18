export enum VidPrivacy {
  PUBLIC = 0,
  PRIVATE = 1,
  UNLISTED = 2,
  UNRECOGNIZED = -1,
}

export enum VidStatus {
  PENDING = 0,
  UPLOADING = 1,
  PROCESSING = 2,
  READY = 3,
  FAILED = 4,
  CANCELLED = 5,
  UNRECOGNIZED = -1,
}

export enum VideoLifecycle {
  DRAFT = 0,
  SCHEDULED = 1,
  PUBLISHED = 2,
  UNRECOGNIZED = -1,
}
export interface IVideoMetadata {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
  resolution: string;
  duration: number;
  privacy: VidPrivacy;
  status: VidStatus;
  transcode_error?: string;
  views: number;
  publishAt: string;
  createdAt: string;
  updatedAt: string;
  lifecycle: VideoLifecycle;
  statusDetail?: string;
}

export interface IUpdateVideoMetadataRequest {
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  privacy?: VidPrivacy;
}

export interface IGetVideoStatusResponse {
  id: string;
  status: VidStatus;
}
export interface IUpdateVideoMetadataResponse {
  id: string;
  updated: boolean;
}

export interface IVideoFile extends File {
  preview?: string;
  id?: string;
  progress?: number;
  status?: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
  s3Key?: string;
  uploadId?: string;
}

export interface IPublishVideoRequest {
  publishAt?: string;
}

export interface IPublishVideoResponse {
  id: string;
  privacy: VidPrivacy;
  publishAt: string;
  status: VidStatus;
}

export interface IGetVideoHomePageResponse {
  videos: IVideoMetadata[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface IGetVideosResponse {
  videos: IVideoMetadata[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface IComment {
  id: string;
  userId: string;
  videoId: string;
  content: string;
  createdAt: string;
}

export interface IUserInfo {
  id: string;
  name: string;
  avatar: string;
}

export interface IGetCommentsResponse {
  comments: IComment[];
  users: IUserInfo[];
}

export interface IGetRelatedVideosResponse {
  videos: IVideoMetadata[];
}


export interface ICreateCommentRequest {
  content: string;
}

export interface ICreateCommentResponse {
  comment: IComment;
}

export interface IPlaylist {
  id: string;
  userId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  videos: IVideoMetadata[];
}


export interface IGetPlaylistsResponse {
  playlists: IPlaylist[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface ICreatePlaylistRequest {
  title: string;
  description: string;
  isPublic: boolean;
}

export interface IGetPlaylistByIdResponse {
  playlist: IPlaylist | undefined;
}

export interface ICreatePlaylistResponse {
  playlistId: string;
}

export interface IUpdatePlaylistRequest {
  title: string;
  description: string;
  isPublic: boolean;
}
export interface IUpdatePlaylistResponse {
  playlistId: string;
}

export interface IDeletePlaylistResponse {
  id: string;
  deleted: boolean;
}

export interface IEditVideoPlaylistRequest {
  videos: IVideoMetadata[];
}

export interface IEditVideoPlaylistResponse {
  playlistId: string;
}

export interface IGetChannelVideosResponse {
  videos: IVideoMetadata[];
  totalCount: number;
}

export interface IGetChannelPlaylistsResponse {
  playlists: IPlaylist[];
  totalCount: number;
}

// Like video

export interface ILikeVideoResponse {
  id: string;
  liked: boolean;
}

export interface IUnlikeVideoResponse {
  id: string;
  unliked: boolean;
}

export interface IGetVideoLikesCountResponse {
  likesCount: number;
}

export interface IGetLikedVideosResponse {
  videos: IVideoMetadata[];
}

export interface IIsLikedVideoResponse {
  isLiked: boolean;
}

// Saved video

export interface ISavedVideoResponse {
  id: string;
  saved: boolean;
}

export interface IUnsavedVideoResponse {
  id: string;
  unsaved: boolean;
}

export interface IGetSavedVideosResponse {
  videos: IVideoMetadata[];
}

export interface IIsSavedVideoResponse {
  isSaved: boolean;
}

// Watch later

export interface IAddVideoToWatchLaterResponse {
  id: string;
  added: boolean;
}

export interface IRemoveVideoFromWatchLaterResponse {
  id: string;
  removed: boolean;
}

export interface IGetWatchLaterVideosResponse {
  videos: IVideoMetadata[];
}

export interface IIsVideoInWatchLaterResponse {
  isInWatchLater: boolean;
}

