import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown";
import { ROUTES } from "@/constants/routes";
import { IVideoMetadata } from "@/types/video";
import { formatDate, formatDuration, formatViews } from "@/utils/format-video-info.util";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { CalendarDays, Edit2, Eye, MoreVertical, Trash2 } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

interface VideoCardProps {
    video: IVideoMetadata;
}
const VideoCard = ({ video }: VideoCardProps) => {
    return (
        <Card className="overflow-hidden">
            <div className="relative group">
                <img src={video.thumbnailUrl} alt={video.title} className="w-full aspect-video object-cover" loading="lazy" />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                </div>
                {video.status === 2 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium px-3 py-1 bg-orange-500/90 rounded-sm">Processing</span>
                    </div>
                )}
                {video.lifecycle === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-medium px-3 py-1 bg-blue-500/90 rounded-sm">Draft</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link to={`/video/${video.id}`}>
                        <Button size="sm" variant="secondary">
                            <Eye className="h-4 w-4 mr-1.5" />
                            Watch
                        </Button>
                    </Link>
                    <Link to={`${ROUTES.DASHBOARD_EDIT_VIDEO(video.id)}`}>
                        <Button size="sm" variant="secondary">
                            <Edit2 className="h-4 w-4 mr-1.5" />
                            Edit
                        </Button>
                    </Link>
                </div>
            </div>
            <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{video.description}</p>
                <div className="flex justify-between items-center mt-2">
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
            <CardFooter className="px-4 py-2 bg-muted/30 flex justify-between">
                <div className="flex items-center">
                    <span
                        className={`
              text-xs px-2 py-0.5 rounded-full capitalize
              ${video.privacy === 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
              ${video.privacy === 1 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
              ${video.privacy === 2 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
            `}
                    >
                        {video.privacy === 0 ? 'public' : video.privacy === 1 ? 'private' : 'unlisted'}
                    </span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Link to={`/video/${video.id}`} className="flex items-center w-full">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to={`${ROUTES.DASHBOARD_EDIT_VIDEO(video.id)}`} className="flex items-center w-full">
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
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