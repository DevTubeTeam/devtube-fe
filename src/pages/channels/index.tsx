import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { IChannel } from "@/types/auth";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Bell,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Eye,
    Heart,
    Play,
    Search,
    Sparkles,
    Users,
    X
} from "lucide-react";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

interface Props { }

const ChannelListPage = (props: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const limit = 12; // Số channel hiển thị mỗi trang
    const navigate = useNavigate();

    const { useGetSubscribedChannels, useUnsubscribeFromChannel } = useUser();
    const {
        data: subscribedChannelsData,
        isLoading,
        error,
        refetch
    } = useGetSubscribedChannels(currentPage, limit);

    const unsubscribeMutation = useUnsubscribeFromChannel();

    const channels = subscribedChannelsData?.data?.channels || [];
    const totalCount = subscribedChannelsData?.data?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Filter channels based on search query
    const filteredChannels = channels.filter((channel: IChannel) =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is handled by filtering locally
    };

    const handleUnsubscribe = useCallback((channelId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        unsubscribeMutation.mutate(channelId);
    }, [unsubscribeMutation]);

    const handleChannelClick = useCallback((channelId: string) => {
        navigate(`/channel/${channelId}`);
    }, [navigate]);

    const formatSubscribers = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    const formatJoinDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long'
        });
    };

    if (error) {
        return (
            <div className="min-h-screen">
                <div className="container mx-auto py-16 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                            <Users className="w-12 h-12 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                            Không thể tải danh sách kênh
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
                            Có lỗi xảy ra khi tải danh sách kênh đã đăng ký. Vui lòng thử lại.
                        </p>
                        <Button
                            onClick={() => refetch()}
                            size="lg"
                            className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl"
                        >
                            Thử lại
                        </Button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <>
            <PageMeta
                title={"Kênh đã đăng ký - DevTube"}
                description="View channel details, videos, and playlists. Subscribe to your favorite channels and stay updated."
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
                                <div className="p-3 rounded-2xl bg-primary">
                                    <Heart className="w-8 h-8 text-primary-foreground" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                                    Kênh đã đăng ký
                                </h1>
                            </div>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                {totalCount > 0
                                    ? `Bạn đã đăng ký ${totalCount} kênh tuyệt vời`
                                    : "Bắt đầu hành trình khám phá với những kênh yêu thích"
                                }
                            </p>
                        </div>

                        {/* Enhanced Search Bar */}
                        <div className="max-w-md mx-auto">
                            <form onSubmit={handleSearch} className="relative">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <Input
                                        type="text"
                                        placeholder="Tìm kiếm kênh yêu thích..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 pr-4 py-4 text-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
                                    />
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    {isLoading ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                        >
                            {Array.from({ length: limit }).map((_, index) => (
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
                    ) : channels.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-3xl flex items-center justify-center">
                                <Sparkles className="w-16 h-16 text-blue-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                                Chưa đăng ký kênh nào
                            </h3>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
                                Bắt đầu hành trình khám phá và đăng ký những kênh yêu thích để xem nội dung mới nhất từ các creator tuyệt vời.
                            </p>
                            <Link to="/explore">
                                <Button
                                    size="lg"
                                    className="px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Play className="w-5 h-5 mr-3" />
                                    Khám phá kênh
                                    <ArrowRight className="w-5 h-5 ml-3" />
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            {/* Enhanced Channel Grid */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
                            >
                                {filteredChannels.map((channel: IChannel, index) => (
                                    <motion.div
                                        key={channel.id}
                                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ y: -12, scale: 1.03 }}
                                        className="group"
                                    >
                                        <Card className="bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 backdrop-blur-xl border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden group-hover:from-white dark:group-hover:from-slate-800 group-hover:shadow-blue-500/20 relative cursor-pointer"
                                            onClick={() => handleChannelClick(channel.id)}
                                        >
                                            {/* Badge ở góc phải trên */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 px-3 py-1.5 rounded-full font-semibold text-xs shadow-lg backdrop-blur-sm"
                                                >
                                                    <Bell className="w-3 h-3 mr-1.5" />
                                                    Đã đăng ký
                                                </Badge>
                                            </div>

                                            {/* Background Pattern */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <CardHeader className="pb-6 pt-8">
                                                <div className="flex flex-col items-center text-center space-y-4">
                                                    {/* Avatar với glow effect */}
                                                    <div className="relative group/avatar">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-500" />
                                                        <Avatar
                                                            className="w-20 h-20 ring-4 ring-white/60 dark:ring-slate-700/60 cursor-pointer relative z-10 shadow-xl group-hover/avatar:scale-110 transition-all duration-500"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleChannelClick(channel.id);
                                                            }}
                                                        >
                                                            <AvatarImage
                                                                src={channel.thumbnailUrl}
                                                                alt={channel.name}
                                                                className="object-cover"
                                                            />
                                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-xl">
                                                                {channel.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </div>

                                                    {/* Channel Info */}
                                                    <div className="space-y-2">
                                                        <h3
                                                            className="font-bold text-xl text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 group-hover:underline cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleChannelClick(channel.id);
                                                            }}
                                                        >
                                                            {channel.name}
                                                        </h3>
                                                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>Tham gia {formatJoinDate(channel.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="pt-0 pb-8">
                                                {/* Description */}
                                                <div className="text-center mb-8">
                                                    <p className="text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed text-sm">
                                                        {channel.description || 'Không có mô tả cho kênh này'}
                                                    </p>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center justify-center gap-3">
                                                    <Button
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleChannelClick(channel.id);
                                                        }}
                                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Xem kênh
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={(e) => handleUnsubscribe(channel.id, e)}
                                                        disabled={unsubscribeMutation.isPending}
                                                        className="bg-white/80 dark:bg-slate-700/80 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-4 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed"
                                                    >
                                                        {unsubscribeMutation.isPending ? (
                                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <>
                                                                <X className="w-4 h-4 mr-2" />
                                                                Hủy đăng ký
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardContent>

                                            {/* Bottom accent */}
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Enhanced Pagination */}
                            {totalPages > 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center justify-center gap-3"
                                >
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                                    >
                                        <ChevronLeft className="w-5 h-5 mr-2" />
                                        Trước
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="lg"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-12 h-12 p-0 rounded-xl font-bold transition-all duration-300 ${currentPage === pageNum
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                                                        : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                                    >
                                        Sau
                                        <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ChannelListPage;