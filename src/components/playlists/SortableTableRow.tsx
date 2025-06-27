import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { IVideoMetadata } from "../../types/video";
import { Button } from "../ui/button";

export function SortableTableRow({ id, video, index, onRemove }: {
    id: string;
    video: IVideoMetadata;
    index: number;
    onRemove: () => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.7 : 1,
        background: isDragging ? "#f3f4f6" : undefined,
    };

    if (!video) return null;

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatViews = (views: number) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K`;
        }
        return views.toString();
    };

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
            <td className="p-3">
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
            </td>
        </tr>
    );
}
