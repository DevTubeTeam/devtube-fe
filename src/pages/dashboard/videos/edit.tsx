import PageMeta from '@/components/common/PageMeta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import VideoPlayerPreview from '@/components/video/VideoPlayerPreview';
import { useUpload } from '@/hooks/useUpload';
import { useVideo } from '@/hooks/useVideo';
import { VidPrivacy, VidStatus } from '@/types/video';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { AlertCircle, BadgeCheck, Copy, Loader2, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const CATEGORIES = [
  'Education', 'Entertainment', 'Gaming', 'Music', 'Science & Technology', 'Sports', 'Travel', 'Other'
];

const VideoMetadataSchema = Yup.object().shape({
  title: Yup.string().required('Tiêu đề là bắt buộc').max(100, 'Tiêu đề không được vượt quá 100 ký tự'),
  description: Yup.string().max(5000, 'Mô tả không được vượt quá 5000 ký tự'),
  category: Yup.string().required('Danh mục là bắt buộc').oneOf(CATEGORIES, 'Danh mục không hợp lệ'),
  tags: Yup.array().of(Yup.string()).max(10, 'Tối đa 10 tags'),
  privacy: Yup.number().oneOf([VidPrivacy.PUBLIC, VidPrivacy.PRIVATE, VidPrivacy.UNLISTED]).required('Quyền riêng tư là bắt buộc'),
});

const PRIVACY_LABELS: Record<VidPrivacy, string> = {
  [VidPrivacy.PUBLIC]: 'Công khai',
  [VidPrivacy.PRIVATE]: 'Riêng tư',
  [VidPrivacy.UNLISTED]: 'Không công khai',
  [VidPrivacy.UNRECOGNIZED]: 'Không xác định',
};

const STATUS_LABELS = {
  [VidStatus.PENDING]: { label: 'Đang chờ', icon: <Loader2 className="h-4 w-4 animate-spin text-gray-400" />, color: 'text-gray-400' },
  [VidStatus.UPLOADING]: { label: 'Đang tải lên', icon: <Loader2 className="h-4 w-4 animate-spin text-blue-400" />, color: 'text-blue-400' },
  [VidStatus.PROCESSING]: { label: 'Đang xử lý', icon: <AlertCircle className="h-4 w-4 text-yellow-500 animate-pulse" />, color: 'text-yellow-600' },
  [VidStatus.READY]: { label: 'Sẵn sàng', icon: <BadgeCheck className="h-4 w-4 text-green-500" />, color: 'text-green-600' },
  [VidStatus.FAILED]: { label: 'Lỗi', icon: <AlertCircle className="h-4 w-4 text-red-500" />, color: 'text-red-600' },
  [VidStatus.CANCELLED]: { label: 'Đã huỷ', icon: <AlertCircle className="h-4 w-4 text-gray-400" />, color: 'text-gray-400' },
  [VidStatus.UNRECOGNIZED]: { label: 'Không xác định', icon: <AlertCircle className="h-4 w-4 text-gray-400" />, color: 'text-gray-400' },
};
function extractVideoIdFromUrl(url: string): string | null {
  const match = url.match(/processed\/([a-f0-9\-]+)\/index\.m3u8/);
  return match ? match[1] : null;
}

const EditVideoPage = () => {
  const { id: videoId } = useParams();
  const navigate = useNavigate();
  const { useVideoById } = useVideo();
  const { updateVideoMetadata } = useUpload();
  const { data: video, isLoading } = useVideoById(videoId || '');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const linkRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setThumbnail(null);
  }, [videoId]);

  const handleCopy = () => {
    if (linkRef.current) {
      navigator.clipboard.writeText(linkRef.current.value);
      toast.success('Đã copy đường liên kết!');
    }
  };

  const videoWatchId = video?.videoUrl ? extractVideoIdFromUrl(video?.videoUrl) : null;
  const watchUrl = videoWatchId ? `${import.meta.env.VITE_BASE_URL}/video/${videoWatchId}` : '#';

  if (isLoading || !video) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={video ? `Chỉnh sửa ${video.title} - DevTube` : "Chỉnh sửa video - DevTube"}
        description="Chỉnh sửa thông tin video, ảnh đại diện và cài đặt. Cập nhật tiêu đề, mô tả, quyền riêng tư và nhiều hơn nữa."
      />
      <div className="max-w-5xl mx-auto py-8 px-2 md:px-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur flex items-center justify-between mb-8 py-4 px-2 md:px-0 border-b">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded px-3 py-1 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Về trang chủ"
            >
              Trang chủ
            </Link>
            <BadgeCheck className="h-7 w-7 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Chỉnh sửa video</h1>
          </div>
          <Button
            type="submit"
            form="edit-video-form"
            size="lg"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
            Lưu thay đổi
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Formik Form + Thumbnail + Trạng thái */}
          <div className="col-span-2 space-y-8">
            <Card className="p-6 shadow-lg rounded-2xl">
              <CardContent>
                <Formik
                  initialValues={{
                    title: video.title,
                    description: video.description,
                    category: video.category,
                    tags: video.tags || [],
                    privacy: video.privacy
                  }}
                  validationSchema={VideoMetadataSchema}
                  enableReinitialize
                  onSubmit={async (values) => {
                    setIsSaving(true);
                    try {
                      await updateVideoMetadata.mutateAsync({
                        videoId: videoId!,
                        metadata: {
                          title: values.title,
                          description: values.description,
                          category: values.category,
                          tags: values.tags,
                          privacy: values.privacy
                        },
                        thumbnail: thumbnail || undefined
                      });
                      toast.success('Cập nhật video thành công!');
                      navigate('/dashboard/videos');
                    } catch (err) {
                      toast.error('Cập nhật thất bại!');
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                >
                  {({ values, setFieldValue }) => (
                    <Form id="edit-video-form" className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Field as={Input} id="title" name="title" placeholder="Nhập tiêu đề video" />
                        <ErrorMessage name="title" component="div" className="text-sm text-destructive" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Field as={Textarea} id="description" name="description" placeholder="Nhập mô tả video" rows={5} />
                        <ErrorMessage name="description" component="div" className="text-sm text-destructive" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Danh mục</Label>
                        <Select
                          value={values.category}
                          onValueChange={value => setFieldValue('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage name="category" component="div" className="text-sm text-destructive" />
                      </div>
                      {/* Tags input giống UploadVideoModal */}
                      <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                          <Input
                            value={tagInput}
                            onChange={e => setTagInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && tagInput.trim()) {
                                e.preventDefault();
                                if (values.tags.length < 10 && !values.tags.includes(tagInput.trim())) {
                                  setFieldValue('tags', [...values.tags, tagInput.trim()]);
                                  setTagInput('');
                                }
                              }
                            }}
                            placeholder="Nhập tag và nhấn Enter"
                            disabled={values.tags.length >= 10}
                          />
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {values.tags.map((tag: string) => (
                            <div
                              key={tag}
                              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => setFieldValue('tags', values.tags.filter((t: string) => t !== tag))}
                                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{values.tags.length}/10 tags</div>
                      </div>
                      <div className="space-y-2">
                        <Label>Quyền riêng tư</Label>
                        <Select
                          value={String(values.privacy)}
                          onValueChange={value => setFieldValue('privacy', Number(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn quyền riêng tư" />
                          </SelectTrigger>
                          <SelectContent>
                            {[VidPrivacy.PUBLIC, VidPrivacy.PRIVATE, VidPrivacy.UNLISTED].map((v) => (
                              <SelectItem key={v} value={String(v)}>{PRIVACY_LABELS[v]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage name="privacy" component="div" className="text-sm text-destructive" />
                      </div>
                      {/* Thumbnail upload */}
                      <div className="space-y-2">
                        <Label>Ảnh đại diện video</Label>
                        <div className="aspect-video w-full rounded-xl overflow-hidden border bg-muted flex items-center justify-center shadow">
                          {thumbnail ? (
                            <img src={URL.createObjectURL(thumbnail)} alt="thumbnail" className="object-cover w-full h-full" />
                          ) : (
                            <img src={video.thumbnailUrl} alt="thumbnail" className="object-cover w-full h-full" />
                          )}
                        </div>
                        <Input type="file" accept="image/*" onChange={e => {
                          if (e.target.files && e.target.files[0]) setThumbnail(e.target.files[0]);
                        }} />
                      </div>
                      {/* Trạng thái */}
                      <div className="flex items-center gap-2 mt-2">
                        {STATUS_LABELS[video.status]?.icon}
                        <span className={`text-sm font-medium ${STATUS_LABELS[video.status]?.color}`}>{STATUS_LABELS[video.status]?.label}</span>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </div>
          {/* Right: Preview video + link + file name */}
          <Card className="col-span-1 flex flex-col items-center p-4 gap-6 shadow-lg rounded-2xl">
            <CardHeader className="w-full p-0">
              <CardTitle className="text-lg font-semibold mb-2">Preview video</CardTitle>
            </CardHeader>
            {video.videoUrl && (
              <VideoPlayerPreview source={video.videoUrl} poster={video.thumbnailUrl} className="mb-4" />
            )}
            <div className="w-full">
              <Label className="mb-1 block">Đường liên kết video</Label>
              <div className="flex gap-2">
                <input
                  ref={linkRef}
                  value={watchUrl}
                  readOnly
                  className="flex-1 cursor-pointer border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm"
                  onClick={() => watchUrl && window.open(watchUrl, '_blank')}
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Tên tệp: <span className="font-medium">{(video as any).fileName || 'Không xác định'}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EditVideoPage;
