import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import videoService from "../../services/video.service";
import { IVideoMetadata, VidStatus } from "../../types/video";
import { formatDuration, formatViews } from "../../utils/format-video-info.util";
import { Button } from "../ui/button";

export function SortableTableRow({ id, video, index, onRemove }: {
    id: string;
    video: IVideoMetadata;
    index: number;
    onRemove: () => void
}) {
    const navigate = useNavigate();
    const [isChecking, setIsChecking] = useState(false);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });


    const handleWatch = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Check statusDetail first
        if (video.statusDetail === 'VIDEO_NOT_READY') {
            toast.error('Video đang được xử lý, vui lòng quay lại sau.');
            return;
        }
        if (video.statusDetail === 'VIDEO_MISSING_URL') {
            toast.error('Video hiện không có đường dẫn phát, vui lòng thử lại sau.');
            return;
        }
        if (video.statusDetail === 'VIDEO_NOT_READY_OR_MISSING_URL') {
            toast.error('Video chưa được xử lý xong. Vui lòng quay lại sau.');
            return;
        }
        if (video.statusDetail === 'VIDEO_NOT_PUBLISHED') {
            toast.error('Video chưa được xuất bản, hãy xuất bản video trước khi xem.');
            return;
        }

        setIsChecking(true);
        try {
            const res = await videoService.getVideoStatus(video.id);
            if (res.data.status !== VidStatus.READY) {
                toast.error('Video chưa sẵn sàng để xem');
            } else {
                navigate(`/video/${video.id}`);
            }
        } catch (err) {
            toast.error('Không thể kiểm tra trạng thái video');
        } finally {
            setIsChecking(false);
        }
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
        background: isDragging ? "#f3f4f6" : undefined,
    };

    if (!video) return null;



    return (
        <tr
            ref={setNodeRef}
            style={style}
            className="border-b hover:bg-muted/30 transition-colors"
        >
            <td className="p-3">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary transition-colors"
                    title="Kéo để di chuyển"
                >
                    <GripVertical className="w-4 h-4" />
                </div>
            </td>
            <td className="p-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    {index}
                </div>
            </td>
            <td className="p-3">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-20 h-12 object-cover rounded border"
                />
            </td>
            <td className="p-3">
                <div className="font-medium line-clamp-1 max-w-xs">{video.title}</div>
            </td>
            <td className="p-3">
                <div className="text-sm text-muted-foreground line-clamp-1 max-w-xs">{video.description}</div>
            </td>
            <td className="p-3">
                <div className="text-sm">{formatDuration(video.duration)}</div>
            </td>
            <td className="p-3">
                <div className="text-sm text-muted-foreground">{formatViews(video.views)}</div>
            </td>
            <td className="p-3 flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-950/20"
                    title="Xóa video khỏi playlist"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWatch}
                    disabled={isChecking}
                    className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    title={isChecking ? "Đang kiểm tra..." : "Xem video"}
                >
                    <Eye className="w-4 h-4" />
                </Button>
            </td>
        </tr>
    );
}
