import uploadService from "@/services/upload.service";
import {
  IAbortMultipartUpload,
  ICompleteMultipartUploadPayload,
  IDeleteObjectPayload,
  UploadOptions,
  UploadParams,
  UploadResult,
} from "@/types/upload";
import { IVideoFile } from "@/types/video";
import { useMutation } from "@tanstack/react-query";

async function handleUploadFile({ file, idToken }: UploadParams, { onProgress }: UploadOptions): Promise<UploadResult> {
  if (!file || !idToken) {
    throw new Error("File and idToken are required");
  }

  if (!(file instanceof File)) {
    console.error("Invalid file object:", file);
    throw new Error("Provided file is not a valid File object");
  }

  console.log("File type:", file.type);
  console.log("File name:", file.name);

  // Check if file type is valid
  const validTypes = ["video/mp4", "video/mpeg", "video/webm"];
  if (!file.type || !validTypes.includes(file.type)) {
    console.error("Invalid or missing file type:", file.type);
    throw new Error("Invalid file type. Only MP4, MPEG, and WebM are supported");
  }

  console.log("File type check passed successfully");

  file.status = "uploading";
  file.progress = 0;

  let userId = '';
  const userAuth = localStorage.getItem("user_auth");
  if (userAuth) {
    const parsedUserAuth = JSON.parse(userAuth);
    console.log(parsedUserAuth.user.id);
    userId = parsedUserAuth.user.id;
  }
  try {
    const presignedResponse = await uploadService.createPresignedUrl({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      idToken,
      userId,
    });

    const { data } = presignedResponse;
    if (!data) {
      throw new Error("No presigned URL data received");
    }

    let s3Key: string;
    if ("presignedUrl" in data) {
      await uploadService.uploadToS3WithSinglePresignedUrl(file, data.presignedUrl, (event) => {
        if (event.total && onProgress) {
          const percent = Math.round((event.loaded * 100) / event.total);
          file.progress = percent;
          onProgress(percent);
        }
      });
      s3Key = data.key;
    } else {
      const maxParts = 10000;
      const minPartSize = 5 * 1024 * 1024; // 5MB
      const partSize = Math.max(minPartSize, Math.ceil(file.size / maxParts));
      const parts = await uploadService.uploadToS3WithMultipartPresignedUrl(
        file,
        data,
        (event) => {
          if (event.total && onProgress) {
            const percent = Math.round((event.loaded * 100) / event.total);
            file.progress = percent;
            onProgress(percent);
          }
        },
        partSize
      );
      await uploadService.completeMultipartUpload({
        key: data.key,
        uploadId: data.uploadId,
        parts,
        idToken,
      });
      s3Key = data.key;
      file.uploadId = data.uploadId;
    }

    file.status = "success";
    file.s3Key = s3Key;
    file.progress = 100;

    return { videoFile: file };
  } catch (error) {
    file.status = "error";
    if (error instanceof Error) {
      file.error = error.message;
      if (error.message.includes("401")) {
        file.error = "Authentication token expired";
      }
    } else {
      file.error = "An unknown error occurred";
    }
    console.error("Upload error:", error);
    throw error;
  }
}

export function useUpload({ onProgress }: UploadOptions = {}) {
  const useUploadVideo = useMutation<UploadResult, Error, UploadParams>({
    mutationKey: ["uploadVideo"],
    mutationFn: (params) => {
      console.log(params);
      return handleUploadFile(params, { onProgress });
    },
    onError: (error, { file }) => {
      file.status = "error";
      file.error = error.message;
      if (error.message.includes("expired")) {
        console.error("Presigned URL expired:", error);
      } else {
        console.error("Upload failed:", error);
      }
    },
  });

  const useCancelUpload = async (videoFile: IVideoFile, idToken: string) => {
    if (!idToken) {
      console.error("Cannot cancel upload: idToken is required");
      return;
    }

    if (videoFile.status === "uploading" && videoFile.s3Key) {
      try {
        if (videoFile.uploadId) {
          await uploadService.abortMultipartUpload({
            key: videoFile.s3Key,
            uploadId: videoFile.uploadId,
            idToken,
          });
        }
        await uploadService.deleteObject({
          key: videoFile.s3Key,
          idToken,
        });
        videoFile.status = "error";
        videoFile.error = "Upload cancelled by user";
      } catch (error) {
        console.error("Failed to cancel upload:", error);
        videoFile.status = "error";
        videoFile.error = error instanceof Error ? error.message : "Failed to cancel upload";
      }
    }
  };

  const useCompleteMultipartUpload = useMutation<HttpResponse<null>, Error, ICompleteMultipartUploadPayload>({
    mutationKey: ["completeMultipartUpload"],
    mutationFn: uploadService.completeMultipartUpload,
    onError: (error) => {
      console.error("Failed to complete multipart upload:", error);
    },
  });

  const useAbortMultipartUpload = useMutation<HttpResponse<null>, Error, IAbortMultipartUpload>({
    mutationKey: ["abortMultipartUpload"],
    mutationFn: uploadService.abortMultipartUpload,
    onError: (error) => {
      console.error("Failed to abort multipart upload:", error);
    },
  });

  const useDeleteVideo = useMutation<HttpResponse<null>, Error, IDeleteObjectPayload>({
    mutationKey: ["deleteVideo"],
    mutationFn: uploadService.deleteObject,
    onError: (error) => {
      console.error("Failed to delete video:", error);
    },
  });

  return {
    useUploadVideo,
    useCancelUpload,
    useDeleteVideo,
    useCompleteMultipartUpload,
    useAbortMultipartUpload,
  };
}