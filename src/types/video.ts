export interface IVideoMetadata {
  title: string;
  description: string;
  fileSize: number;
  duration?: number;
  fileName: string;
  fileType: string;
  thumbnail?: string;
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