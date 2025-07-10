import PageMeta from "@/components/common/PageMeta";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/useUser";
import { IGetChannelsResponse } from "@/types/auth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Sparkles,
  Users,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const PAGE_SIZE = 20;

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized Channel Card Component
const ChannelCard = ({ channel, index }: { channel: IGetChannelsResponse["channels"][0]; index: number }) => {
  const navigate = useNavigate();
  const { useSubscribeToChannel, useUnsubscribeFromChannel, useIsSubscribed } = useUser();

  const subscribeMutation = useSubscribeToChannel();
  const unsubscribeMutation = useUnsubscribeFromChannel();
  const { data: isSubscribedData } = useIsSubscribed(channel.id);

  const isSubscribed = isSubscribedData?.status || false;
  const isPending = subscribeMutation.isPending || unsubscribeMutation.isPending;

  const handleChannelClick = useCallback(() => {
    navigate(`/channel/${channel.id}`);
  }, [navigate, channel.id]);

  const handleSubscribeToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubscribed) {
      unsubscribeMutation.mutate(channel.id);
    } else {
      subscribeMutation.mutate(channel.id);
    }
  }, [subscribeMutation, unsubscribeMutation, channel.id, isSubscribed]);

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -12, scale: 1.03 }}
      className="group"
    >
      <Card
        className="bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/40 backdrop-blur-xl border-0 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden group-hover:from-white dark:group-hover:from-slate-800 group-hover:shadow-blue-500/20 relative cursor-pointer"
        onClick={handleChannelClick}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="pb-6 pt-8">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar với glow effect */}
            <div className="relative group/avatar">
              {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover/avatar:opacity-30 transition-opacity duration-500" /> */}
              <Avatar
                className="w-20 h-20 ring-4 ring-white/60 dark:ring-slate-700/60 cursor-pointer relative z-10 shadow-xl group-hover/avatar:scale-110 transition-all duration-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleChannelClick();
                }}
              >
                <AvatarImage
                  src={channel.thumbnailUrl || "https://cdn-icons-png.flaticon.com/512/1179/1179069.png"}
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
                  handleChannelClick();
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
                handleChannelClick();
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <Eye className="w-4 h-4 mr-2" />
              Xem kênh
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSubscribeToggle}
              disabled={isPending}
              className={`px-4 py-2.5 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm cursor-pointer disabled:cursor-not-allowed ${isSubscribed
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                : 'bg-white/80 dark:bg-slate-700/80 border-primary/30 dark:border-primary/600 hover:bg-primary/10 dark:hover:bg-primary/20 text-primary hover:text-primary-700 dark:hover:text-primary-300'
                }`}
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSubscribed ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Hủy đăng ký
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Theo dõi
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </CardContent>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Card>
    </motion.div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {Array.from({ length: PAGE_SIZE }).map((_, index) => (
      <Card key={index} className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-0 rounded-3xl shadow-lg overflow-hidden">
        <CardHeader className="pb-6 pt-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-8">
          <div className="text-center mb-8 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-10 w-24 rounded-2xl" />
            <Skeleton className="h-10 w-20 rounded-2xl" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ExplorePage = () => {
  const { useGetChannels } = useUser();

  // State management
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Debounced search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch data with search only
  const { data, isLoading, error } = useGetChannels(
    page,
    PAGE_SIZE,
    debouncedSearchQuery
  );

  // Memoized data extraction
  const { channels, totalCount, totalPages } = useMemo(() => {
    const channelsData: IGetChannelsResponse["channels"] = data?.data?.channels || [];
    const totalCountData: number = data?.data?.totalCount || 0;
    const limitData: number = data?.data?.limit || PAGE_SIZE;
    const totalPagesData = Math.ceil(totalCountData / limitData);

    return {
      channels: channelsData,
      totalCount: totalCountData,
      totalPages: totalPagesData
    };
  }, [data]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery]);

  // Memoized pagination items
  const paginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, page - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === page}
            onClick={() => setPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  }, [page, totalPages]);

  // Callback handlers
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Memoized search results info
  const searchResultsInfo = useMemo(() => {
    if (!debouncedSearchQuery) return null;

    return (
      <div className="text-center mb-6">
        <p className="text-muted-foreground">
          {isLoading ? "Đang tìm kiếm..." : `Tìm thấy ${totalCount} kênh cho "${debouncedSearchQuery}"`}
        </p>
      </div>
    );
  }, [debouncedSearchQuery, isLoading, totalCount]);

  return (
    <>
      <PageMeta
        title="Khám phá kênh - DevTube"
        description="Khám phá các kênh nổi bật, mới nhất và được đề xuất trên DevTube."
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
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  Khám phá kênh
                </h1>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Tìm kiếm và theo dõi các kênh sáng tạo nội dung mà bạn yêu thích. Khám phá các kênh nổi bật, mới nhất và được đề xuất dành riêng cho bạn.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm kênh..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-4 text-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
                  />
                </div>
              </form>
            </div>

            {/* Clear Search Button */}
            {searchQuery && (
              <div className="flex justify-center mb-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSearch}
                  className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 rounded-xl shadow-lg"
                >
                  <X className="w-4 h-4" />
                  Xóa tìm kiếm
                </Button>
              </div>
            )}

            {/* Search Results Info */}
            {searchResultsInfo}
          </motion.div>

          {/* Content Section */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center">
                <Users className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                Không thể tải danh sách kênh
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
                Có lỗi xảy ra khi tải danh sách kênh. Vui lòng thử lại.
              </p>
              <Button
                onClick={() => window.location.reload()}
                size="lg"
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl"
              >
                Thử lại
              </Button>
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
                {debouncedSearchQuery ? 'Không tìm thấy kênh' : 'Chưa có kênh nào'}
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
                {debouncedSearchQuery
                  ? `Không tìm thấy kênh nào cho "${debouncedSearchQuery}". Hãy thử từ khóa khác.`
                  : "Hiện tại chưa có kênh nào được tạo. Hãy quay lại sau."
                }
              </p>
              {debouncedSearchQuery && (
                <Button
                  onClick={handleClearSearch}
                  size="lg"
                  className="px-10 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <X className="w-5 h-5 mr-3" />
                  Xóa tìm kiếm
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              )}
            </motion.div>
          ) : (
            <>
              {/* Enhanced Channel Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12"
              >
                {channels.map((channel, index) => (
                  <ChannelCard key={channel.id} channel={channel} index={index} />
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
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-6 py-3 rounded-xl font-medium transition-all duration-300"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Trước
                  </Button>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, page - 1))}
                          className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>

                      {paginationItems}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(page + 1)}
                          className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
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

export default ExplorePage;
