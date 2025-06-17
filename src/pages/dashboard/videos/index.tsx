import { Button } from '@/components/ui/button';
import { UploadVideoModal } from '@/components/upload';
import { VideoEmptyState, VideoFilterBar, VideoGrid } from '@/components/video';
import { ROUTES } from '@/constants/routes';
import { useVideo } from '@/hooks/useVideo';
import { Upload } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MyVideosPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    visibility: { public: false, private: false, unlisted: false },
    status: { published: false, processing: false, draft: false },
  });
  const [sortOption, setSortOption] = useState<string>('recent');
  const location = useLocation();
  const navigate = useNavigate();

  const { useMyVideos } = useVideo();
  const { data: myVideos, isLoading: isMyVideosLoading, error } = useMyVideos();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const openUpload = searchParams.get('openUpload');
    if (openUpload === 'true') {
      setIsUploadModalOpen(true);
      navigate(ROUTES.DASHBOARD_VIDEOS, { replace: true });
    }
  }, [location, navigate]);

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const toggleFilter = (type: 'visibility' | 'status', value: string) => {
    setActiveFilters((prev) => {
      if (type === 'visibility') {
        return {
          ...prev,
          visibility: {
            ...prev.visibility,
            [value]: !prev.visibility[value as keyof typeof prev.visibility],
          },
        };
      } else {
        return {
          ...prev,
          status: {
            ...prev.status,
            [value]: !prev.status[value as keyof typeof prev.status],
          },
        };
      }
    });
  };

  const areAnyFiltersActive = () => {
    return (
      Object.values(activeFilters.visibility).some((val) => val) ||
      Object.values(activeFilters.status).some((val) => val)
    );
  };

  const clearAllFilters = () => {
    setActiveFilters({
      visibility: { public: false, private: false, unlisted: false },
      status: { published: false, processing: false, draft: false },
    });
  };

  const filteredAndSortedVideos = useMemo(() => {
    return myVideos
      ?.filter((video) => {
        const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVisibility =
          !areAnyFiltersActive() ||
          (activeFilters.visibility.public && video.privacy === 0) ||
          (activeFilters.visibility.private && video.privacy === 1) ||
          (activeFilters.visibility.unlisted && video.privacy === 2);
        const matchesStatus =
          !areAnyFiltersActive() ||
          (activeFilters.status.published && video.status === 1) ||
          (activeFilters.status.processing && video.status === 2) ||
          (activeFilters.status.draft && video.status === 0);
        return matchesSearch && matchesVisibility && matchesStatus;
      })
      .sort((a, b) => {
        if (sortOption === 'recent') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortOption === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortOption === 'views') return (b.views || 0) - (a.views || 0);
        if (sortOption === 'alpha') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [myVideos, searchQuery, activeFilters, sortOption]);

  console.log('myVideos', myVideos);

  return (
    <div className="container max-w-7xl mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Videos</h1>
          <p className="text-muted-foreground">Manage and upload your videos</p>
        </div>
        <Button onClick={handleOpenUploadModal} className="md:w-auto w-full">
          <Upload className="h-4 w-4 mr-2" />
          Upload video
        </Button>
      </div>

      <VideoFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
        areAnyFiltersActive={areAnyFiltersActive}
        clearAllFilters={clearAllFilters}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      {error ? (
        <div className="text-center py-12">
          <p className="text-red-600">Error loading videos: {error.message}</p>
        </div>
      ) : isMyVideosLoading ? (
        <VideoGrid isLoading={true} videos={[]} />
      ) : filteredAndSortedVideos?.length === 0 ? (
        <VideoEmptyState searchQuery={searchQuery} handleOpenUploadModal={handleOpenUploadModal} />
      ) : (
        <VideoGrid
          isLoading={false}
          videos={filteredAndSortedVideos || []}
        />
      )}

      <UploadVideoModal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal} />
    </div>
  );
};

export default MyVideosPage;