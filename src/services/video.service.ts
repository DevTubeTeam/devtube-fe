import API_ENDPOINTS from '@/configs/apiEndpoints';
import {
  IAbortUploadRequest,
  IAbortUploadResponse,
  ICheckThumbnailRequest,
  ICheckThumbnailResponse,
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
import {
  // Watch later interfaces
  IAddVideoToWatchLaterResponse,
  ICreateCommentRequest,
  ICreateCommentResponse,
  ICreatePlaylistRequest,
  ICreatePlaylistResponse,
  IDeletePlaylistResponse,
  IEditVideoPlaylistRequest,
  IEditVideoPlaylistResponse,
  IGetChannelPlaylistsResponse,
  IGetChannelVideosResponse,
  IGetCommentsResponse,
  IGetLikedVideosResponse,
  IGetPlaylistByIdResponse,
  IGetPlaylistsResponse,
  IGetRelatedVideosResponse,
  IGetSavedVideosResponse,
  IGetVideoHomePageResponse,
  IGetVideoLikesCountResponse,
  IGetVideosResponse,
  IGetVideoStatusResponse,
  IGetWatchLaterVideosResponse,
  IIsLikedVideoResponse,
  IIsSavedVideoResponse,
  IIsVideoInWatchLaterResponse,
  // Like video interfaces
  ILikeVideoResponse,
  IPublishVideoRequest,
  IPublishVideoResponse,
  IRemoveVideoFromWatchLaterResponse,
  // Saved video interfaces
  ISavedVideoResponse,
  IUnlikeVideoResponse,
  IUnsavedVideoResponse,
  IUpdatePlaylistRequest,
  IUpdatePlaylistResponse,
  IUpdateVideoMetadataRequest,
  IUpdateVideoMetadataResponse,
  IVideoMetadata
} from '@/types/video';
import axios, { AxiosProgressEvent } from 'axios';
import api from './axios';

const videoService = {

  getPlaylistById: async (playlistId: string): Promise<HttpResponse<IGetPlaylistByIdResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getPlaylistById(playlistId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to get playlist by id');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get playlist by id: ${error.message}`);
      } else {
        throw new Error('Failed to get playlist by id: An unknown error occurred');
      }
    }
  },

  createPlaylist: async (data: ICreatePlaylistRequest): Promise<HttpResponse<ICreatePlaylistResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.PLAYLIST;
      const response = await api.post(endpoint, data, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to create playlist');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create playlist: ${error.message}`);
      } else {
        throw new Error('Failed to create playlist: An unknown error occurred');
      }
    }
  },

  getPlaylists: async (page: number, limit: number): Promise<HttpResponse<IGetPlaylistsResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getPlaylists(page, limit);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to get playlists');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get playlists: ${error.message}`);
      } else {
        throw new Error('Failed to get playlists: An unknown error occurred');
      }
    }
  },

  updatePlaylist: async (playlistId: string, data: IUpdatePlaylistRequest): Promise<HttpResponse<IUpdatePlaylistResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.updatePlaylist(playlistId);
      const response = await api.patch(endpoint, data, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to update playlist');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update playlist: ${error.message}`);
      } else {
        throw new Error('Failed to update playlist: An unknown error occurred');
      }
    }
  },

  deletePlaylist: async (playlistId: string): Promise<HttpResponse<IDeletePlaylistResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.deletePlaylist(playlistId);
      const response = await api.delete(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to delete playlist');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete playlist: ${error.message}`);
      } else {
        throw new Error('Failed to delete playlist: An unknown error occurred');
      }
    }
  },

  editVideoPlaylist: async (playlistId: string, data: IEditVideoPlaylistRequest): Promise<HttpResponse<IEditVideoPlaylistResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.editVideoPlaylist(playlistId);
      const response = await api.put(endpoint, data, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to edit video playlist');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to edit video playlist: ${error.message}`);
      } else {
        throw new Error('Failed to edit video playlist: An unknown error occurred');
      }
    }
  },

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


  getVideoHomePage: async (page: number, limit: number): Promise<HttpResponse<IGetVideoHomePageResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.HOME_PAGE(page, limit);
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

  checkThumbnail: async (payload: ICheckThumbnailRequest): Promise<HttpResponse<ICheckThumbnailResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.checkThumbnail(payload.videoId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to check thumbnail');
      }
      return response.data;
    }
    catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check thumbnail: ${error.message}`);
      } else {
        throw new Error('Failed to check thumbnail: An unknown error occurred');
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

  getVideos: async (params: {
    type: 'recommended' | 'popular' | 'search';
    page?: number;
    limit?: number;
    category?: string;
    timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
    query?: string;
    sortBy?: 'relevance' | 'date' | 'views';
  }): Promise<HttpResponse<IGetVideosResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getVideos(params);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to fetch videos');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch videos: ${error.message}`);
      } else {
        throw new Error('Failed to fetch videos: An unknown error occurred');
      }
    }
  },

  getRelatedVideos: async (videoId: string): Promise<HttpResponse<IGetRelatedVideosResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getRelatedVideos(videoId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to fetch related videos');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch related videos: ${error.message}`);
      } else {
        throw new Error('Failed to fetch related videos: An unknown error occurred');
      }
    }
  },

  getComments: async (videoId: string): Promise<HttpResponse<IGetCommentsResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getComments(videoId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to fetch comments');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch comments: ${error.message}`);
      } else {
        throw new Error('Failed to fetch comments: An unknown error occurred');
      }
    }
  },

  createComment: async (videoId: string, data: ICreateCommentRequest): Promise<HttpResponse<ICreateCommentResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.createComment(videoId);
      const response = await api.post(endpoint, data, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to create comment');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create comment: ${error.message}`);
      } else {
        throw new Error('Failed to create comment: An unknown error occurred');
      }
    }
  },

  getChannelVideos: async (channelId: string): Promise<HttpResponse<IGetChannelVideosResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getChannelVideos(channelId);
      const response = await api.get(endpoint, { withCredentials: true });
      return response.data;
    }
    catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch channel videos: ${error.message}`);
      } else {
        throw new Error('Failed to fetch channel videos: An unknown error occurred');
      }
    }
  },

  getChannelPlaylists: async (channelId: string): Promise<HttpResponse<IGetChannelPlaylistsResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getChannelPlaylists(channelId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to fetch channel playlists');
      }
      return response.data;
    }
    catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch channel playlists: ${error.message}`);
      } else {
        throw new Error('Failed to fetch channel playlists: An unknown error occurred');
      }
    }
  },

  // Like video methods
  likeVideo: async (videoId: string): Promise<HttpResponse<ILikeVideoResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.likeVideo(videoId);
      const response = await api.post(endpoint, {}, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to like video');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to like video: ${error.message}`);
      } else {
        throw new Error('Failed to like video: An unknown error occurred');
      }
    }
  },

  unlikeVideo: async (videoId: string): Promise<HttpResponse<IUnlikeVideoResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.unlikeVideo(videoId);
      const response = await api.delete(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to unlike video');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to unlike video: ${error.message}`);
      } else {
        throw new Error('Failed to unlike video: An unknown error occurred');
      }
    }
  },

  getVideoLikesCount: async (videoId: string): Promise<HttpResponse<IGetVideoLikesCountResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getVideoLikesCount(videoId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to get video likes count');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get video likes count: ${error.message}`);
      } else {
        throw new Error('Failed to get video likes count: An unknown error occurred');
      }
    }
  },

  getLikedVideos: async (): Promise<HttpResponse<IGetLikedVideosResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getLikedVideos;
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to get liked videos');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get liked videos: ${error.message}`);
      } else {
        throw new Error('Failed to get liked videos: An unknown error occurred');
      }
    }
  },

  isLikedVideo: async (videoId: string): Promise<HttpResponse<IIsLikedVideoResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.isLikedVideo(videoId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to check if video is liked');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check if video is liked: ${error.message}`);
      } else {
        throw new Error('Failed to check if video is liked: An unknown error occurred');
      }
    }
  },

  // Saved video methods
  saveVideo: async (videoId: string): Promise<HttpResponse<ISavedVideoResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.saveVideo(videoId);
      const response = await api.post(endpoint, {}, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to save video');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to save video: ${error.message}`);
      } else {
        throw new Error('Failed to save video: An unknown error occurred');
      }
    }
  },

  unsaveVideo: async (videoId: string): Promise<HttpResponse<IUnsavedVideoResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.unsaveVideo(videoId);
      const response = await api.delete(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to unsave video');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to unsave video: ${error.message}`);
      } else {
        throw new Error('Failed to unsave video: An unknown error occurred');
      }
    }
  },

  getSavedVideos: async (): Promise<HttpResponse<IGetSavedVideosResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getSavedVideos;
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to get saved videos');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get saved videos: ${error.message}`);
      } else {
        throw new Error('Failed to get saved videos: An unknown error occurred');
      }
    }
  },

  isSavedVideo: async (videoId: string): Promise<HttpResponse<IIsSavedVideoResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.isSavedVideo(videoId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to check if video is saved');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check if video is saved: ${error.message}`);
      } else {
        throw new Error('Failed to check if video is saved: An unknown error occurred');
      }
    }
  },

  // Watch later methods
  addToWatchLater: async (videoId: string): Promise<HttpResponse<IAddVideoToWatchLaterResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.addToWatchLater(videoId);
      const response = await api.post(endpoint, {}, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to add video to watch later');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to add video to watch later: ${error.message}`);
      } else {
        throw new Error('Failed to add video to watch later: An unknown error occurred');
      }
    }
  },

  removeFromWatchLater: async (videoId: string): Promise<HttpResponse<IRemoveVideoFromWatchLaterResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.removeFromWatchLater(videoId);
      const response = await api.delete(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to remove video from watch later');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to remove video from watch later: ${error.message}`);
      } else {
        throw new Error('Failed to remove video from watch later: An unknown error occurred');
      }
    }
  },

  getWatchLaterVideos: async (): Promise<HttpResponse<IGetWatchLaterVideosResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.getWatchLaterVideos;
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to get watch later videos');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get watch later videos: ${error.message}`);
      } else {
        throw new Error('Failed to get watch later videos: An unknown error occurred');
      }
    }
  },

  isInWatchLater: async (videoId: string): Promise<HttpResponse<IIsVideoInWatchLaterResponse>> => {
    try {
      const endpoint = API_ENDPOINTS.VIDEO.isInWatchLater(videoId);
      const response = await api.get(endpoint, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to check if video is in watch later');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to check if video is in watch later: ${error.message}`);
      } else {
        throw new Error('Failed to check if video is in watch later: An unknown error occurred');
      }
    }
  }
};

export default videoService;
