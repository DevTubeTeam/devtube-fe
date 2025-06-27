import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IPlaylist } from "@/types/video";
import { ListVideo } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaylistCardProps {
    playlist: IPlaylist;
    to?: string; // optional custom link
}

export function PlaylistCard({ playlist, to }: PlaylistCardProps) {

    console.log(playlist)
    // Lấy thumbnail video đầu tiên nếu có, nếu không dùng thumbnailUrl hoặc icon
    const hasVideos = playlist.videos && playlist.videos.length > 0;
    const thumbnail =
        hasVideos
            ? playlist.videos[0].thumbnailUrl
            : playlist.thumbnailUrl || "";

    return (
        <Card className="group overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
            <div className="relative w-full aspect-[16/9] bg-gray-100 flex items-center justify-center">
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={playlist.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                        <ListVideo className="w-16 h-16" />
                    </div>
                )}
                {/* Overlay icon playlist */}
                <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1">
                    <ListVideo className="w-5 h-5 text-white" />
                </div>
                {/* Số lượng video */}
                <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                    {playlist.videos?.length || 0} videos
                </div>
                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Link to={to || `/playlist/${playlist.id}`}>
                        <Button size="sm" variant="secondary" className="shadow">
                            Xem playlist
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="font-semibold text-lg line-clamp-1">{playlist.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{playlist.description}</p>
            </div>
        </Card>
    );
}
