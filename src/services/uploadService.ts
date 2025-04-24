import { PresignedUrlRequest, PresignedUrlResponse } from '@/types/video';
import axios from 'axios';
import { api } from './axios';

export const getPresignedUrl = async (data: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
  try {
    const response = await api.post('/videos/presigned-url', data);
    return response.data;
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw error;
  }
};

export const uploadToS3WithPresignedUrl = async (
  file: File,
  presignedUrl: string,
  onProgress?: (progress: number) => void,
): Promise<boolean> => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return true;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};
