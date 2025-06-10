import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IUpdateVideoMetadataRequest, IVideoFile, VidPrivacy, VideoLifecycle } from '@/types/video';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { ThumbnailSelector } from './ThumbnailSelector';
import { VisibilitySelector } from './VisibilitySelector';

interface VideoMetadataFormProps {
    initialData: Partial<IUpdateVideoMetadataRequest>;
    file: IVideoFile | null;
    videoId: string;
    onSubmit: (data: IUpdateVideoMetadataRequest) => void;
    onCancel?: () => void;
    isUploading?: boolean;
}

interface FormValues extends IUpdateVideoMetadataRequest {
    tagsInput?: string;
}

const VideoMetadataSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .max(100, 'Title must be less than 100 characters'),
    description: Yup.string().max(5000, 'Description must be less than 5000 characters'),
    category: Yup.string(),
    privacy: Yup.number().oneOf([VidPrivacy.PUBLIC, VidPrivacy.PRIVATE, VidPrivacy.UNLISTED]),
    tags: Yup.array().of(Yup.string())
});

export const VideoMetadataForm: React.FC<VideoMetadataFormProps> = ({
    initialData,
    file,
    videoId,
    onSubmit,
    onCancel,
    isUploading
}) => {
    const [tagsInput, setTagsInput] = useState('');

    const safeInitialValues: FormValues = {
        title: initialData.title || '',
        description: initialData.description || '',
        thumbnailUrl: initialData.thumbnailUrl || '',
        tags: initialData.tags || [],
        category: initialData.category || '',
        privacy: initialData.privacy || VidPrivacy.PRIVATE,
        publishAt: initialData.publishAt || '',
        lifecycle: initialData.lifecycle || VideoLifecycle.DRAFT,
        tagsInput: ''
    };

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

    const handleAddTag = (
        values: FormValues,
        setFieldValue: FormikHelpers<FormValues>['setFieldValue']
    ) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagsInput.trim()) {
            e.preventDefault();
            const newTag = tagsInput.trim();
            if (!values.tags?.includes(newTag)) {
                setFieldValue('tags', [...(values.tags || []), newTag]);
            }
            setTagsInput('');
        }
    };

    const handleRemoveTag = (
        tag: string,
        values: FormValues,
        setFieldValue: FormikHelpers<FormValues>['setFieldValue']
    ) => {
        setFieldValue('tags', values.tags?.filter((t: string) => t !== tag));
    };

    const handleSubmit = useCallback(
        (values: FormValues, actions: FormikHelpers<FormValues>) => {
            const data: IUpdateVideoMetadataRequest = {
                title: values.title,
                description: values.description,
                thumbnailUrl: values.thumbnailUrl,
                tags: values.tags,
                category: values.category,
                privacy: values.privacy,
                publishAt: values.publishAt,
                lifecycle: initialData.lifecycle || VideoLifecycle.DRAFT
            };

            // Mock data handling
            console.log('Mock saving metadata:', data);
            toast.success('Metadata saved successfully (mock)');

            // Call onSubmit to move to the next step in UploadModal
            onSubmit(data);
            actions.setSubmitting(false);
        },
        [onSubmit, initialData]
    );

    const handleUploadThumbnail = (thumbnailFile: File, setFieldValue: any) => {
        // Mock thumbnail upload
        console.log('Mock uploading thumbnail:', thumbnailFile.name);

        // Simulate successful upload with a mock URL
        setTimeout(() => {
            const mockThumbnailUrl = `https://example.com/thumbnails/mock-${Date.now()}.jpg`;
            setFieldValue('thumbnailUrl', mockThumbnailUrl);
            toast.success('Thumbnail uploaded (mock)');
        }, 1000);
    };

    return (
        <Formik
            initialValues={safeInitialValues}
            validationSchema={VideoMetadataSchema}
            onSubmit={handleSubmit}
        >
            {({ values, isValid, setFieldValue, isSubmitting }) => (
                <Form className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Thumbnail</Label>
                        <ThumbnailSelector
                            videoFile={file}
                            currentThumbnail={values.thumbnailUrl || ''}
                            onChange={(url) => setFieldValue('thumbnailUrl', url)}
                            onUpload={(thumbnailFile) => handleUploadThumbnail(thumbnailFile, setFieldValue)}
                        />
                        <p className="text-sm text-muted-foreground">
                            Select or upload a picture that shows what's in your video
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title (required)</Label>
                        <Field
                            as={Input}
                            id="title"
                            name="title"
                            placeholder="Add a title that describes your video"
                            maxLength={100}
                        />
                        <div className="flex justify-between">
                            <div className="text-xs text-red-500">
                                <ErrorMessage name="title" />
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                                {values.title && values.title.length}/100
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Field
                            as={Textarea}
                            id="description"
                            name="description"
                            placeholder="Tell viewers about your video"
                            rows={4}
                        />
                        <div className="text-xs text-red-500">
                            <ErrorMessage name="description" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Visibility</Label>
                        <VisibilitySelector
                            value={String(values.privacy)}
                            onChange={(value) =>
                                setFieldValue('privacy', VidPrivacy[value.toUpperCase() as keyof typeof VidPrivacy])
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <div>
                            <Input
                                id="tagsInput"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                onKeyDown={handleAddTag(values, setFieldValue)}
                                placeholder="Add tags (press Enter after each tag)"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {values.tags && values.tags.map((tag: string) => (
                                    <div
                                        key={tag}
                                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag, values, setFieldValue)}
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
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={values.category}
                            onValueChange={(value) => setFieldValue('category', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
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

                    <div className="flex justify-between">
                        {isUploading && onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                                Cancel Upload
                            </Button>
                        )}
                        <Button className='text-right' type="submit" disabled={!isValid || isSubmitting || !values.title}>
                            {isUploading ? 'Save Details' : 'Next'}
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
