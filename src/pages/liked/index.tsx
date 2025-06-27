import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import VideoGrid from "@/components/video/VideoGrid";
import { useVideo } from "@/hooks/useVideo";
import { motion } from "framer-motion";
import { Heart, HeartOff } from "lucide-react";

interface Props { }

const LikedPage = (props: Props) => {
    const { useGetLikedVideos } = useVideo();
    const { data: likedVideosData, isLoading, error } = useGetLikedVideos();

    const likedVideos = likedVideosData?.videos || [];

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <HeartOff className="h-5 w-5" />
                            Lỗi tải dữ liệu
                        </CardTitle>
                        <CardDescription>
                            Không thể tải danh sách video đã thích. Vui lòng thử lại sau.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full"
                        >
                            Thử lại
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                        <Heart className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Video đã thích
                        </h1>
                        <p className="text-muted-foreground">
                            {isLoading
                                ? "Đang tải..."
                                : `${likedVideos.length} video đã thích`
                            }
                        </p>
                    </div>
                </div>
            </motion.div>

            {!isLoading && likedVideos.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Card className="max-w-md mx-auto text-center">
                        <CardHeader>
                            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <Heart className="h-8 w-8 text-gray-400" />
                            </div>
                            <CardTitle className="text-xl">Chưa có video nào được thích</CardTitle>
                            <CardDescription>
                                Khi bạn thích video, chúng sẽ xuất hiện ở đây để bạn dễ dàng tìm lại.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => window.history.back()}
                                className="w-full"
                                variant="outline"
                            >
                                Khám phá video
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <VideoGrid
                        isLoading={isLoading}
                        videos={likedVideos}
                    />
                </motion.div>
            )}
        </div>
    );
};

export default LikedPage;