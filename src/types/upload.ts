
export interface UploadVideoResponse {
  success: boolean;
  videoUrl: string;
  message?: string;
}

export interface IThumbnailPresignedUrlRequest {
  videoId: string;
  fileName: string;
  fileType: string;
}

export interface IThumbnailPresignedUrlResponse {
  presignedUrl: string;
  key: string;
  bucketName: string;
}

export interface IUpdateThumbnailRequest {
  videoId: string;
  thumbnailUrl: string;
}

export interface IUpdateThumbnailResponse {
  id: string;
  thumbnailUrl: string;
}

export interface IPresignedUrlRequest {
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface IPresignedUrlResponse {
  uploadId: string;
  key: string;
  bucketName: string;
  presignedUrls: string[];
}

export interface INotifyUploadingRequest {
  key: string;
}

export interface IAbortUploadRequest {
  key: string;
  uploadId: string;
}
export interface IAbortUploadResponse {
  key: string;
  aborted: boolean;
}

export interface IDeleteObjectRequest {
  videoId: string;
}

export interface IDeleteObjectResponse {
  id: string;
  deleted: boolean;
}

export interface ICompleteUploadPart {
  PartNumber: number;
  ETag: string;
}

export interface ICompleteUploadRequest {
  key: string;
  uploadId: string;
  parts: ICompleteUploadPart[];
}

export interface ICompleteUploadResponse {
  location: string;
  key: string;
}
