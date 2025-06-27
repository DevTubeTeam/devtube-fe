import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { ROUTES } from "@/constants/routes";
import { useVideo } from "@/hooks/useVideo";
import videoService from "@/services/video.service";
import { IVideoMetadata, VideoLifecycle, VidPrivacy, VidStatus } from "@/types/video";
import { formatDate, formatDuration, formatViews } from "@/utils/format-video-info.util";
import { motion } from "framer-motion";
import { CalendarDays, Edit2, Eye, MoreVertical, Play, Plus, Trash2, Upload } from "lucide-react";
import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface DashboardVideoCardProps {
    video: IVideoMetadata;
}

const DashboardVideoCard = ({ video }: DashboardVideoCardProps) => {
    const navigate = useNavigate();
    const { usePublishVideo, useGetPlaylists, useEditVideoPlaylist } = useVideo();
    const { mutateAsync: publishVideo, isPending: isPublishing } = usePublishVideo(video.id);
    const { data: playlistsData } = useGetPlaylists();
    const { mutateAsync: editVideoPlaylist, isPending: isAddingToPlaylist } = useEditVideoPlaylist();
    const [isChecking, setIsChecking] = useState(false);

    // State cho dialog thêm vào playlist
    const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

    const handleWatch = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsChecking(true);
        try {
            const res = await videoService.getVideoStatus(video.id);
            if (res.data.status !== VidStatus.READY) {
                toast.error('Video chưa sẵn sàng để xem');
            } else {
                navigate(ROUTES.VIDEO.replace(':videoId', video.id));
            }
        } catch (err) {
            toast.error('Không thể kiểm tra trạng thái video');
        } finally {
            setIsChecking(false);
        }
    };

    const handlePublish = async () => {
        try {
            if (video.status !== VidStatus.READY) {
                toast.error('Video chưa sẵn sàng để xuất bản');
                return;
            }
            await publishVideo();
            toast.success('Xuất bản video thành công');
        } catch (error) {
            toast.error('Không thể xuất bản video');
        }
    };

    // Mở dialog thêm vào playlist
    const handleOpenPlaylistDialog = () => {
        setPlaylistDialogOpen(true);
        setSelectedPlaylists([]); // Reset selection
    };

    // Xử lý checkbox change
    const handlePlaylistToggle = (playlistId: string) => {
        setSelectedPlaylists(prev =>
            prev.includes(playlistId)
                ? prev.filter(id => id !== playlistId)
                : [...prev, playlistId]
        );
    };

    // Thêm video vào các playlist đã chọn
    const handleAddToSelectedPlaylists = async () => {
        if (selectedPlaylists.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một playlist');
            return;
        }

        try {
            // Thêm vào từng playlist đã chọn
            await Promise.all(
                selectedPlaylists.map(playlistId =>
                    editVideoPlaylist({
                        playlistId,
                        data: { videos: [video] }
                    })
                )
            );

            toast.success(`Đã thêm video vào ${selectedPlaylists.length} playlist`);
            setPlaylistDialogOpen(false);
            setSelectedPlaylists([]);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi thêm video vào playlist');
        }
    };

    const getStatusBadge = () => {
        if (video.status === VidStatus.PROCESSING) {
            return (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                    <span className="relative flex items-center">
                        <span className="flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-60"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-neutral-600"></span>
                        </span>
                        <span className="ml-2 text-xs font-medium px-3 py-1 bg-neutral-800 text-white rounded-full border border-neutral-600 shadow">
                            Processing
                        </span>
                    </span>
                </div>
            );
        }
        if (video.lifecycle === VideoLifecycle.DRAFT) {
            return (
                <div className="absolute top-2 left-2 z-10">
                    <span className="text-xs font-medium px-3 py-1 bg-neutral-200 text-neutral-800 rounded-full border border-neutral-400 shadow">
                        Draft
                    </span>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Card className="flex flex-col h-full rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative w-full aspect-[16/9] bg-gray-100">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="relative aspect-video"
                    >
                        <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            {formatDuration(video.duration)}
                        </div>
                        {getStatusBadge()}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <Button
                                size="lg"
                                variant="secondary"
                                onClick={handleWatch}
                                className="rounded-full shadow bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 hover:text-white transition-all duration-200 px-6 py-2 text-base"
                            >
                                <Eye className="h-5 w-5 mr-2" />
                                Watch
                            </Button>
                            <Link to={`${ROUTES.DASHBOARD_EDIT_VIDEO(video.id)}`}>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="rounded-full shadow bg-neutral-200 text-neutral-900 border border-neutral-400 hover:bg-neutral-300 hover:text-neutral-900 transition-all duration-200 px-6 py-2 text-base"
                                >
                                    <Edit2 className="h-5 w-5 mr-2" />
                                    Edit
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
                <CardContent className="flex flex-col flex-1 p-4 justify-between">
                    <div>
                        <h3 className="font-semibold line-clamp-1 text-lg">{video.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">{video.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{formatViews(video.views)}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            <span>{formatDate(video.createdAt)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-4 py-3 bg-muted/30 flex justify-between items-center">
                    <div className="flex items-center">
                        <span
                            className={`
                                text-xs px-2.5 py-1 rounded-full capitalize font-medium
                                ${video.privacy === VidPrivacy.PRIVATE ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                                ${video.privacy === VidPrivacy.PUBLIC ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                                ${video.privacy === VidPrivacy.UNLISTED ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                            `}
                        >
                            {video.privacy === VidPrivacy.PUBLIC ? 'public' : video.privacy === VidPrivacy.PRIVATE ? 'private' : 'unlisted'}
                        </span>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2">
                            {/* Xem video */}
                            <DropdownMenuItem
                                onClick={handleWatch}
                                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted cursor-pointer"
                            >
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-sm">Xem video</div>
                                    <div className="text-xs text-muted-foreground">Mở video để xem</div>
                                </div>
                            </DropdownMenuItem>

                            {/* Xuất bản */}
                            {video.status === VidStatus.READY && video.lifecycle === VideoLifecycle.DRAFT && (
                                <DropdownMenuItem
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted cursor-pointer"
                                >
                                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                        <Upload className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">
                                            {isPublishing ? 'Đang xuất bản...' : 'Xuất bản'}
                                        </div>
                                        <div className="text-xs text-muted-foreground">Công khai video</div>
                                    </div>
                                </DropdownMenuItem>
                            )}

                            {/* Thêm vào playlist */}
                            {playlistsData?.playlists && playlistsData.playlists.length > 0 && (
                                <DropdownMenuItem
                                    onClick={handleOpenPlaylistDialog}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted cursor-pointer"
                                >
                                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">Thêm vào playlist</div>
                                        <div className="text-xs text-muted-foreground">Chọn playlist để thêm</div>
                                    </div>
                                </DropdownMenuItem>
                            )}

                            {/* Edit/Delete */}
                            <DropdownMenuItem asChild>
                                <Link to={`${ROUTES.DASHBOARD_EDIT_VIDEO(video.id)}`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                        <Edit2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">Chỉnh sửa</div>
                                        <div className="text-xs text-muted-foreground">Sửa thông tin video</div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer">
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-sm text-red-600 dark:text-red-400">Xóa video</div>
                                    <div className="text-xs text-muted-foreground">Xóa vĩnh viễn</div>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardFooter>
            </Card>

            {/* Dialog thêm vào playlist */}
            <Dialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Play className="w-5 h-5 text-orange-500" />
                            Thêm vào playlist
                        </DialogTitle>
                        <DialogDescription>
                            Chọn playlist bạn muốn thêm video "{video.title}" vào
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {playlistsData?.playlists?.map((playlist) => (
                            <div
                                key={playlist.id}
                                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => handlePlaylistToggle(playlist.id)}
                            >
                                <Checkbox
                                    id={playlist.id}
                                    checked={selectedPlaylists.includes(playlist.id)}
                                    onCheckedChange={() => handlePlaylistToggle(playlist.id)}
                                />
                                <div className="flex-1 min-w-0">
                                    <label
                                        htmlFor={playlist.id}
                                        className="text-sm font-medium leading-none cursor-pointer block truncate"
                                    >
                                        {playlist.title}
                                    </label>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                        {playlist.description || 'Không có mô tả'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Play className="w-3 h-3" />
                                    <span>{playlist.videos?.length || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setPlaylistDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            onClick={handleAddToSelectedPlaylists}
                            disabled={selectedPlaylists.length === 0 || isAddingToPlaylist}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            {isAddingToPlaylist ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang thêm...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Thêm vào {selectedPlaylists.length} playlist
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default memo(DashboardVideoCard); 