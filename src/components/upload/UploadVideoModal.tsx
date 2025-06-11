import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useUploadContext } from "@/contexts/UploadContext";
import { IVideoFile, IVideoMetadata, VidPrivacy, VideoLifecycle } from "@/types/video";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Switch } from "../ui/switch";
import { FileDropzone } from "./FileDropzone";
import { ThumbnailSelector } from "./ThumbnailSelector";
import { VisibilitySelector } from "./VisibilitySelector";

interface UploadVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function UploadVideoModal({ isOpen, onClose }: UploadVideoModalProps) {
    // State cho form metadata
    const [localMetadata, setLocalMetadata] = useState<Partial<IVideoMetadata>>({
        title: "",
        description: "",
        tags: [],
        category: "",
        thumbnailUrl: "",
        privacy: VidPrivacy.PRIVATE,
        lifecycle: VideoLifecycle.DRAFT,
    });

    // State cho tags
    const [tagsInput, setTagsInput] = useState<string>("");

    // State cho publish video
    const [shouldPublish, setShouldPublish] = useState<boolean>(false);

    // Danh sách category
    const categories = [
        'Education',
        'Entertainment',
        'Gaming',
        'Music',
        'Science & Technology',
        'Sports',
        'Travel',
        'Other'
    ];

    // Chú ý: Có 2 loại trạng thái trong hệ thống
    // 1. IVideoFile.status: 'idle' | 'uploading' | 'success' | 'error' - Trạng thái của file đang upload
    // 2. VideoProcessingStatus: 'pending' | 'uploading' | 'processing' | 'ready' | 'failed' | 'cancelled' - Trạng thái xử lý video
    const {
        file,
        // uploadProgress,
        smoothUploadProgress,
        error,
        processingStatus,
        isUploading,
        canSaveMetadata,
        uploadVideo,
        setFile,
        setMetadata,
        setThumbnail,
        reset,
        cancelCurrentUpload,
        publishVideo,
        metadata,
        updateVideoMetadata
    } = useUploadContext();

    // Reset state khi đóng modal
    useEffect(() => {
        if (!isOpen) {
            reset();
            setLocalMetadata({
                title: "",
                description: "",
                tags: [],
                category: "",
                thumbnailUrl: "",
                privacy: VidPrivacy.PRIVATE,
                lifecycle: VideoLifecycle.DRAFT,
            });
            setTagsInput("");
            setShouldPublish(false);
        }
    }, [isOpen, reset]);

    // Cập nhật metadata khi có file mới
    useEffect(() => {
        if (file && file.name) {
            // Suggest title từ tên file nhưng không tự động set để người dùng có thể sửa
            const suggestedTitle = file.name.replace(/\.[^/.]+$/, ""); // Bỏ extension

            // Chỉ set suggested title nếu title hiện tại đang trống
            if (!localMetadata.title) {
                setLocalMetadata(prev => ({
                    ...prev,
                    title: suggestedTitle
                }));
            }
        }
    }, [file, localMetadata.title]);

    // Xử lý chọn file
    const handleFileSelect = (selectedFile: File) => {
        if (!selectedFile) return;

        // Tạo IVideoFile từ File với status đúng chuẩn
        const videoFile = Object.assign(selectedFile, {
            progress: 0,
            // IVideoFile.status chỉ chấp nhận: 'idle' | 'uploading' | 'success' | 'error'
            status: 'idle' as const
        }) as IVideoFile;

        setFile(videoFile);
        uploadVideo.mutate({ file: videoFile });
    };

    // Xử lý submit form
    const handleSubmit = async () => {
        if (canSaveMetadata && localMetadata && localMetadata.title && metadata?.id) {
            const metadataToSave = {
                ...localMetadata,
                lifecycle: shouldPublish ? VideoLifecycle.PUBLISHED : VideoLifecycle.DRAFT
            } as IVideoMetadata;

            try {
                // Cập nhật metadata lên server
                await updateVideoMetadata.mutateAsync({
                    videoId: metadata.id,
                    metadata: {
                        title: metadataToSave.title,
                        description: metadataToSave.description,
                        tags: metadataToSave.tags,
                        category: metadataToSave.category,
                        privacy: metadataToSave.privacy,
                        lifecycle: metadataToSave.lifecycle
                    }
                });

                // Cập nhật metadata trong context
                setMetadata(metadataToSave);

                // Nếu user chọn publish video, gọi API publish video
                if (shouldPublish) {
                    await publishVideo.mutateAsync({
                        videoId: metadata.id,
                        publishAt: new Date().toISOString()
                    });
                    console.log('Video đã được xuất bản thành công!');
                }

                onClose();
            } catch (error) {
                console.error('Lỗi khi cập nhật metadata:', error);
            }
        }
    };

