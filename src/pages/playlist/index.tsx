import PageMeta from '@/components/common/PageMeta';
import { PlaylistCard } from "@/components/playlists/PlaylistCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useVideo } from "@/hooks/useVideo";
import { motion } from "framer-motion";
import { ChevronLeft, ListVideo, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

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
                title="Danh sách Playlist - DevTube"
                description="Create and manage your video playlists. Organize your favorite videos into custom collections."
            />
            <div className="min-h-screen">
                <div className="container mx-auto py-8 px-4">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <Link
                                to="/"
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span>Quay lại</span>
                            </Link>
                        </div>
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-3 mb-4">
                                <div className="p-3 rounded-2xl bg-yellow-100 dark:bg-yellow-900/20">
                                    <ListVideo className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-pink-500 dark:from-yellow-400 dark:to-pink-400 bg-clip-text text-transparent">
                                    Playlist của bạn
                                </h1>
                            </div>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Tạo, quản lý và sắp xếp các playlist video yêu thích của bạn.
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <Button onClick={() => setOpen(true)} size="lg" className="px-8 py-3 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Tạo playlist mới
                            </Button>
                        </div>
                    </motion.div>
                    {/* Content Section */}
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
                            ))}
                        </motion.div>
                    ) : data?.playlists?.length ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
                        >
                            {data.playlists.map((playlist) => (
                                <PlaylistCard key={playlist.id} playlist={playlist} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-yellow-100 via-pink-100 to-pink-200 dark:from-yellow-900/30 dark:via-pink-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center">
                                <Sparkles className="w-16 h-16 text-yellow-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                                Bạn chưa có playlist nào
                            </h3>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
                                Hãy tạo playlist để lưu trữ và sắp xếp các video yêu thích của bạn một cách dễ dàng.
                            </p>
                            <Button
                                onClick={() => setOpen(true)}
                                size="lg"
                                className="px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                            >
                                <Plus className="w-5 h-5" />
                                Tạo playlist mới
                            </Button>
                        </motion.div>
                    )}
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
            </div>
        </>
    );
};

export default PlaylistPage;