import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { ROUTES } from "@/constants/routes";
import { useVideo } from "@/hooks/useVideo";
import videoService from "@/services/video.service";
import { IVideoMetadata, VideoLifecycle, VidPrivacy, VidStatus } from "@/types/video";
import { formatDate, formatDuration, formatViews } from "@/utils/format-video-info.util";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { CalendarDays, Edit2, Eye, MoreVertical, Trash2, Upload } from "lucide-react";
import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface VideoCardProps {
    video: IVideoMetadata;
}

const VideoCard = ({ video }: VideoCardProps) => {
    const navigate = useNavigate();
    const { usePublishVideo } = useVideo();
    const { mutateAsync: publishVideo, isPending: isPublishing } = usePublishVideo(video.id);
    const [isChecking, setIsChecking] = useState(false);

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
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                            <Button
                                variant="ghost"
                                className="w-full justify-start px-2"
                                onClick={handleWatch}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to={`${ROUTES.DASHBOARD_EDIT_VIDEO(video.id)}`} className="flex items-center w-full">
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        {video.status === VidStatus.READY && video.lifecycle === VideoLifecycle.DRAFT && (
                            <DropdownMenuItem onClick={handlePublish} disabled={isPublishing}>
                                <div className="flex items-center w-full">
                                    <Upload className="h-4 w-4 mr-2" />
                                    {isPublishing ? 'Đang xuất bản...' : 'Xuất bản'}
                                </div>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                            <div className="flex items-center w-full">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
};

export default memo(VideoCard);