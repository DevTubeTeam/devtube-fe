import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { ROUTES } from "@/constants/routes";
import { useVideo } from "@/hooks/useVideo";
import { IVideoMetadata } from "@/types/video";
import { formatDate, formatDuration, formatViews } from "@/utils/format-video-info.util";
import { motion } from "framer-motion";
import { CalendarDays, Eye, MoreVertical, Play, Plus } from "lucide-react";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardVideoCard from "./DashboardVideoCard";

interface VideoCardProps {
    video: IVideoMetadata;
    showEditDelete?: boolean;
    showAddToPlaylist?: boolean;
}

const VideoCard = ({ video, showEditDelete = false, showAddToPlaylist = false }: VideoCardProps) => {
    // Nếu showEditDelete = true, render DashboardVideoCard
    if (showEditDelete) {
        return <DashboardVideoCard video={video} />;
    }

    // Nếu showAddToPlaylist = true, render VideoCard với chức năng thêm vào playlist
    if (showAddToPlaylist) {
        return <VideoCardWithPlaylist video={video} />;
    }

    // VideoCard cơ bản cho các trang public
    if (
        video.statusDetail === 'VIDEO_NOT_READY' ||
        video.statusDetail === 'VIDEO_MISSING_URL' ||
        video.statusDetail === 'VIDEO_NOT_READY_OR_MISSING_URL' ||
        video.statusDetail === 'VIDEO_NOT_PUBLISHED'
    ) {
        return null;
    }

    return (
        <Card className="flex flex-col h-full rounded-lg overflow-hidden group shadow hover:shadow-lg transition-all duration-200 min-h-[340px]">
            <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                />
                {/* Overlay desktop */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center md:flex">
                    <Link to={ROUTES.VIDEO.replace(':videoId', video.id)}>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full shadow bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 hover:text-white px-4 py-1 text-sm"
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            Watch
                        </Button>
                    </Link>
                </div>
                {/* Overlay mobile */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center md:hidden">
                    <Link to={ROUTES.VIDEO.replace(':videoId', video.id)}>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full shadow bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 hover:text-white px-4 py-1 text-sm"
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            Xem
                        </Button>
                    </Link>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                </div>
            </div>
            <CardContent className="flex-1 flex flex-col p-3">
                <Link to={ROUTES.VIDEO.replace(':videoId', video.id)}>
                    <h3 className="font-semibold line-clamp-2 text-base hover:text-primary transition-colors">
                        {video.title}
                    </h3>
                </Link>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {video.description}
                </p>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center"><Eye className="h-3 w-3 mr-1" />{formatViews(video.views)}</span>
                    <span className="flex items-center"><CalendarDays className="h-3 w-3 mr-1" />{formatDate(video.createdAt)}</span>
                </div>
            </CardContent>
        </Card>
    );
};

// VideoCard với chức năng thêm vào playlist
const VideoCardWithPlaylist = ({ video }: { video: IVideoMetadata }) => {
    const { useGetPlaylists, useEditVideoPlaylist } = useVideo();
    const { data: playlistsData } = useGetPlaylists();
    const { mutateAsync: editVideoPlaylist, isPending: isAddingToPlaylist } = useEditVideoPlaylist();

    const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
    const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

    const handleOpenPlaylistDialog = () => {
        setPlaylistDialogOpen(true);
        setSelectedPlaylists([]);
    };

    const handlePlaylistToggle = (playlistId: string) => {
        setSelectedPlaylists(prev =>
            prev.includes(playlistId)
                ? prev.filter(id => id !== playlistId)
                : [...prev, playlistId]
        );
    };

    const handleAddToSelectedPlaylists = async () => {
        if (selectedPlaylists.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một playlist');
            return;
        }

        try {
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

    return (
        <>
            <Card className="flex flex-col h-full rounded-xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300">
                <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-t-lg overflow-hidden">
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

                        {/* Overlay khi hover - chỉ hiện nút Watch */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Link to={ROUTES.VIDEO.replace(':videoId', video.id)}>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="rounded-full shadow bg-neutral-900 text-white border border-neutral-700 hover:bg-neutral-800 hover:text-white transition-all duration-200 px-6 py-2 text-base"
                                >
                                    <Eye className="h-5 w-5 mr-2" />
                                    Watch
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                <CardContent className="flex flex-col flex-1 p-4 justify-between">
                    <div>
                        <Link to={ROUTES.VIDEO.replace(':videoId', video.id)}>
                            <h3 className="font-semibold line-clamp-1 text-lg hover:text-primary transition-colors">
                                {video.title}
                            </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5">
                            {video.description}
                        </p>
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
                    {/* Dropdown menu chỉ có chức năng thêm vào playlist */}
                    {playlistsData?.playlists && playlistsData.playlists.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2">
                                <DropdownMenuItem asChild>
                                    <Link to={ROUTES.VIDEO.replace(':videoId', video.id)} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted">
                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                            <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">Xem video</div>
                                            <div className="text-xs text-muted-foreground">Mở video để xem</div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>

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
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
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

export default memo(VideoCard);