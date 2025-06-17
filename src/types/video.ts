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