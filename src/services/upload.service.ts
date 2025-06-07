import API_ENDPOINTS from '@/configs/apiEndpoints';
import {
  IAbortMultipartUpload,
  ICompleteMultipartUploadPart,
  ICompleteMultipartUploadPayload,
  IDeleteObjectPayload,
  IMultipartPresignedUrlResponse,
  IPresignedUrlPayload,
  ISinglePresignedUrlResponse,
} from '@/types/upload';
import axios, { AxiosProgressEvent } from 'axios';
import api from './axios';

/**
 * Service for handling file uploads to S3
 */
const uploadService = {
  /**
   * Creates a presigned URL for uploading a file
   * @param data - Payload containing file details and idToken
   * @returns Presigned URL response
   */
  async createPresignedUrl(
    data: IPresignedUrlPayload
  ): Promise<HttpResponse<ISinglePresignedUrlResponse | IMultipartPresignedUrlResponse>> {
    try {
      const response = await api.post(API_ENDPOINTS.UPLOAD.PRESIGNED_URL, data, { withCredentials: true });
      if (response.status !== 201) {
        throw new Error(`Failed to get presigned URL: ${response.data.message || 'Unknown error'}`);
      }
      console.log('Presigned URL response:', response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error creating presigned URL:', errorMessage);
      throw new Error(`Failed to get presigned URL: ${errorMessage}`);
    }
  },

  /**
   * Completes a multipart upload
   * @param data - Payload containing upload details
   * @returns Null response on success
   */
  async completeMultipartUpload(data: ICompleteMultipartUploadPayload): Promise<HttpResponse<null>> {
    try {
      const response = await api.post(API_ENDPOINTS.UPLOAD.COMPLETE_MULTIPART_UPLOAD, data, {
        withCredentials: true,
      });
      if (response.data.statusCode !== 201) {
        throw new Error(response.data.message || 'Failed to complete multipart upload');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error completing multipart upload:', errorMessage);
      throw new Error(`Failed to complete multipart upload: ${errorMessage}`);
    }
  },

  /**
   * Aborts a multipart upload
   * @param data - Payload containing upload details
   * @returns Null response on success
   */
  async abortMultipartUpload(data: IAbortMultipartUpload): Promise<HttpResponse<null>> {
    try {
      const response = await api.post(API_ENDPOINTS.UPLOAD.ABORT, data, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to abort multipart upload');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error aborting multipart upload:', errorMessage);
      throw new Error(`Failed to abort multipart upload: ${errorMessage}`);
    }
  },

  /**
   * Deletes an object from S3
   * @param payload - Payload containing object key and idToken
   * @returns Null response on success
   */
  async deleteObject(payload: IDeleteObjectPayload): Promise<HttpResponse<null>> {
    try {
      const response = await api.post(API_ENDPOINTS.UPLOAD.DELETE, payload, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to delete object');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error deleting object:', errorMessage);
      throw new Error(`Failed to delete object: ${errorMessage}`);
    }
  },

  /**
   * Uploads a file to S3 using a single presigned URL
   * @param file - File to upload
   * @param presignedUrl - Presigned URL for upload
   * @param onProgress - Progress callback
   * @returns True if upload is successful
   */
  async uploadToS3WithSinglePresignedUrl(
    file: File,
    presignedUrl: string,
    onProgress?: (event: AxiosProgressEvent) => void
  ): Promise<boolean> {
    console.log('Starting upload to S3 with single presigned URL:', presignedUrl);
    console.log('File details:', { name: file.name, type: file.type, size: file.size });

    try {
      const response = await axios.put(presignedUrl, file, {
        headers: {
          // Không gửi Content-Type để tránh SignatureDoesNotMatch
        },
        onUploadProgress: onProgress,
      });
      console.log('S3 upload response:', response.status, response.headers);
      return true;
    } catch (error: any) {
      console.error('Error during upload to S3 with single presigned URL:', error);
      console.error('S3 error details:', error.response?.status, error.response?.data);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      throw new Error(`Failed to upload single file: ${errorMessage}`);
    }
  },

  /**
   * Uploads a file to S3 using multipart presigned URLs
   * @param file - File to upload
   * @param multipartResponse - Multipart presigned URL response
   * @param onProgress - Progress callback
   * @param partSize - Size of each part
   * @returns Array of completed parts
   */
  async uploadToS3WithMultipartPresignedUrl(
    file: File,
    multipartResponse: IMultipartPresignedUrlResponse,
    onProgress?: (event: AxiosProgressEvent) => void,
    partSize: number = 5 * 1024 * 1024 // 5MB default
  ): Promise<ICompleteMultipartUploadPart[]> {
    console.log('Starting multipart upload:', multipartResponse);
    const { presignedUrls } = multipartResponse;
    const parts: ICompleteMultipartUploadPart[] = [];

    await Promise.all(
      presignedUrls.map(async (url, index) => {
        const start = index * partSize;
        const end = Math.min(start + partSize, file.size);
        const partBlob = file.slice(start, end);

        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            console.log(`Uploading part ${index + 1}, attempt ${attempt}`);
            const response = await axios.put(url, partBlob, {
              headers: {
                // Không gửi Content-Type
              },
              onUploadProgress: onProgress,
            });
            if (!response.headers.etag) {
              throw new Error(`ETag missing for part ${index + 1}`);
            }
            console.log(`Part ${index + 1} uploaded successfully`);
            parts.push({
              PartNumber: index + 1,
              ETag: response.headers.etag,
            });
            return;
          } catch (error) {
            console.error(`Error uploading part ${index + 1}, attempt ${attempt}:`, error);
            if (attempt === 3) {
              throw new Error(`Failed to upload part ${index + 1} after 3 attempts`);
            }
            await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
          }
        }
      })
    );

    return parts;
  },
};

export default uploadService;