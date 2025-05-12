import { IVideoFile } from "./video";

export interface UploadVideoResponse {
  success: boolean;
  videoUrl: string;
  message?: string;
}

export interface UploadVideoParams {
  file: File;
  // metadata: VideoMetadata;
  onProgress?: (progress: number) => void;
}

export interface IPresignedUrlRequest {
  idToken: string;
  fileName: string;
  fileType: string;
}


export interface ISinglePresignedUrlResponse {
  presignedUrl: string;
  key: string;
  bucketName: string;
}

export interface IMultipartPresignedUrlResponse {
  uploadId: string;
  key: string;
  bucketName: string;
  presignedUrls: string[];
}


export interface IAbortMultipartUpload {
  key: string;
  uploadId: string;
  idToken: string;
}

export interface IDeleteObjectPayload {
  key: string;
  idToken: string;
}

export interface IPresignedUrlPayload {
  fileName: string;
  fileType: string;
  idToken: string;
  fileSize: number;
  userId: string;
}

export interface ICompleteMultipartUploadPart {
  PartNumber: number;
  ETag: string;
}

export interface ICompleteMultipartUploadPayload {
  key: string;
  uploadId: string;
  parts: ICompleteMultipartUploadPart[];
  idToken: string;
}

export interface UploadParams {
  file: IVideoFile;
  idToken: string;
}

export interface UploadResult {
  videoFile: IVideoFile;
}

export interface UploadOptions {
  onProgress?: (progress: number) => void;
}

export interface UploadStep {
  label: string;
  index: number;
}