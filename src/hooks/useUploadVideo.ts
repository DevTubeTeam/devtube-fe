import { uploadToS3WithPresignedUrl } from '@/services/uploadService';
import { useMutation } from '@tanstack/react-query';

interface UploadVideoParams {
  file: File;
  // metadata: VideoMetadata;
  onProgress?: (progress: number) => void;
}

interface UploadVideoResponse {
  success: boolean;
  videoUrl: string;
  message?: string;
}

export const useUploadVideo = () => {
  const uploadVideoMutation = useMutation<
    UploadVideoResponse,
    Error,
    UploadVideoParams
  >({
    mutationFn: async ({ file, onProgress }: UploadVideoParams) => {
      // Temporary: hardcoded pre-signed URL for manual testing
      const presignedUrl =
        'https://devtube-video.s3.ap-southeast-1.amazonaws.com/uploads/userId/cc6f4e20-45c7-4468-a935-3abf85de477a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAYG2Z2HFI4JCJB6MV%2F20250421%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20250421T151644Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDcaDmFwLXNvdXRoZWFzdC0xIkYwRAIgYOT%2B04LRM4OBgRxX4QUZx1D6dwafymBZ89FvcmZTRbQCIHE1pfGv%2Bl%2BYgDYosfUUmNRPGrwoyfPNEpCQwUEmLZkoKoUDCMD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNTY0NDM5NjkzNjQ5Igys4clmJMNON%2F0Ots8q2QJ4F4DJhOqr2Rg2mgcQQspn1Xzrfoiug6SRv2fQnfq0SvS1tVHXH0NeZm32%2FXgea2Vb55eJnvdYHrSBSUPPMKET2yOyP57NX6%2FLPlef4pXdKgIM80YZhQw8HvMqu9VClswf5gZ7LJNC5grabp35Llpp6bVrazWsdjZXYO2flADherOcTuGFHYAh6Vujs62iuxc9oyjwYsxW0TrRzcit8OtxHVB2IT6rsOCQWBGfMWU6RYDVEMb3JSafMFTrtTrgc2j4%2Fft1%2F3Sln1OvkJsidqHcXvPaeiGnGVzEQ5aSheT7foCm%2FqZDTv8hRZAOc14ekok8hf%2FtIGtftSc%2FVgdBKNpgJAPtDTkk1GS0Mh3CEtt5OSOYMyS6r1WJYh1TT7N1YOvzL%2FAZRd0uXxoYDyYEAteLfPQ%2BywhODh7oDk6T%2FhBtcsQkq55FYbOfh55juji%2FRCaTBK55z9%2FdW9gw3cKZwAY6yQHhfn%2BPVzT9t8evbcPwykKE4OTdh4iSIIohvsvZiIeFR7Db0WbfOYSmcLM5KZ8QHnM%2BGVbff7%2BV%2BocUovMyXaGl0d2py2xKQAeex3C9%2F9JdOLITuAbTEeuJx7%2FcstLN1bg4GdHGaqNGFKg8UbhdiAp0wYTmUK8n99p2ow%2FWxCV%2FvdqUbkJM4Xms3sk7VEWEvPZfuHFEJrRNMn89HNDiMD4h6o1VR4c2ePe9%2BIXRUH%2BskZQMUndCGC4BunDRZwByFRGBqzIzwhBxC7A%3D&X-Amz-Signature=79d55aee0082c1362972a44430824c774efe0399783f8f6415b71d356d45b86f&X-Amz-SignedHeaders=host&x-amz-checksum-crc32=AAAAAA%3D%3D&x-amz-sdk-checksum-algorithm=CRC32&x-id=PutObject';

      const result = await uploadToS3WithPresignedUrl(
        file,
        presignedUrl,
        onProgress,
      );

      if (!result) {
        throw new Error('Upload failed');
      }

      return {
        success: true,
        videoUrl: presignedUrl.split('?')[0], // Trả lại link S3 public nếu có
        message: 'Upload thành công',
      };
    },
  });

  return {
    uploadVideoMutation,
  };
};
