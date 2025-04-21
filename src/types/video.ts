export interface VideoMetadata {
  title: string;
  description: string;
  fileSize: number;
  duration?: number;
  fileName: string;
  fileType: string;
  thumbnail?: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  bucket: string;
}

export interface VideoFile extends File {
  preview?: string;
  id?: string;
  progress?: number;
  status?: 'uploading' | 'success' | 'error';
  error?: string;
  s3Key?: string;
}
