import API_ENDPOINTS from '@/configs/apiEndpoints';
import {
  IAbortUploadRequest,
  IAbortUploadResponse,
  ICompleteUploadPart,
  ICompleteUploadRequest,
  ICompleteUploadResponse,
  IDeleteObjectRequest,
  IDeleteObjectResponse,
  INotifyUploadingRequest,
  IPresignedUrlRequest,
  IPresignedUrlResponse,
  IThumbnailPresignedUrlRequest,
  IThumbnailPresignedUrlResponse,
  IUpdateThumbnailRequest,
  IUpdateThumbnailResponse
} from '@/types/upload';
import { IGetVideoStatusResponse, IPublishVideoRequest, IPublishVideoResponse, IUpdateVideoMetadataRequest, IUpdateVideoMetadataResponse, IVideoMetadata } from '@/types/video';
import axios, { AxiosProgressEvent } from 'axios';
import api from './axios';

const videoService = {
  updateVideoMetadata: async (videoId: string, data: IUpdateVideoMetadataRequest): Promise<HttpResponse<IUpdateVideoMetadataResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.updateById(videoId);

      const response = await api.patch(endpoint, data, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to update video metadata');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update video metadata: ${error.message}`);
      } else {
        throw new Error('Failed to update video metadata: An unknown error occurred');
      }
    }
  },

  getVideobyId: async (videoId: string): Promise<HttpResponse<IVideoMetadata>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getById(videoId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to fetch video metadata');
      }
      return response.data;
    }
    catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch video metadata: ${error.message}`);
      } else {
        throw new Error('Failed to fetch video metadata: An unknown error occurred');
      }
    }
  },

  getVideoStatus: async (videoId: string): Promise<HttpResponse<IGetVideoStatusResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getStatusById(videoId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to fetch video status');
      }
      return response.data;
    }
    catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch video status: ${error.message}`);
      } else {
        throw new Error('Failed to fetch video status: An unknown error occurred');
      }
    }
  },

  getMyVideos: async (): Promise<HttpResponse<IVideoMetadata[]>> => {
    try {
      const response = await api.get(API_ENDPOINTS.VIDEO.MY_VIDEOS, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to fetch my videos');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch my videos: ${error.message}`);
      } else {
        throw new Error('Failed to fetch my videos: An unknown error occurred');
      }
    }

  },

  async createThumbnailPresignedUrl(payload: IThumbnailPresignedUrlRequest): Promise<HttpResponse<IThumbnailPresignedUrlResponse>> {
    try {
      const response = await api.post(API_ENDPOINTS.VIDEO.CREATE_THUMBNAIL_PRESIGNED_URL, payload, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to create thumbnail presigned URL');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error creating thumbnail presigned URL:', errorMessage);
      throw new Error(`Failed to create thumbnail presigned URL: ${errorMessage}`);
    }
  },

  async completeThumbnailUpload(
    payload: IUpdateThumbnailRequest
  ): Promise<HttpResponse<IUpdateThumbnailResponse>> {
    try {
      const response = await api.post(API_ENDPOINTS.VIDEO.COMPLETE_THUMBNAIL_UPLOAD, payload, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to complete thumbnail upload');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error completing thumbnail upload:', errorMessage);
      throw new Error(`Failed to complete thumbnail upload: ${errorMessage}`);
    }
  },

  async publishVideo(videoId: string, payload: IPublishVideoRequest): Promise<HttpResponse<IPublishVideoResponse>> {
    try {
      const response = await api.post(API_ENDPOINTS.VIDEO.publishVideo(videoId), payload, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to publish video');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error publishing video:', errorMessage);
      throw new Error(`Failed to publish video: ${errorMessage}`);
    }

  },

  async createPresignedUrl(
    data: IPresignedUrlRequest
  ): Promise<HttpResponse<IPresignedUrlResponse>> {
    try {
      const response = await api.post(API_ENDPOINTS.VIDEO.GET_PRESIGNED_URL, data, { withCredentials: true });
      if (response.status !== 200) {
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

  async notifyUploading(data: INotifyUploadingRequest): Promise<HttpResponse<null>> {
    try {
      const response = await api.post(API_ENDPOINTS.VIDEO.NOTIFY_UPLOADING, data, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to notify uploading');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      throw new Error(`Failed to notify uploading: ${errorMessage}`);
    }
  },

  async completeMultipartUpload(data: ICompleteUploadRequest): Promise<HttpResponse<ICompleteUploadResponse>> {
    try {
      const response = await api.post(API_ENDPOINTS.VIDEO.COMPLETE_UPLOAD, data, {
        withCredentials: true,
      });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to complete multipart upload');
      }
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error completing multipart upload:', errorMessage);
      throw new Error(`Failed to complete multipart upload: ${errorMessage}`);
    }
  },

  async abortMultipartUpload(data: IAbortUploadRequest): Promise<HttpResponse<IAbortUploadResponse>> {
    try {
      const response = await api.post(API_ENDPOINTS.VIDEO.ABORT_UPLOAD, data, { withCredentials: true });
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

  async deleteObject(payload: IDeleteObjectRequest): Promise<HttpResponse<IDeleteObjectResponse>> {
    try {
      const response = await api.post(API_ENDPOINTS.VIDEO.DELETE_VIDEO, payload, { withCredentials: true });
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

  async uploadToS3WithMultipartPresignedUrl(
    file: File,
    multipartResponse: IPresignedUrlResponse,
    onProgress?: (event: AxiosProgressEvent) => void,
    partSize: number = 5 * 1024 * 1024 // 5MB default
  ): Promise<ICompleteUploadPart[]> {
    console.log('Starting multipart upload:', multipartResponse);
    const { presignedUrls, key } = multipartResponse;
    const parts: ICompleteUploadPart[] = [];

    // Gọi notifyUploading trước khi upload lên S3
    try {
      const notifyData: INotifyUploadingRequest = { key };

      await videoService.notifyUploading(notifyData);
      console.log('Notified server about uploading');
    } catch (error) {
      console.error('Failed to notify uploading:', error);
      throw error;
    }

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

export default videoService;
