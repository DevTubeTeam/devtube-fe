import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IUpdateVideoMetadataRequest, IVideoFile, VideoLifecycle, VidPrivacy } from '@/types/video';
import { AlertCircle, X } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { FileDropzone } from './FileDropzone';
import { UploadComplete } from './UploadComplete';
import { UploadProgress } from './UploadProgress';
import { VideoMetadataForm } from './VideoMetadataForm';

type UploadStep = 'dropzone' | 'metadata' | 'processing' | 'ready' | 'advanced' | 'complete' | 'failed';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [currentStep, setCurrentStep] = useState<UploadStep>('dropzone');


    const stepTitles = useMemo(() => ({
        dropzone: 'Upload videos',
        metadata: 'Details',
        processing: 'Processing',
        advanced: 'Advanced settings',
        complete: 'Video published',
        ready: 'Ready to publish',
        failed: 'Upload failed'
    }), []);

    const handleFileSelect = (file: IVideoFile) => {
        console.log(file);
        setCurrentStep('metadata');
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle>{stepTitles[currentStep]}</DialogTitle>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 rounded-full"
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>
                {(currentStep === 'processing' || currentStep !== 'dropzone') && (
                    <>
                        <div className="p-2 border-b bg-background/95 backdrop-blur-sm">
                            <UploadProgress
                                progress={currentStep === 'processing' ? 75 : 100}
                                processingStage={currentStep === 'processing' ? 'Processing video...' : undefined}
                            />
                        </div>
                    </>
                )}
                {currentStep === 'failed' && (
                    <div className="p-6 flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-xl font-semibold">Upload Failed</h3>
                        <div className="flex space-x-3 mt-4">
                            <Button variant="outline" onClick={() => onClose}>
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    setCurrentStep('dropzone');
                                }}
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                )}
                {currentStep === 'dropzone' && <FileDropzone onFileSelect={handleFileSelect} />}
                {currentStep === 'metadata' && (
                    <VideoMetadataForm
                        initialData={{
                            title: 'Sample Video Title',
                            description: 'This is a sample description for your video.',
                            privacy: VidPrivacy.PUBLIC,
                            tags: ['react', 'javascript', 'tutorial'],
                            category: 'education',
                            publishAt: '',
                            lifecycle: VideoLifecycle.DRAFT
                        }}
                        file={null}
                        videoId="sample-123456"
                        onSubmit={(data: IUpdateVideoMetadataRequest) => {
                            console.log('Metadata submitted:', data);
                            setCurrentStep('processing');
                        }}
                        onCancel={() => setCurrentStep('dropzone')}
                        isUploading={false}
                    />
                )}
                {currentStep === 'advanced' && (
                    // <AdvancedSettings initialData={metadata || {}} onSubmit={handleAdvancedSubmit} />
                    <>Advanced Settings </>

                )}
                {currentStep === 'processing' && (

                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Processing Video</h3>
                        <p className="text-muted-foreground mb-4">Your video is being processed. This may take a few minutes.</p>
                        <div className="flex justify-end">
                            <Button variant="outline" onClick={() => setCurrentStep('ready')}>
                                Skip to Ready
                            </Button>
                        </div>
                    </div>

                    // <ProcessingStatus
                    //     status={processingStatus}
                    //     onComplete={() => {
                    //         if (processingStatus === 'ready') {
                    //             setCurrentStep('ready');
                    //         }
                    //     }}
                    // />
                )}
                {currentStep === 'ready' && (
                    <div className="p-6">
                        <h3 className="text-xl font-semibold mb-4">Video Ready</h3>
                        <p className="text-muted-foreground mb-4">Your video is ready to publish.</p>
                        <div className="flex justify-end gap-2">
                            <Button
                                onClick={() => console.log('publish')}
                            >
                                Publish Now
                            </Button>
                        </div>
                    </div>
                )}
                {currentStep === 'complete' && (
                    // <UploadComplete
                    //     videoData={{
                    //         title: metadata?.title || '',
                    //         thumbnailUrl: metadata?.thumbnailUrl || '',
                    //         privacy: metadata?.privacy || VidPrivacy.PRIVATE,
                    //         videoUrl: metadata?.videoUrl || ''
                    //     }}
                    //     videoId={videoId}
                    //     onClose={handleClose}
                    // />

                    <UploadComplete
                        videoData={{
                            title: 'Sample Video',
                            thumbnailUrl: 'https://example.com/thumbnail.jpg',
                            privacy: VidPrivacy.PUBLIC,
                            videoUrl: 'https://example.com/video.mp4'
                        }}
                        videoId="12345"
                        onClose={onClose}
                    />
                )}
            </DialogContent>
        </Dialog >
    );
};
