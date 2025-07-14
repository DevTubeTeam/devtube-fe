import videoService from "@/services/video.service";
import {
  IAbortUploadRequest,
  ICompleteUploadRequest,
  IPresignedUrlRequest,
  IPresignedUrlResponse,
  IThumbnailPresignedUrlRequest,
  IThumbnailPresignedUrlResponse,
  IUpdateThumbnailRequest
} from "@/types/upload";
import { IGetVideoStatusResponse, IUpdateVideoMetadataRequest, IVideoFile, VidPrivacy, VidStatus } from "@/types/video";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";

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
  const { onProgress } = options;

  const queryClient = useQueryClient();

  // Extract video ID from S3 key
  function extractVideoId(key: string): string {
    return key.split('/').pop() || '';
  }

  // Mutation: Upload video
  const uploadVideo = () => {
    return useMutation({
      mutationFn: async (params: UploadParams & { onPresigned?: (data: IPresignedUrlResponse) => void }): Promise<UploadResult> => {
        const { file, onPresigned } = params;
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
          if (onPresigned) onPresigned(presignedData); // Gọi callback ở đây
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
          return {
            videoFile: file,
            videoId,
            uploadedUrl: presignedData.key
          };
        } catch (error) {
          file.status = 'error';
          file.progress = 0;
          file.error = error instanceof Error ? error.message : 'Upload failed';
          console.error(error);
          throw error;
        }
      },
      onSuccess: (_) => {
        queryClient.invalidateQueries({ queryKey: ['myVideos'] });
      },
      onError: (error: any, _) => {
        throw error;
      }
    });
  }
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
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myVideos'] });
    },
    onError: (error: any, videoFile: IVideoFile) => {
      throw error;
    }
  });

  const updateVideoMetadata = useMutation({
    mutationFn: async ({
      videoId,
      metadata,
      thumbnail,
    }: {
      videoId: string;
      metadata: {
        title: string;
        description: string;
        category: string;
        tags: string[];
        privacy: VidPrivacy;
      };
      thumbnail?: File;
    }) => {
      try {
        // First update metadata
        const requestData: IUpdateVideoMetadataRequest = {
          title: metadata.title,
          description: metadata.description,
          category: metadata.category,
          tags: metadata.tags,
          privacy: metadata.privacy
        };

        const response = await videoService.updateVideoMetadata(videoId, requestData);

        // Then upload thumbnail if provided
        if (thumbnail) {
          const thumbnailUrl = await uploadThumbnail(videoId, thumbnail);
          // Update thumbnail URL
          await videoService.completeThumbnailUpload({
            videoId,
            thumbnailUrl
          });
        }

        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update metadata';
        toast.error(`Failed to update video details: ${errorMessage}`);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Video details updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['myVideos'] });
    },
  });


  const uploadThumbnail = async (videoId: string, thumbnail: File): Promise<string> => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(thumbnail.type)) {
      throw new Error('Unsupported thumbnail format. Please upload JPEG, PNG, or GIF files.');
    }
    if (thumbnail.size > 5 * 1024 * 1024) {
      throw new Error('Thumbnail size exceeds 5MB limit.');
    }

    try {
      // 1. Lấy presigned URL
      const presignedRequest: IThumbnailPresignedUrlRequest = {
        videoId,
        fileName: thumbnail.name,
        fileType: thumbnail.type,
        fileSize: thumbnail.size
      };
      const presignedResponse = await videoService.createThumbnailPresignedUrl(presignedRequest);
      const presignedData: IThumbnailPresignedUrlResponse = presignedResponse.data;

      if (!presignedData.presignedUrl) {
        throw new Error('No presigned URL received for thumbnail.');
      }

      // 2. Upload thumbnail lên S3
      await axios.put(presignedData.presignedUrl, thumbnail, {
        headers: { 'Content-Type': thumbnail.type }
      });

      // 3. Complete thumbnail upload
      const updateThumbnailRequest: IUpdateThumbnailRequest = {
        videoId,
        thumbnailUrl: presignedData.key
      };
      await videoService.completeThumbnailUpload(updateThumbnailRequest);

      return presignedData.key;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload thumbnail');
    }
  };

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

  // Mutation: Publish video
  // const publishVideo = useMutation({
  //   mutationFn: async ({ videoId, publishAt }: { videoId: string; publishAt?: string }): Promise<IPublishVideoResponse> => {
  //     if (!videoId) throw new Error('Video ID is required');
  //     const publishRequest: IPublishVideoRequest = { publishAt };
  //     const response = await videoService.publishVideo(videoId, publishRequest);
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['myVideos'] });
  //   }
  // });

  return {
    uploadVideo,
    cancelUpload,
    updateVideoMetadata,
    useVideoStatus,
    useGetVideoById,
  };
}