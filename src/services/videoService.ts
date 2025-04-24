import { api } from '@/services/axios';
import { PresignedUrlRequest, PresignedUrlResponse } from '@/types/video';

const videoService = {
  getPresignedUrl: async (data: PresignedUrlRequest): Promise<PresignedUrlResponse> => {
    return await api.post(`/upload/presigned-url`, data);
  },
};

export default videoService;
