import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMeta from '@/components/common/PageMeta';
import { useVideo } from '@/hooks/useVideo';
import { IVideoMetadata } from '@/types/video';
import { formatViews } from '@/utils/format-video-info.util';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'vừa xong';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} tuần trước`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} tháng trước`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} năm trước`;
};

const SearchVideoCard = ({ video }: { video: IVideoMetadata }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/video/${video.id}`);
  };

  return (
    <div
      className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative w-[360px] h-[202px] flex-shrink-0">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {video.duration}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {formatViews(video.views)} lượt xem • {formatDate(video.publishAt)}
        </p>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full overflow-hidden">
            <img
              src={video.avatarUrl}
              alt={video.userId}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">{video.displayName}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [page, setPage] = useState(1);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month' | 'year' | 'all'>('all');
  const [selectedSortBy, setSelectedSortBy] = useState<'relevance' | 'date' | 'views'>('relevance');
  const limit = 50;

  const { useGetVideos } = useVideo();
  const { data: videos, isLoading, error } = useGetVideos({
    type: 'search',
    page,
    limit,
    timeRange: selectedTimeRange,
    sortBy: selectedSortBy,
    query,
  });

  // Reset page when search parameters change
  useEffect(() => {
    setPage(1);
  }, [query, selectedTimeRange, selectedSortBy]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-lg animate-pulse">
              <div className="w-[360px] h-[202px] bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-semibold mb-2">Lỗi tải video</h2>
          <p>Vui lòng thử lại sau</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title={`Kết quả tìm kiếm "${query}" - DevTube`}
        description={`Kết quả tìm kiếm cho "${query}" trên DevTube`}
      />
      <div className="container mx-auto px-4 py-8">
        <PageBreadcrumb pageTitle="Kết quả tìm kiếm" />

        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Kết quả tìm kiếm
          <span className="text-blue-600 dark:text-blue-400 ml-2">"{query}"</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Tìm thấy {videos?.totalCount || 0} kết quả
        </p>

        {/* Bộ lọc */}
        <div className="mb-8 flex flex-wrap gap-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <option value="day">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="year">Năm nay</option>
            <option value="all">Tất cả thời gian</option>
          </select>

          <select
            value={selectedSortBy}
            onChange={(e) => setSelectedSortBy(e.target.value as any)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <option value="relevance">Liên quan nhất</option>
            <option value="date">Mới nhất</option>
            <option value="views">Lượt xem</option>
          </select>
        </div>

        {videos?.videos.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Không tìm thấy kết quả</h2>
            <p className="text-gray-600 dark:text-gray-400">Hãy thử từ khóa hoặc bộ lọc khác</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos?.videos.map((video: IVideoMetadata) => (
              <SearchVideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;
