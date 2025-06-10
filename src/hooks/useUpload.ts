import videoService from "@/services/video.service";
import {
  IAbortUploadRequest,
  ICompleteUploadRequest,
  IDeleteObjectRequest,
  IPresignedUrlRequest,
  IPresignedUrlResponse,
  IThumbnailPresignedUrlRequest,
  IThumbnailPresignedUrlResponse,
  IUpdateThumbnailRequest,
  IUpdateThumbnailResponse
} from "@/types/upload";
import { IGetVideoStatusResponse, IPublishVideoRequest, IPublishVideoResponse, IUpdateVideoMetadataRequest, IVideoFile, VidStatus } from "@/types/video";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosProgressEvent } from "axios";

export interface UploadOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error, file: IVideoFile) => void;
  onStatusChange?: (status: VideoProcessingStatus, videoId: string) => void;
}

export interface UploadResult {
  videoFile: IVideoFile;
  videoId: string;
  uploadedUrl: string;
}

export interface UploadParams {
  file: IVideoFile;
  metadata?: IUpdateVideoMetadataRequest;
}

export type VideoProcessingStatus = 'pending' | 'uploading' | 'processing' | 'ready' | 'failed' | 'cancelled';

/**
 * Custom hook for handling video uploads with proper state management
 * Supports the full upload flow:
 * 1. Get presigned URLs
 * 2. Upload file to S3 with multipart upload
 * 3. Complete multipart upload
 * 4. Track video processing status
 */
