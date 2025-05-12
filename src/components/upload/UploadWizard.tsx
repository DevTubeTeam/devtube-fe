import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useUpload } from "@/hooks/useUpload";
import { IVideoFile, IVideoMetadata } from "@/types/video";
import { AlertDialogAction, AlertDialogCancel, AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { Dropzone } from "./Dropzone";

interface UploadStepProps {
    onNext: () => void;
    onCancel: () => void;
    onBack?: () => void;
}

const UploadStep = ({ onNext, onCancel }: UploadStepProps) => {
    const { user, tokens } = useAuth();
    const [uploadedFile, setUploadedFile] = useState<IVideoFile | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { useUploadVideo, useCancelUpload } = useUpload({
        onProgress: (progress) => setUploadProgress(progress),
    });

    const handleDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0] as IVideoFile;
        setUploadedFile(file);

        try {
            const result = await useUploadVideo.mutateAsync({
                file,
                idToken: tokens?.accessToken || "",
            });

            if (result.videoFile.status === 'success') {
                onNext();
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    const handleCancel = async () => {
        if (uploadedFile && tokens?.accessToken) {
            await useCancelUpload(uploadedFile, tokens.accessToken);
            setUploadedFile(null);
            setUploadProgress(0);
        }
        onCancel();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
            <Dropzone onDrop={handleDrop} />

            {uploadedFile && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{uploadedFile.name}</span>
                        <span className="text-sm text-gray-500">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />

                    {uploadedFile.status === 'error' && (
                        <p className="text-red-500 text-sm">{uploadedFile.error}</p>
                    )}
                </div>
            )}

            <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleCancel}>
                    Cancel
                </Button>
            </div>
        </div>
    );
};

const MetadataStep = ({ onNext, onBack }: UploadStepProps) => {
    const [metadata, setMetadata] = useState<IVideoMetadata>({
        title: "",
        description: "",
        fileName: "",
        fileType: "",
        fileSize: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Save metadata
        onNext();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Video Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                        required
                        value={metadata.title}
                        onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                        placeholder="Enter video title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <Textarea
                        value={metadata.description}
                        onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                        placeholder="Enter video description"
                        rows={4}
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit">
                        Continue
                    </Button>
                </div>
            </form>
        </div>
    );
};

const ConfirmationStep = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Upload Complete</h2>

            <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">
                    Your video has been successfully uploaded and is being processed.
                    You will be notified when it's ready to view.
                </p>
            </div>

            <div className="flex justify-end">
                <Button onClick={onBack}>
                    Back to Uploads
                </Button>
            </div>
        </div>
    );
};

const UploadWizard = () => {
    const [step, setStep] = useState(1);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);
    const handleCancel = () => setShowCancelDialog(true);

    const confirmCancel = () => {
        setShowCancelDialog(false);
        setStep(1);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {step === 1 && (
                <UploadStep onNext={handleNext} onCancel={handleCancel} />
            )}

            {step === 2 && (
                <MetadataStep onNext={handleNext} onBack={handleBack} onCancel={handleCancel} />
            )}

            {step === 3 && (
                <ConfirmationStep onBack={handleBack} />
            )}

            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Upload</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel? The uploaded video will be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Continue</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmCancel}>Cancel Upload</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default UploadWizard;