import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useVideo } from "@/hooks/useVideo";
import type { IVideoMetadata } from "@/types/video";
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ArrowLeft, GripVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { SortableTableRow } from "../../components/playlists/SortableTableRow";

export default function PlaylistEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { useGetPlaylistById, useEditVideoPlaylist } = useVideo();

    // Lấy thông tin playlist
    const { data: playlistData, isLoading: loadingPlaylist } = useGetPlaylistById(id!);

    // Mutation
    const editVideoPlaylist = useEditVideoPlaylist();

    // State cho kéo thả
    const [videos, setVideos] = useState<IVideoMetadata[]>([]);
    useEffect(() => {
        if (playlistData?.playlist?.videos) {
            setVideos(playlistData.playlist.videos);
        }
    }, [playlistData?.playlist?.videos]);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState<IVideoMetadata | null>(null);

    const sensors = useSensors(useSensor(PointerSensor));
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = videos.findIndex(v => v.id === active.id);
            const newIndex = videos.findIndex(v => v.id === over?.id);
            const newOrder = arrayMove(videos, oldIndex, newIndex);
            setVideos(newOrder);

            // Gọi API cập nhật thứ tự mới
            editVideoPlaylist.mutate({
                playlistId: id!,
                data: {
                    videos: newOrder,
                }
            });
        }
    };

    const handleOpenDeleteDialog = (video: IVideoMetadata) => {
        setVideoToDelete(video);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (videoToDelete) {
            const newVideos = videos.filter(v => v.id !== videoToDelete.id);
            setVideos(newVideos);
            editVideoPlaylist.mutate({ playlistId: id!, data: { videos: newVideos } });
            console.log('Đã xóa video:', videoToDelete.title);
        }
        setDeleteDialogOpen(false);
        setVideoToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setVideoToDelete(null);
    };

    const handleBack = () => {
        navigate(ROUTES.PLAYLISTS);
    };

    if (loadingPlaylist) return <Skeleton className="h-64 w-full" />;
    if (!playlistData) return <div>Không tìm thấy playlist</div>;

    return (
        <div className="w-full px-6 py-8">
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                </Button>
            </div>

            <h1 className="text-2xl font-bold mb-2">{playlistData.playlist?.title}</h1>
            <p className="text-muted-foreground mb-6">{playlistData.playlist?.description}</p>
            <h2 className="text-xl font-semibold mb-4">Danh sách video ({videos.length})</h2>
            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <img src="https://cdn-icons-png.flaticon.com/512/1179/1179069.png" alt="Empty" className="w-24 h-24 opacity-30 mb-4" />
                    <div>Playlist này chưa có video nào</div>
                </div>
            ) : (
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="w-12 p-3 text-left font-medium text-muted-foreground">
                                        <GripVertical className="w-4 h-4 mx-auto" />
                                    </th>
                                    <th className="w-16 p-3 text-left font-medium text-muted-foreground">#</th>
                                    <th className="w-32 p-3 text-left font-medium text-muted-foreground">Thumbnail</th>
                                    <th className="p-3 text-left font-medium text-muted-foreground">Tiêu đề</th>
                                    <th className="p-3 text-left font-medium text-muted-foreground">Mô tả</th>
                                    <th className="w-24 p-3 text-left font-medium text-muted-foreground">Thời lượng</th>
                                    <th className="w-24 p-3 text-left font-medium text-muted-foreground">Lượt xem</th>
                                    <th className="w-20 p-3 text-center font-medium text-muted-foreground">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                    <SortableContext items={videos.map(v => v.id)} strategy={verticalListSortingStrategy}>
                                        {videos.map((video, idx) => (
                                            <SortableTableRow
                                                key={video.id}
                                                id={video.id}
                                                video={video}
                                                index={idx + 1}
                                                onRemove={() => handleOpenDeleteDialog(video)}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xóa video khỏi playlist</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa video "{videoToDelete?.title}" khỏi playlist này không?
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancelDelete}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

