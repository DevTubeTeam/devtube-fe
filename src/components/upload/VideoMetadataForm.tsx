import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { ThumbnailSelector } from './ThumbnailSelector';
import { VisibilitySelector } from './VisibilitySelector';

interface VideoMetadataFormProps {
    initialData: {
        title: string;
        description: string;
        thumbnail: string;
        playlist: string;
        audience: string;
        visibility: string;
        tags: string[];
        category: string;
    };
    selectedFile: File | null;
    uploadProgress: number;
    onSubmit: (data: any) => void;
}

interface FormValues {
    title: string;
    description: string;
    thumbnail: string;
    playlist: string;
    audience: string;
    visibility: string;
    tags: string[];
    category: string;
}

// Define Yup validation schema
const VideoMetadataSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .max(100, 'Title must be less than 100 characters'),
    description: Yup.string()
        .max(5000, 'Description must be less than 5000 characters'),
    audience: Yup.string()
        .required('Please specify if this content is made for kids'),
    visibility: Yup.string()
        .required('Please select visibility')
});

export const VideoMetadataForm: React.FC<VideoMetadataFormProps> = ({
    initialData,
    selectedFile,
    uploadProgress,
    onSubmit,
}) => {
    const [tagsInput, setTagsInput] = useState('');

    // Generate initial form values from file name if needed
    useEffect(() => {
        if (selectedFile && !initialData.title) {
            const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
            initialData.title = fileName;
        }
    }, [selectedFile, initialData]);

    const handleAddTag = (values: FormValues, setFieldValue: FormikHelpers<FormValues>['setFieldValue']) => (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagsInput.trim()) {
            e.preventDefault();
            const newTag = tagsInput.trim();
            if (!values.tags.includes(newTag)) {
                setFieldValue('tags', [...values.tags, newTag]);
            }
            setTagsInput('');
        }
    };

    const handleRemoveTag = (tag: string, values: FormValues, setFieldValue: FormikHelpers<FormValues>['setFieldValue']) => {
        setFieldValue('tags', values.tags.filter((t: string) => t !== tag));
    };

    const handleThumbnailChange = (thumbnailUrl: string, setFieldValue: FormikHelpers<FormValues>['setFieldValue']) => {
        setFieldValue('thumbnail', thumbnailUrl);
    };

    const playlists = [
        { id: 'none', name: 'None' },
        { id: 'favorites', name: 'Favorites' },
        { id: 'watchLater', name: 'Watch Later' },
        { id: 'newPlaylist', name: '+ Create new playlist' }
    ];

    const categories = [
        'Education', 'Entertainment', 'Gaming', 'Music',
        'Science & Technology', 'Sports', 'Travel', 'Other'
    ];

    return (
        <Formik
            initialValues={initialData}
            validationSchema={VideoMetadataSchema}
            onSubmit={onSubmit}
        >
            {({ values, isValid, setFieldValue }) => (
                <Form className="space-y-6 py-4">
                    {/* Thumbnail selector */}
                    <div className="space-y-2">
                        <Label>Thumbnail</Label>
                        <ThumbnailSelector
                            videoFile={selectedFile}
                            currentThumbnail={values.thumbnail}
                            onChange={(url) => handleThumbnailChange(url, setFieldValue)}
                        />
                        <p className="text-sm text-muted-foreground">
                            Select or upload a picture that shows what's in your video
                        </p>
                    </div>

                    {/* Title */}
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
                                {values.title.length}/100
                            </div>
                        </div>
                    </div>

                    {/* Description */}
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

                    {/* Playlist */}
                    <div className="space-y-2">
                        <Label htmlFor="playlist">Playlist</Label>
                        <Select
                            value={values.playlist}
                            onValueChange={(value) => setFieldValue('playlist', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Add to playlist" />
                            </SelectTrigger>
                            <SelectContent>
                                {playlists.map(playlist => (
                                    <SelectItem key={playlist.id} value={playlist.id}>
                                        {playlist.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Audience - Is this made for kids? */}
                    <div className="space-y-3">
                        <Label>Audience</Label>
                        <p className="text-sm text-muted-foreground">
                            Is this content made for kids? (required)
                        </p>
                        <RadioGroup
                            value={values.audience}
                            onValueChange={(value) => setFieldValue('audience', value)}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="not-for-kids" id="not-for-kids" />
                                <Label htmlFor="not-for-kids">No, it's not made for kids</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="for-kids" id="for-kids" />
                                <Label htmlFor="for-kids">Yes, it's made for kids</Label>
                            </div>
                        </RadioGroup>
                        <div className="text-xs text-red-500">
                            <ErrorMessage name="audience" />
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="space-y-2">
                        <Label>Visibility</Label>
                        <VisibilitySelector
                            value={values.visibility}
                            onChange={(value) => setFieldValue('visibility', value)}
                        />
                        <div className="text-xs text-red-500">
                            <ErrorMessage name="visibility" />
                        </div>
                    </div>

                    {/* Tags */}
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
                                {values.tags.map(tag => (
                                    <div key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center">
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

                    {/* Category */}
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
                                {categories.map(category => (
                                    <SelectItem key={category} value={category.toLowerCase()}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Submit button - enabled when upload progress is at least 50% */}
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={uploadProgress < 50 || !isValid || !values.title || !values.audience}
                        >
                            Next
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
