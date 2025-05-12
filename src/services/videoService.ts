import API_ENDPOINTS from '@/configs/apiEndpoints';
import { api } from '@/services/axios';
import { IVideoMetadata } from '@/types/video';

const videoService = {
  saveVideoMetadata: async (data: IVideoMetadata): Promise<HttpResponse<null>> => {
    if (!data.title || !data.fileName || data.fileSize <= 0) {
      throw new Error('Invalid video metadata: title, fileName, and fileSize are required');
    }
    try {
      const response = await api.post(API_ENDPOINTS.VIDEO.SAVE_METADATA, data, { withCredentials: true });
      if (response.data.statusCode !== 200) {
        throw new Error(response.data.message || 'Failed to save video metadata');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to save video metadata: ${error.message}`);
      } else {
        throw new Error('Failed to save video metadata: An unknown error occurred');
      }
    }
  }
};

export default videoService;