import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IVideoFile, VidPrivacy } from "@/types/video";
import { Field, Form, Formik } from 'formik';
import { Image as ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useUpload } from "../../hooks";
import { ScrollArea } from "../ui/scroll-area";
import { FileDropzone } from "./FileDropzone";
import { VisibilitySelector } from "./VisibilitySelector";

// Constants
const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_VIDEO_FORMATS = ['.mp4', '.mov', '.webm', '.avi'];
const ACCEPTED_THUMBNAIL_FORMATS = ['image/jpeg', 'image/png', 'image/gif'];

const CATEGORIES = [
    'Education',
    'Entertainment',
    'Gaming',
    'Music',
    'Science & Technology',
    'Sports',
    'Travel',
    'Other'
] as const;

// Types
interface UploadVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FormValues {
    title: string;
    description: string;
    category: string;
    tags: string[];
    thumbnail: IVideoFile | null;
    privacy: VidPrivacy;
}

// Validation Schema
const VideoMetadataSchema = Yup.object().shape({
    title: Yup.string()
        .required('Tiêu đề là bắt buộc')
        .max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
    description: Yup.string()
        .max(5000, 'Mô tả không được vượt quá 5000 ký tự'),
    category: Yup.string()
        .required('Danh mục là bắt buộc')
        .oneOf(CATEGORIES, 'Danh mục không hợp lệ'),
    tags: Yup.array()
        .of(Yup.string())
        .max(10, 'Tối đa 10 tags'),
    thumbnail: Yup.mixed<IVideoFile>()
        .required('Thumbnail là bắt buộc')
        .test('fileSize', 'Kích thước file không được vượt quá 5MB', (value) => {
            if (!value) return false;
            return value.size <= MAX_THUMBNAIL_SIZE;
        })
        .test('fileType', 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)', (value) => {
            if (!value) return false;
            return ACCEPTED_THUMBNAIL_FORMATS.includes(value.type);
        }),
    privacy: Yup.number()
        .oneOf([VidPrivacy.PUBLIC, VidPrivacy.PRIVATE, VidPrivacy.UNLISTED])
        .required('Quyền riêng tư là bắt buộc')
});

// Components
const ThumbnailUpload = ({ value, onChange }: { value: IVideoFile | null; onChange: (file: IVideoFile | null) => void }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                {value ? (
                    <>
                        <img
                            src={URL.createObjectURL(value)}
                            alt="Video thumbnail"
                            className="h-full w-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (value) {
                                    URL.revokeObjectURL(URL.createObjectURL(value));
                                    onChange(null);
                                }
                            }}
                            className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">Chưa có thumbnail</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col justify-center">
                <div
                    className="border-2 border-dashed rounded-lg p-6 transition-colors hover:border-primary/50 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                    onClick={() => document.getElementById('thumbnail-upload')?.click()}
                >
                    <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm font-medium">Upload thumbnail</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            JPG, PNG hoặc GIF (tối đa 5MB)
                        </p>
                    </div>
                </div>
                <input
                    id="thumbnail-upload"
                    type="file"
                    accept={ACCEPTED_THUMBNAIL_FORMATS.join(',')}
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            if (file.size > MAX_THUMBNAIL_SIZE) {
                                toast.error('Kích thước file không được vượt quá 5MB');
                                return;
                            }
                            onChange(file as IVideoFile);
                        }
                    }}
                />
            </div>
        </div>
        <p className="text-xs text-muted-foreground">
            Thumbnail sẽ giúp video của bạn nổi bật hơn. Kích thước đề xuất: 1280x720 pixels.
        </p>
    </div>
);

