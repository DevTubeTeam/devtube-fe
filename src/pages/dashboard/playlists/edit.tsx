import PageMeta from '@/components/common/PageMeta';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useVideo } from "@/hooks/useVideo";
import { closestCenter, DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IVideoMetadata } from "../../../types/video";

// Drag and drop helpers
function arrayMove<T>(arr: T[], from: number, to: number): T[] {
    const newArr = arr.slice();
    const [removed] = newArr.splice(from, 1);
    newArr.splice(to, 0, removed);
    return newArr;
}

// SortableItem component for drag and drop
const SortableItem = ({ video, index, onRemove }: { video: IVideoMetadata; index: number; onRemove: (video: IVideoMetadata) => void }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: video.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-4 bg-muted/40 rounded-lg hover:bg-muted/20 transition-colors px-4 py-3 shadow-sm"
        >
            {/* Drag handle */}
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>
            {/* Index */}
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {index + 1}
            </div>
            {/* Thumbnail */}
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-20 h-12 object-cover rounded border flex-shrink-0"
            />
            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="font-medium line-clamp-1">{video.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-1">{video.description}</div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>
                        <svg className="inline w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </span>
                    <span>
                        <svg className="inline w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {video.views >= 1000000
                            ? `${(video.views / 1000000).toFixed(1)}M`
                            : video.views >= 1000
                                ? `${(video.views / 1000).toFixed(1)}K`
                                : video.views}
                    </span>
                </div>
            </div>
            {/* Remove button */}
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(video);
                }}
                className="ml-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 rounded-full p-2 transition-colors"
                title="Xóa video khỏi playlist"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

const DashboardPlaylistsEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        useGetPlaylistById,
        useMyVideos,
        useUpdatePlaylist,
        useEditVideoPlaylist,
    } = useVideo();

    // Lấy thông tin playlist
    const { data: playlistData, isLoading: loadingPlaylist } = useGetPlaylistById(id!);
    // Lấy danh sách video của user
    const { data: myVideos, isLoading: loadingMyVideos } = useMyVideos();

    // State cho form chỉnh sửa
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    // Đổi sang lưu mảng object {id, ...} để dễ reorder
    const [selectedVideos, setSelectedVideos] = useState<IVideoMetadata[]>([]);

    // Mutation
    const updatePlaylist = useUpdatePlaylist();
    const editVideoPlaylist = useEditVideoPlaylist();

    // Dnd sensors - phải đặt ở đây, trước bất kỳ return nào
    const dndSensors = useSensors(
        useSensor(PointerSensor)
    );

    // Khởi tạo state khi có data (chỉ khi id hoặc playlistData thay đổi)
    useEffect(() => {
        const playlist = playlistData?.playlist;
        console.log('playlist', playlist);
        if (playlist) {
            setTitle(playlist.title);
            setDescription(playlist.description);
            setIsPublic(playlist.isPublic);
            // Lưu thứ tự video như trong playlist
            setSelectedVideos(playlist.videos || []);
        }
    }, [playlistData?.playlist?.id]);

    // Xử lý chọn/bỏ chọn video
    const handleToggleVideo = useCallback((video: IVideoMetadata) => {
        setSelectedVideos((prev) => {
            const exists = prev.find((v) => v.id === video.id);
            if (exists) {
                // Bỏ chọn
                return prev.filter((v) => v.id !== video.id);
            } else {
                // Thêm vào cuối
                return [...prev, video];
            }
        });
    }, []);

    // Drag and drop logic
    const dragItemIndex = useRef<number | null>(null);

    // Handle drag end for selected videos
    const handleSelectedVideosDragEnd = useCallback((event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setSelectedVideos((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }, []);

    // Lưu thay đổi
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const playlist = playlistData?.playlist;
        if (!playlist) return;

        try {
            // Kiểm tra xem thông tin playlist có thay đổi không
            const hasPlaylistChanges =
                title !== playlist.title ||
                description !== playlist.description ||
                isPublic !== playlist.isPublic;

            // Chỉ cập nhật thông tin playlist nếu có thay đổi
            if (hasPlaylistChanges) {
                await updatePlaylist.mutateAsync({
                    playlistId: playlist.id,
                    data: { title, description, isPublic },
                });
            }

            // Kiểm tra xem danh sách video có thay đổi không
            const originalVideos = playlist.videos || [];
            const hasVideoChanges = selectedVideos.length !== originalVideos.length ||
                selectedVideos.some((video, index) => video.id !== originalVideos[index]?.id);

            // Chỉ cập nhật danh sách video nếu có thay đổi
            if (hasVideoChanges) {
                await editVideoPlaylist.mutateAsync({
                    playlistId: playlist.id,
                    data: { videos: selectedVideos },
                });
            }

            toast.success("Cập nhật playlist thành công!");
            navigate("/dashboard/playlists");
        } catch (err: any) {
            toast.error("Có lỗi xảy ra khi cập nhật playlist!");
        }
    };

    if (loadingPlaylist || loadingMyVideos) {
        return <Skeleton className="h-64 w-full" />;
    }
    if (!playlistData?.playlist) {
        return <div>Không tìm thấy playlist</div>;
    }

    const videos = myVideos || [];

    // Để biết video nào đã chọn
    const selectedVideoIds = selectedVideos.map((v) => v.id);

    return (
        <>
            <PageMeta
                title={playlistData?.playlist ? `Chỉnh sửa ${playlistData.playlist.title} - DevTube` : "Chỉnh sửa Playlist - DevTube"}
                description="Chỉnh sửa thông tin danh sách phát và quản lý thứ tự video. Thêm, xóa và sắp xếp lại video trong danh sách phát của bạn."
            />
            <div className="w-full max-w-6xl mx-auto py-10 px-2 md:px-0">
                <div className="flex items-center gap-3 mb-8">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/dashboard/playlists")}
                        className="rounded-full"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa Playlist</h1>
                </div>
                <form onSubmit={handleSave} className="space-y-8">
                    <Card className="p-8 shadow-lg border border-muted space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-semibold mb-2 text-muted-foreground">Tên playlist</label>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="text-lg"
                                    placeholder="Nhập tên playlist..."
                                />
                            </div>
                            <div>
                                <label className="block font-semibold mb-2 text-muted-foreground">Mô tả</label>
                                <Input
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Mô tả ngắn về playlist"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                            <Checkbox
                                checked={isPublic}
                                onCheckedChange={(checked) => setIsPublic(Boolean(checked))}
                                id="isPublic"
                            />
                            <label htmlFor="isPublic" className="text-sm font-medium select-none">
                                Công khai playlist
                            </label>
                            <span className="text-xs text-muted-foreground ml-2">
                                (Nếu tắt, chỉ bạn mới xem được playlist này)
                            </span>
                        </div>
                    </Card>

                    <Card className="p-6 shadow-lg border border-muted">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold text-xl">Chọn video cho playlist</h2>
                            <div className="text-sm text-muted-foreground">
                                {selectedVideos.length} video đã chọn
                            </div>
                        </div>

                        {(!videos || videos.length === 0) ? (
                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-lg font-medium mb-2">Chưa có video nào</p>
                                <p className="text-sm text-center max-w-sm">Bạn cần tạo video trước khi có thể thêm vào playlist</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>
                                        Click vào video để chọn/bỏ chọn. Video đã chọn sẽ xuất hiện trong phần thứ tự bên dưới.
                                    </span>
                                </div>

                                {/* Danh sách tất cả video để chọn/bỏ chọn */}
                                <div>
                                    <div className="font-semibold mb-2">Tất cả video của bạn</div>
                                    <ScrollArea className="h-[30rem] w-full rounded-md border">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-4">
                                            {videos.map((video: IVideoMetadata) => {
                                                const checked = selectedVideoIds.includes(video.id);
                                                return (
                                                    <div
                                                        key={video.id}
                                                        className={`relative group cursor-pointer rounded-xl border-2 transition-all duration-200 hover:shadow-md
                                                            ${checked
                                                                ? "border-primary bg-primary/5 shadow-sm"
                                                                : "border-muted hover:border-primary/30 hover:bg-muted/30"
                                                            }`}
                                                        onClick={() => handleToggleVideo(video)}
                                                        tabIndex={0}
                                                        role="button"
                                                        aria-pressed={checked}
                                                    >
                                                        <div className="p-4">
                                                            <div className="flex items-start gap-4">
                                                                <div className="relative flex-shrink-0">
                                                                    <img
                                                                        src={video.thumbnailUrl}
                                                                        alt={video.title}
                                                                        className="w-24 h-16 object-cover rounded-lg shadow-sm"
                                                                    />
                                                                    <div className={`absolute inset-0 rounded-lg border-2 transition-colors
                                                                        ${checked ? "border-primary" : "border-transparent"}`}
                                                                    />
                                                                    {checked && (
                                                                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex-1 min-w-0">
                                                                    <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors">
                                                                        {video.title}
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                                        {video.description}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                        </svg>
                                                                        <span>Video</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Danh sách video đã chọn (có thể kéo thả để reorder) */}
                                {selectedVideos.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="font-semibold text-primary text-base flex items-center gap-2">
                                                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                                </svg>
                                                Thứ tự video trong playlist
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                Kéo thả để sắp xếp lại thứ tự
                                            </span>
                                        </div>
                                        <Card className="overflow-hidden border border-primary/20 shadow-none">
                                            <DndContext sensors={dndSensors} collisionDetection={closestCenter} onDragEnd={handleSelectedVideosDragEnd}>
                                                <SortableContext items={selectedVideos.map(v => v.id)} strategy={verticalListSortingStrategy}>
                                                    <div className="flex flex-col gap-3 p-2">
                                                        {selectedVideos.map((video, idx) => (
                                                            <SortableItem
                                                                key={video.id}
                                                                video={video}
                                                                index={idx}
                                                                onRemove={handleToggleVideo}
                                                            />
                                                        ))}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        )}
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            className="px-10 py-2 text-base font-semibold rounded-lg"
                            disabled={updatePlaylist.isPending || editVideoPlaylist.isPending}
                        >
                            {updatePlaylist.isPending || editVideoPlaylist.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default DashboardPlaylistsEditPage;