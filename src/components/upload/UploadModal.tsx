import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useState } from 'react';
import { AdvancedSettings } from './AdvancedSettings';
import { FileDropzone } from './FileDropzone';
import { ProcessingStatus } from './ProcessingStatus';
import { UploadComplete } from './UploadComplete';
import { UploadProgress } from './UploadProgress';
import { VideoMetadataForm } from './VideoMetadataForm';

type UploadStep = 'dropzone' | 'metadata' | 'processing' | 'advanced' | 'complete';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [currentStep, setCurrentStep] = useState<UploadStep>('dropzone');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [videoData, setVideoData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        playlist: '',
        audience: '',
        visibility: 'private',
        tags: [],
        category: '',
    });

    // Step titles based on current step
    const stepTitles = {
        dropzone: 'Upload videos',
        metadata: 'Details',
        processing: 'Processing',
        advanced: 'Advanced settings',
        complete: 'Video published',
    };

    // Mock function for file selection
    const handleFileSelect = (files: File[]) => {
        setSelectedFiles(files);
        setUploadProgress(0);
        // Simulate starting upload automatically
        setCurrentStep('metadata');

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 5;
            });
        }, 500);
    };

    // Mock function for metadata submission
    const handleMetadataSubmit = (data: any) => {
        setVideoData({ ...videoData, ...data });
        setCurrentStep('advanced');
    };

    // Mock function for advanced settings
    const handleAdvancedSubmit = (data: any) => {
        setVideoData({ ...videoData, ...data });
        setCurrentStep('processing');

        // Simulate processing delay
        setTimeout(() => {
            setCurrentStep('complete');
        }, 3000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{stepTitles[currentStep]}</DialogTitle>
                </DialogHeader>

                {/* Always show progress when uploading has started */}
                {currentStep !== 'dropzone' && currentStep !== 'complete' && (
                    <div className="fixed top-0 inset-x-0 p-2 bg-background/80 backdrop-blur-sm z-50">
                        <UploadProgress progress={uploadProgress} />
                    </div>
                )}

                {/* Step content */}
                {currentStep === 'dropzone' && (
                    <FileDropzone onFileSelect={handleFileSelect} />
                )}

                {currentStep === 'metadata' && (
                    <VideoMetadataForm
                        initialData={videoData}
                        onSubmit={handleMetadataSubmit}
                        uploadProgress={uploadProgress}
                        selectedFile={selectedFiles[0]}
                    />
                )}

                {currentStep === 'advanced' && (
                    <AdvancedSettings
                        initialData={videoData}
                        onSubmit={handleAdvancedSubmit}
                    />
                )}

                {currentStep === 'processing' && (
                    <ProcessingStatus />
                )}

                {currentStep === 'complete' && (
                    <UploadComplete
                        videoData={videoData}
                        onClose={onClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
