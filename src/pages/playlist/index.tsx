import PageMeta from '@/components/common/PageMeta';
import { PlaylistCard } from "@/components/playlists/PlaylistCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useVideo } from "@/hooks/useVideo";
import { useState } from "react";

const PlaylistPage = () => {
    const { useGetPlaylists, useCreatePlaylist } = useVideo();
    const { data, isLoading } = useGetPlaylists();
    const createPlaylist = useCreatePlaylist();

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    const handleCreate = () => {
        createPlaylist.mutate(
            { title, description, isPublic },
            {
                onSuccess: () => {
                    setOpen(false);
                    setTitle("");
                    setDescription("");
                    setIsPublic(true);
                },
            }
        );
    };

    return (
        <>
            <PageMeta
                title="My Playlists - DevTube"
                description="Create and manage your video playlists. Organize your favorite videos into custom collections."
            />
            <div className="container mx-auto py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Playlists của bạn</h1>
                    <Button onClick={() => setOpen(true)}>Tạo playlist mới</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-lg" />
                        ))
                        : data?.playlists?.length
                            ? data.playlists.map((playlist) => (
                                <PlaylistCard key={playlist.id} playlist={playlist} />
                            ))
                            : <div>Không có playlist nào.</div>
                    }
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tạo playlist mới</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            <Input
                                placeholder="Tên playlist"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="mb-2"
                            />
                            <Input
                                placeholder="Mô tả"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="mb-2"
                            />
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={e => setIsPublic(e.target.checked)}
                                />
                                Công khai
                            </label>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} disabled={!title || createPlaylist.isPending}>
                                {createPlaylist.isPending ? "Đang tạo..." : "Tạo"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default PlaylistPage;