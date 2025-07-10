import PageMeta from '@/components/common/PageMeta';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VideoGrid from "@/components/video/VideoGrid";
import { useVideo } from "@/hooks/useVideo";
import { motion } from "framer-motion";
import { ArrowRight, Bookmark, ChevronLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface Props { }

const SavedPage = (props: Props) => {
    const { useGetSavedVideos } = useVideo();
    const { data: savedVideosData, isLoading, error } = useGetSavedVideos();
    const savedVideos = savedVideosData?.videos || [];

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-600">
                            <Bookmark className="h-5 w-5" />
                            Lỗi tải dữ liệu
                        </CardTitle>
                        <CardDescription>
                            Không thể tải danh sách video đã lưu. Vui lòng thử lại sau.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => window.location.reload()} className="w-full">Thử lại</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title="Video đã lưu - DevTube"
                description="Access your saved videos. View and manage your bookmarked content."
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
                                <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/20">
                                    <Bookmark className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    Video đã lưu
                                </h1>
                            </div>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                {isLoading ? "Đang tải..." : `${savedVideos.length} video đã lưu`}
                            </p>
                        </div>
                    </motion.div>
                    {/* Content Section */}
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {Array.from({ length: 8 }).map((_, index) => (
                                <Card key={index} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 rounded-2xl shadow-lg overflow-hidden">
                                    <CardHeader className="pb-6">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="w-16 h-16 rounded-2xl" />
                                            <div className="flex-1">
                                                <Skeleton className="h-5 w-3/4 mb-3" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-2/3 mb-4" />
                                        <div className="flex justify-between items-center">
                                            <Skeleton className="h-8 w-20 rounded-full" />
                                            <Skeleton className="h-9 w-24 rounded-xl" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </motion.div>
                    ) : savedVideos.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center">
                                <Sparkles className="w-16 h-16 text-blue-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                                Chưa có video nào được lưu
                            </h3>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
                                Khi bạn lưu video, chúng sẽ xuất hiện ở đây để bạn dễ dàng tìm lại.
                            </p>
                            <Link to="/explore">
                                <Button
                                    size="lg"
                                    className="px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <ArrowRight className="w-5 h-5 mr-3" />
                                    Khám phá video
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <VideoGrid isLoading={isLoading} videos={savedVideos} />
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SavedPage;