export function useUpload(options: UploadOptions = {}) {
  const { onProgress, onSuccess, onError, onStatusChange } = options;

  const queryClient = useQueryClient();

  // Extract video ID from S3 key
  function extractVideoId(key: string): string {
    return key.split('/').pop() || '';
  }

  // Mutation: Upload video
  const uploadVideo = useMutation({
    mutationFn: async (params: UploadParams): Promise<UploadResult> => {
      const { file } = params;
      if (!file) throw new Error('File is required for upload');
      const validTypes = [
        'video/mp4',
        'video/quicktime',
        'video/webm',
        'video/x-msvideo',
        'video/x-matroska'
      ];
      if (!validTypes.includes(file.type)) {
        throw new Error('Unsupported video format. Please upload MP4, MOV, AVI, WebM or MKV files.');
      }
      try {
        file.status = 'uploading';
        file.progress = 0;
        onStatusChange?.('uploading', '');
        const presignedUrlRequest: IPresignedUrlRequest = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        };
        const presignedResponse = await videoService.createPresignedUrl(presignedUrlRequest);
        const presignedData: IPresignedUrlResponse = presignedResponse.data;
        if (!presignedData) throw new Error('Failed to get presigned URLs');
        file.s3Key = presignedData.key;
        file.uploadId = presignedData.uploadId;
        const parts = await videoService.uploadToS3WithMultipartPresignedUrl(
          file,
          presignedData,
          (event: AxiosProgressEvent) => {
            if (event.total) {
              const progress = Math.round((event.loaded * 100) / event.total);
              file.progress = progress;
              onProgress?.(progress);
            }
          }
        );
        const completeRequest: ICompleteUploadRequest = {
          key: presignedData.key,
          uploadId: presignedData.uploadId,
          parts
        };
        const completeRes = await videoService.completeMultipartUpload(completeRequest);


        const videoId = extractVideoId(completeRes.data.key);
        file.status = 'success';
        file.progress = 100;
        onStatusChange?.('processing', videoId);
        return {
          videoFile: file,
          videoId,
          uploadedUrl: presignedData.key
        };
      } catch (error) {
        file.status = 'error';
        file.progress = 0;
        file.error = error instanceof Error ? error.message : 'Upload failed';
        onStatusChange?.('failed', file.s3Key ? extractVideoId(file.s3Key) : '');
        if (onError && error instanceof Error) onError(error, file);
        throw error;
      }
    },
    onSuccess: (data) => {
      onSuccess?.(data);
      queryClient.invalidateQueries({ queryKey: ['myVideos'] });
    },
    onError: (error: any, variables: UploadParams) => {
      if (onError && error instanceof Error) onError(error, variables.file);
    }
  });

  // Mutation: Cancel upload
  const cancelUpload = useMutation({
    mutationFn: async (videoFile: IVideoFile) => {
      if (!videoFile.s3Key || !videoFile.uploadId) throw new Error('Missing upload information');
      const abortRequest: IAbortUploadRequest = {
        key: videoFile.s3Key,
        uploadId: videoFile.uploadId
      };
      await videoService.abortMultipartUpload(abortRequest);
      videoFile.status = 'error';
      videoFile.error = 'Upload cancelled';
      videoFile.progress = 0;
      onStatusChange?.('cancelled', extractVideoId(videoFile.s3Key));
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVideos'] });
    },
    onError: (error: any, videoFile: IVideoFile) => {
      if (onError && error instanceof Error) onError(error, videoFile);
    }
  });

  // Mutation: Delete video
  const deleteVideo = useMutation({
    mutationFn: async (videoId: string) => {
      if (!videoId) throw new Error('Missing video ID');
      const deleteRequest: IDeleteObjectRequest = { videoId };
      await videoService.deleteObject(deleteRequest);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVideos'] });
    }
  });

  // Mutation: Update video metadata
  const updateVideoMetadata = useMutation({
    mutationFn: async ({ videoId, metadata }: { videoId: string; metadata: IUpdateVideoMetadataRequest }) => {
      if (!videoId) throw new Error('Video ID is required');
      return await videoService.updateVideoMetadata(videoId, metadata);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVideos'] });
    }
  });

  // Query: Get video status (polling)
  function useVideoStatus(videoId: string, enabled = false, pollingInterval = 5000) {
    return useQuery<IGetVideoStatusResponse>({
      queryKey: ['videoStatus', videoId],
      queryFn: async () => {
        if (!videoId) throw new Error('Video ID is required');
        const response = await videoService.getVideoStatus(videoId);
        // Map VidStatus to VideoProcessingStatus
        let newStatus: VideoProcessingStatus;
        switch (response.data.status) {
          case VidStatus.PENDING: newStatus = 'pending'; break;
          case VidStatus.UPLOADING: newStatus = 'uploading'; break;
          case VidStatus.PROCESSING: newStatus = 'processing'; break;
          case VidStatus.READY: newStatus = 'ready'; break;
          case VidStatus.FAILED: newStatus = 'failed'; break;
          case VidStatus.CANCELLED: newStatus = 'cancelled'; break;
          default: newStatus = 'failed';
        }
        onStatusChange?.(newStatus, videoId);
        return response.data;
      },
      enabled: enabled && !!videoId,
      refetchInterval: enabled && !!videoId ? pollingInterval : false,
      refetchIntervalInBackground: false,
      staleTime: 0
    });
  }

  // Query: Get video by ID
  function useGetVideoById(videoId: string, enabled = false) {
    return useQuery({
      queryKey: ['videoById', videoId],
      queryFn: async () => {
        if (!videoId) throw new Error('Video ID is required');
        return await videoService.getVideobyId(videoId);
      },
      enabled: enabled && !!videoId
    });
  }

  // Mutation: Upload thumbnail
  const uploadThumbnail = useMutation({
    mutationFn: async ({ videoId, thumbnail }: { videoId: string; thumbnail: File }): Promise<IUpdateThumbnailResponse> => {
      if (!videoId) throw new Error('Video ID is required');
      if (!thumbnail) throw new Error('Thumbnail file is required');
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(thumbnail.type)) {
        throw new Error('Unsupported thumbnail format. Please upload JPEG, PNG, or GIF files.');
      }
      if (thumbnail.size > 5 * 1024 * 1024) {
        throw new Error('Thumbnail size exceeds 5MB limit.');
      }

      try {
        const presignedRequest: IThumbnailPresignedUrlRequest = {
          videoId,
          fileName: thumbnail.name,
          fileType: thumbnail.type
        };
        const presignedResponse = await videoService.createThumbnailPresignedUrl(presignedRequest);
        const presignedData: IThumbnailPresignedUrlResponse = presignedResponse.data;
        if (!presignedData.presignedUrl) {
          throw new Error('No presigned URL received for thumbnail.');
        }

        await axios.put(presignedData.presignedUrl, thumbnail, {
          headers: { 'Content-Type': thumbnail.type }
        });

        const updateRequest: IUpdateThumbnailRequest = {
          videoId,
          thumbnailUrl: presignedData.key
        };
        const updateResponse = await videoService.completeThumbnailUpload(updateRequest);
        return updateResponse.data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to upload thumbnail');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVideos'] });
    }
  });

  // Mutation: Publish video
  const publishVideo = useMutation({
    mutationFn: async ({ videoId, publishAt }: { videoId: string; publishAt?: string }): Promise<IPublishVideoResponse> => {
      if (!videoId) throw new Error('Video ID is required');
      const publishRequest: IPublishVideoRequest = { publishAt };
      const response = await videoService.publishVideo(videoId, publishRequest);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVideos'] });
    }
  });

  return {
    uploadVideo,
    cancelUpload,
    deleteVideo,
    updateVideoMetadata,
    useVideoStatus,
    useGetVideoById,
    uploadThumbnail,
    publishVideo
  };
}