const TagsInput = ({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) => {
    const [input, setInput] = useState("");

    const handleAddTag = (tag: string) => {
        if (value.length >= 10) {
            toast.error('Tối đa 10 tags');
            return;
        }
        onChange([...value, tag]);
        setInput('');
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onChange(value.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && input.trim()) {
                            e.preventDefault();
                            handleAddTag(input.trim());
                        }
                    }}
                    placeholder="Nhập tag và nhấn Enter"
                    disabled={value.length >= 10}
                />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
                {value.map((tag) => (
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
            <div className="text-xs text-muted-foreground mt-1">
                {value.length}/10 tags
            </div>
        </div>
    );
};

export function UploadVideoModal({ isOpen, onClose }: UploadVideoModalProps) {
    const [file, setFile] = useState<IVideoFile | null>(null);
    const [smoothUploadProgress, setSmoothUploadProgress] = useState(0);
    const [videoId, setVideoId] = useState<string | null>(null);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'ready' | 'error'>('idle');
    const [uploadToastId, setUploadToastId] = useState<string | number | null>(null)


    const { uploadVideo, updateVideoMetadata, cancelUpload } = useUpload({
        onProgress: (progress) => {
            setSmoothUploadProgress(progress);
            if (progress === 100) {
                setUploadStatus('processing');
                if (uploadToastId) {
                    toast.update(uploadToastId, {
                        render: 'Video đang được xử lý, vui lòng đợi...',
                        type: 'info',
                        autoClose: false
                    });
                }
            }
        },
    });

    const { mutateAsync: uploadVideoMutation, isPending: isUploadingPending } = uploadVideo();

    const handleVideoFileSelect = async (selectedFile: File) => {
        if (!selectedFile) return;

        const videoFile = Object.assign(selectedFile, {
            progress: 0,
            status: 'idle' as const
        }) as IVideoFile;

        setFile(videoFile);
        setUploadStatus('uploading');

        // Tạo toast mới và lưu ID
        const toastId = toast.info('Đang upload video...', {
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            draggable: false,
        });
        setUploadToastId(toastId);

        try {
            const result = await uploadVideoMutation({
                file: videoFile,
            });
            setVideoId(result.videoId);
            setUploadStatus('ready');

            // Cập nhật toast thành công
            if (uploadToastId) {
                toast.update(uploadToastId, {
                    render: 'Upload video thành công! Bạn có thể tiếp tục nhập thông tin video.',
                    type: 'success',
                    autoClose: 3000
                });
            }
        } catch (error) {
            setUploadStatus('error');
            // Cập nhật toast lỗi
            if (uploadToastId) {
                toast.update(uploadToastId, {
                    render: 'Upload video thất bại: ' + (error instanceof Error ? error.message : 'Unknown error'),
                    type: 'error',
                    autoClose: 5000
                });
            }
        } finally {
            setUploadToastId(null);
        }
    };

    const handleSubmit = async (values: FormValues) => {
        if (!videoId) {
            toast.error('Video chưa sẵn sàng');
            return;
        }

        // Kiểm tra các trường bắt buộc
        if (!values.title.trim()) {
            toast.error('Vui lòng nhập tiêu đề video');
            return;
        }

        if (!values.category) {
            toast.error('Vui lòng chọn danh mục');
            return;
        }

        if (!values.thumbnail) {
            toast.error('Vui lòng chọn thumbnail cho video');
            return;
        }

        // Tạo toast loading
        const toastId = toast.loading('Đang lưu thông tin video...', {
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            draggable: false,
        });

        try {
            await updateVideoMetadata.mutateAsync({
                videoId: videoId,
                metadata: {
                    title: values.title.trim(),
                    description: values.description.trim(),
                    category: values.category,
                    tags: values.tags,
                    privacy: values.privacy
                },
                thumbnail: values.thumbnail
            });

            // Cập nhật toast thành công
            toast.update(toastId, {
                render: 'Lưu thông tin video thành công!',
                type: 'success',
                autoClose: 3000,
                isLoading: false
            });

            // Đóng modal sau khi lưu thành công
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            // Cập nhật toast lỗi
            toast.update(toastId, {
                render: 'Không thể lưu thông tin video. Vui lòng thử lại.',
                type: 'error',
                autoClose: 5000,
                isLoading: false
            });

            // Log lỗi để debug
            console.error('Error saving video metadata:', error);
        }
    };

    // Reset state khi đóng modal
    useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setSmoothUploadProgress(0);
            setVideoId(null);
            setUploadStatus('idle');
        }
    }, [isOpen]);

    // Xử lý đóng modal
    const handleClose = async () => {
        if (isUploadingPending) {
            if (confirm('Bạn có chắc muốn hủy quá trình upload không?')) {
                if (videoId) {
                    // Gọi API xóa video nếu đã có videoId
                    // await deleteVideo(videoId); // Nếu có mutation xóa video
                } else if (file && file.s3Key && file.uploadId) {
                    // Nếu chưa có videoId nhưng file đã có s3Key và uploadId thì abort upload
                    await cancelUpload.mutateAsync(file);
                }
                onClose();
            }
            return;
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[650px] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Upload Video</DialogTitle>
                    <DialogDescription>
                        {!file
                            ? 'Chọn file video để upload'
                            : 'Nhập thông tin chi tiết về video của bạn'}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[600px] w-full border rounded-md">
                    <div className="p-6">
                        {!file ? (
                            <div className="flex flex-col items-center justify-center h-[400px] w-full">
                                <FileDropzone
                                    onFileSelect={handleVideoFileSelect}
                                    maxSize={MAX_FILE_SIZE}
                                    acceptedFormats={ACCEPTED_VIDEO_FORMATS}
                                />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {uploadStatus === 'uploading' && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Đang upload video...</span>
                                            <span>{smoothUploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full transition-all duration-300"
                                                style={{ width: `${smoothUploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground text-center">
                                            Vui lòng không đóng trình duyệt trong quá trình upload
                                        </p>
                                    </div>
                                )}

                                {uploadStatus === 'processing' && (
                                    <div className="flex flex-col items-center space-y-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span>Đang xử lý video...</span>
                                        <p className="text-xs text-center">
                                            Quá trình này có thể mất vài phút tùy thuộc vào kích thước video
                                        </p>
                                    </div>
                                )}

                                <Formik<FormValues>
                                    initialValues={{
                                        title: "",
                                        description: "",
                                        category: "",
                                        tags: [],
                                        thumbnail: null,
                                        privacy: VidPrivacy.PRIVATE
                                    }}
                                    onSubmit={handleSubmit}
                                    validationSchema={VideoMetadataSchema}
                                    enableReinitialize
                                >
                                    {({ values, setFieldValue, isSubmitting, errors, touched, submitCount }) => {
                                        const isSaveButtonDisabled =
                                            !videoId ||
                                            isUploadingPending ||
                                            isSubmitting ||
                                            Object.keys(errors).length > 0 ||
                                            !values.title.trim() ||
                                            !values.category ||
                                            !values.thumbnail;
                                        // Helper lấy lý do lỗi cho từng field
                                        const getFieldError = (field: keyof FormValues) => {
                                            if (!isSaveButtonDisabled) return null;
                                            if (field === 'title' && (!values.title.trim())) return 'Tiêu đề là bắt buộc';
                                            if (field === 'category' && !values.category) return 'Danh mục là bắt buộc';
                                            if (field === 'thumbnail' && !values.thumbnail) return 'Thumbnail là bắt buộc';
                                            if (errors[field as keyof FormValues]) return errors[field as keyof FormValues] as string;
                                            return null;
                                        };
                                        // Helper xác định màu * cho từng field
                                        const getAsteriskClass = (field: keyof FormValues) => {
                                            if (getFieldError(field)) return "text-destructive";
                                            return "text-primary";
                                        };
                                        return (
                                            <Form className="space-y-6">
                                                {/* Tiêu đề */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="title">
                                                        Tiêu đề
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className={"cursor-help ml-1 " + getAsteriskClass('title')}>*</span>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="w-auto px-2 py-1 text-xs">
                                                                {getFieldError('title') || 'Bắt buộc'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </Label>
                                                    <Field
                                                        as={Input}
                                                        id="title"
                                                        name="title"
                                                        placeholder="Nhập tiêu đề video"
                                                    />
                                                    {((touched.title || submitCount > 0) && !isSaveButtonDisabled && errors.title) && (
                                                        <div className="text-sm text-destructive">{errors.title}</div>
                                                    )}
                                                </div>
                                                {/* Mô tả */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="description">Mô tả</Label>
                                                    <Field
                                                        as={Textarea}
                                                        id="description"
                                                        name="description"
                                                        placeholder="Nhập mô tả video"
                                                        className="min-h-[100px]"
                                                    />
                                                    {((touched.description || submitCount > 0) && !isSaveButtonDisabled && errors.description) && (
                                                        <div className="text-sm text-destructive">{errors.description}</div>
                                                    )}
                                                </div>
                                                {/* Danh mục */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="category">
                                                        Danh mục
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className={"cursor-help ml-1 " + getAsteriskClass('category')}>*</span>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="w-auto px-2 py-1 text-xs">
                                                                {getFieldError('category') || 'Bắt buộc'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </Label>
                                                    <Select
                                                        value={values.category}
                                                        onValueChange={(value) => setFieldValue('category', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn danh mục" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {CATEGORIES.map((category) => (
                                                                <SelectItem key={category} value={category}>
                                                                    {category}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {((touched.category || submitCount > 0) && !isSaveButtonDisabled && errors.category) && (
                                                        <div className="text-sm text-destructive">{errors.category}</div>
                                                    )}
                                                </div>
                                                {/* Thumbnail */}
                                                <div className="space-y-2">
                                                    <Label>
                                                        Thumbnail
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className={"cursor-help ml-1 " + getAsteriskClass('thumbnail')}>*</span>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top" className="w-auto px-2 py-1 text-xs">
                                                                {getFieldError('thumbnail') || 'Bắt buộc'}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </Label>
                                                    <ThumbnailUpload
                                                        value={values.thumbnail}
                                                        onChange={(file) => setFieldValue('thumbnail', file)}
                                                    />
                                                    {((touched.thumbnail || submitCount > 0) && !isSaveButtonDisabled && errors.thumbnail) && (
                                                        <div className="text-sm text-destructive">{errors.thumbnail}</div>
                                                    )}
                                                </div>
                                                {/* Tags */}
                                                <TagsInput
                                                    value={values.tags}
                                                    onChange={(tags) => setFieldValue('tags', tags)}
                                                />
                                                {/* Quyền riêng tư */}
                                                <div className="space-y-4">
                                                    <Label>Quyền riêng tư</Label>
                                                    <div className="grid gap-4">
                                                        <VisibilitySelector
                                                            value={values.privacy}
                                                            onChange={(value) => setFieldValue('privacy', value)}
                                                        />
                                                    </div>
                                                    {((touched.privacy || submitCount > 0) && !isSaveButtonDisabled && errors.privacy) && (
                                                        <div className="text-sm text-destructive">{errors.privacy}</div>
                                                    )}
                                                </div>
                                                <DialogFooter className="mt-4">
                                                    <Button
                                                        type="submit"
                                                        disabled={isSaveButtonDisabled}
                                                    >
                                                        {isUploadingPending ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Đang upload...
                                                            </>
                                                        ) : isSubmitting ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Đang lưu...
                                                            </>
                                                        ) : (
                                                            'Lưu'
                                                        )}
                                                    </Button>
                                                </DialogFooter>
                                            </Form>
                                        );
                                    }}
                                </Formik>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}