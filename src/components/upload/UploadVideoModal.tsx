import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export const UploadVideoModal: React.FC = () => {
  type UploadStep = 'select' | 'uploading' | 'metadata' | 'preview';

  const [step, setStep] = useState<UploadStep>('select');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    playlistId: '',
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setVideoFile(file);
    setStep('uploading');
    uploadVideo(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'video/*': [] },
    onDrop,
  });

  const uploadVideo = async (file: File) => {
    const formData = new FormData();
    formData.append('video', file);

    const response = await fetch('/api/videos/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    setUploadId(result.uploadId);
    setVideoUrl(result.url);
    setStep('metadata');
  };

  const handleMetadataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`/api/videos/${uploadId}/metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    setStep('preview');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-8 w-full max-w-2xl">
        {step === 'select' && (
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-xl p-10 text-center bg-amber-50 dark:bg-gray-800 cursor-pointer"
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-amber-700">Thả video vào đây...</p>
            ) : (
              <p className="text-amber-700">
                Kéo thả hoặc chọn video để bắt đầu upload
              </p>
            )}
          </div>
        )}

        {step === 'uploading' && (
          <div className="text-center">
            <p className="mb-4 text-yellow-800 dark:text-yellow-300">
              Đang tải video lên...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {step === 'metadata' && (
          <form onSubmit={handleMetadataSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tiêu đề"
              value={metadata.title}
              onChange={e =>
                setMetadata({ ...metadata, title: e.target.value })
              }
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
              required
            />
            <textarea
              placeholder="Mô tả"
              value={metadata.description}
              onChange={e =>
                setMetadata({ ...metadata, description: e.target.value })
              }
              className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
              rows={4}
            />
            {/* Có thể thêm dropdown playlist ở đây */}
            <button
              type="submit"
              className="bg-yellow-800 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
            >
              Tiếp tục
            </button>
          </form>
        )}

        {step === 'preview' && videoUrl && (
          <div>
            <video src={videoUrl} controls className="w-full rounded-lg" />
            <p className="text-sm mt-2 italic text-gray-500 dark:text-gray-400">
              Link riêng tư: <span className="text-amber-800">{videoUrl}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