    // Xử lý thêm tag
    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagsInput.trim()) {
            e.preventDefault();
            const newTag = tagsInput.trim();
            if (!localMetadata.tags?.includes(newTag)) {
                setLocalMetadata({
                    ...localMetadata,
                    tags: [...(localMetadata.tags || []), newTag]
                });
            }
            setTagsInput("");
        }
    };

    // Xử lý xóa tag
    const handleRemoveTag = (tag: string) => {
        setLocalMetadata({
            ...localMetadata,
            tags: localMetadata.tags?.filter(t => t !== tag)
        });
    };

    // Xử lý đóng modal
    const handleClose = () => {
        // Ngăn đóng modal khi đang upload
        if (isUploading) {
            return;
        }

        // Hỏi người dùng có muốn hủy upload không
        if (file && !canSaveMetadata) {
            if (confirm('Bạn có chắc muốn hủy quá trình upload không?')) {
                cancelCurrentUpload();
                onClose();
            }
            return;
        }

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Upload Video</DialogTitle>
                    <DialogDescription>
                        {processingStatus === 'pending'
                            ? 'Chọn file video để upload'
                            : 'Nhập thông tin chi tiết về video của bạn'}
                    </DialogDescription>
                </DialogHeader>

                {/* Step 1: Chọn file */}
                {processingStatus === 'pending' && !file && (
                    <div className="grid place-items-center">
                        <FileDropzone
                            onFileSelect={handleFileSelect}
                            maxSize={1024 * 1024 * 1024} // 1GB
                            acceptedFormats={['.mp4', '.mov', '.webm', '.avi']}
                        />
                    </div>
                )}

                {/* Hiển thị file đã chọn và tiến trình upload */}
                {file && (
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm truncate">{file.name}</h4>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>                                    <div className="flex items-center space-x-2">
                                        {processingStatus === 'ready' && (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        )}
                                        {(processingStatus === 'failed' || processingStatus === 'cancelled') && (
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                        )}
                                        {!canSaveMetadata && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => cancelCurrentUpload()}
                                                disabled={!file || processingStatus === 'ready'}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {(processingStatus === 'uploading' || processingStatus === 'processing') && (
                                    <div className="mt-2">
                                        <Progress value={smoothUploadProgress} className="h-2" />
                                        <p className="text-xs text-right mt-1">
                                            {processingStatus === 'uploading'
                                                ? `Đang upload: ${Math.round(smoothUploadProgress)}%`
                                                : 'Đang xử lý video...'}
                                        </p>
                                    </div>
                                )}
                                {error && (
                                    <p className="text-sm text-red-500 mt-2">{error}</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Step 2: Form nhập metadata */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Thumbnail</Label>
                                <ThumbnailSelector
                                    videoFile={file}
                                    currentThumbnail={localMetadata.thumbnailUrl || ''}
                                    onChange={(url) => setLocalMetadata({ ...localMetadata, thumbnailUrl: url })}
                                    onUpload={(file) => setThumbnail(file)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Chọn hoặc tải lên hình ảnh thumbnail cho video của bạn
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Tiêu đề (bắt buộc)</Label>
                                <Input
                                    id="title"
                                    value={localMetadata.title || ''}
                                    onChange={(e) => setLocalMetadata({ ...localMetadata, title: e.target.value })}
                                    placeholder="Nhập tiêu đề video"
                                    maxLength={100}
                                />
                                <div className="flex justify-end">
                                    <span className="text-xs text-muted-foreground">
                                        {localMetadata.title?.length || 0}/100
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    value={localMetadata.description || ''}
                                    onChange={(e) => setLocalMetadata({ ...localMetadata, description: e.target.value })}
                                    placeholder="Nhập mô tả video"
                                    rows={4}
                                />
                            </div>                            <div className="space-y-2">
                                <Label htmlFor="visibility">Quyền riêng tư</Label>
                                <VisibilitySelector
                                    value={String(localMetadata.privacy)}
                                    onChange={(value) =>
                                        setLocalMetadata({
                                            ...localMetadata,
                                            privacy: VidPrivacy[value.toUpperCase() as keyof typeof VidPrivacy]
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="publish">Xuất bản video ngay</Label>
                                    <Switch
                                        id="publish"
                                        checked={shouldPublish}
                                        onCheckedChange={setShouldPublish}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {shouldPublish
                                        ? "Video của bạn sẽ được xuất bản ngay sau khi lưu"
                                        : "Video sẽ được lưu dưới dạng bản nháp và chỉ bạn mới có thể xem"}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags">Tags</Label>
                                <div>
                                    <Input
                                        id="tagsInput"
                                        value={tagsInput}
                                        onChange={(e) => setTagsInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        placeholder="Thêm tags (nhấn Enter sau mỗi tag)"
                                    />
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {localMetadata.tags && localMetadata.tags.map((tag: string) => (
                                            <div
                                                key={tag}
                                                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Danh mục</Label>
                                <Select
                                    value={localMetadata.category}
                                    onValueChange={(value) => setLocalMetadata({ ...localMetadata, category: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category.toLowerCase()}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Publish option */}
                            <div className="space-y-2">
                                <Label>Xuất bản ngay</Label>
                                <Switch
                                    checked={shouldPublish}
                                    onCheckedChange={setShouldPublish}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Phần nút điều khiển */}                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                        {canSaveMetadata ? 'Hủy' : 'Đóng'}
                    </Button>
                    {file && (
                        <Button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={!canSaveMetadata || !localMetadata.title}
                        >
                            {shouldPublish
                                ? 'Lưu và xuất bản'
                                : 'Lưu làm bản nháp'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
