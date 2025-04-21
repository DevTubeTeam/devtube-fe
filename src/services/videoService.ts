import api from '@/services/axios';
import { PresignedUrlResponse, VideoMetadata } from '@/types/video';

/**
 * Request a pre-signed URL from the backend for direct upload to S3
 */
export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  fileSize: number,
): Promise<PresignedUrlResponse> => {
  try {
    const response = await api.post(`/videos/presigned-url`, {
      fileName,
      fileType,
      fileSize,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    throw error;
  }
};

/**
 * Upload a video file directly to S3 using a pre-signed URL
 * @param file The video file to upload
 * @param presignedUrl The pre-signed URL from the server
 * @param onProgress Progress callback function
 */
export const uploadToS3WithPresignedUrl = async (
  file: File,
  presignedUrl: string,
  onProgress?: (progress: number) => void,
): Promise<boolean> => {
  try {
    await api.put(presignedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
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

/**
 * Save video metadata to the backend after successful upload
 */
export const saveVideoMetadata = async (
  metadata: VideoMetadata,
  s3Key: string,
): Promise<any> => {
  try {
    const response = await api.post(`/videos`, {
      ...metadata,
      s3Key,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving video metadata:', error);
    throw error;
  }
};
