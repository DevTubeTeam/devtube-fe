import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { UploadModal } from '@/components/upload/UploadModal';
import { ROUTES } from '@/constants/routes';
import { CalendarDays, Edit2, Eye, Filter, MoreVertical, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Mock data for videos (replace with actual API call later)
interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  views: number;
  uploadDate: string;
  duration: string;
  visibility: 'public' | 'private' | 'unlisted';
  status: 'published' | 'processing' | 'draft';
}

const MyVideosPage = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Replace single filter with multiple filters
  const [activeFilters, setActiveFilters] = useState<{
    visibility: { public: boolean; private: boolean; unlisted: boolean };
    status: { published: boolean; processing: boolean; draft: boolean };
  }>({
    visibility: { public: false, private: false, unlisted: false },
    status: { published: false, processing: false, draft: false }
  });

  const [sortOption, setSortOption] = useState<string>('recent');
  const location = useLocation();
  const navigate = useNavigate();

  // Check for upload modal trigger from query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const openUpload = searchParams.get('openUpload');

    if (openUpload === 'true') {
      setIsUploadModalOpen(true);
      // Remove the query parameter to avoid reopening on refresh
      navigate(ROUTES.DASHBOARD_VIDEOS, { replace: true });
    }
  }, [location, navigate]);

  // Fetch videos (mock data for now)
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, call the API instead of using mock data
        // const response = await api.get(API_ENDPOINTS.VIDEO.GET_ALL);
        // setVideos(response.data.data);        // Mock data
        setTimeout(() => {
          setVideos([
            {
              id: '1',
              title: 'Introduction to React',
              description: 'Learn the basics of React.js and how to build your first app',
              thumbnail: 'https://via.placeholder.com/480x270/6366f1/ffffff?text=React+Tutorial',
              views: 1248,
              uploadDate: '2023-05-15',
              duration: '12:34',
              visibility: 'public',
              status: 'published',
            },
            {
              id: '2',
              title: 'Advanced TypeScript Techniques',
              description: 'Master advanced TypeScript patterns for better type safety',
              thumbnail: 'https://via.placeholder.com/480x270/8b5cf6/ffffff?text=TypeScript+Tutorial',
              views: 845,
              uploadDate: '2023-06-02',
              duration: '24:18',
              visibility: 'public',
              status: 'published',
            },
            {
              id: '3',
              title: 'Node.js API Development',
              description: 'Build a RESTful API using Node.js and Express',
              thumbnail: 'https://via.placeholder.com/480x270/ec4899/ffffff?text=Node.js+Tutorial',
              views: 632,
              uploadDate: '2023-06-10',
              duration: '18:42',
              visibility: 'unlisted',
              status: 'published',
            },
            {
              id: '4',
              title: 'Intro to TailwindCSS',
              description: 'Get started with the popular utility-first CSS framework',
              thumbnail: 'https://via.placeholder.com/480x270/10b981/ffffff?text=TailwindCSS+Tutorial',
              views: 0,
              uploadDate: '2023-06-12',
              duration: '08:56',
              visibility: 'private',
              status: 'processing',
            },
            {
              id: '5',
              title: 'Database Design Fundamentals',
              description: 'Learn how to design efficient and scalable databases for your applications',
              thumbnail: 'https://via.placeholder.com/480x270/f59e0b/ffffff?text=Database+Design',
              views: 0,
              uploadDate: '2023-06-15',
              duration: '15:22',
              visibility: 'private',
              status: 'draft',
            },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);
  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const toggleFilter = (type: 'visibility' | 'status', value: string) => {
    setActiveFilters(prev => {
      if (type === 'visibility') {
        return {
          ...prev,
          visibility: {
            ...prev.visibility,
            [value]: !prev.visibility[value as keyof typeof prev.visibility]
          }
        };
      } else {
        return {
          ...prev,
          status: {
            ...prev.status,
            [value]: !prev.status[value as keyof typeof prev.status]
          }
        };
      }
    });
  };

  const areAnyFiltersActive = () => {
    return Object.values(activeFilters.visibility).some(val => val) ||
      Object.values(activeFilters.status).some(val => val);
  };

  const clearAllFilters = () => {
    setActiveFilters({
      visibility: { public: false, private: false, unlisted: false },
      status: { published: false, processing: false, draft: false }
    });
  };

  const filteredVideos = videos.filter(video => {
    // Filter by search query
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());

    // If no filters are active, show all
    if (!areAnyFiltersActive()) {
      return matchesSearch;
    }

    // Check visibility filters
    const visibilityFilters = activeFilters.visibility;
    const matchesVisibility = visibilityFilters.public && video.visibility === 'public' ||
      visibilityFilters.private && video.visibility === 'private' ||
      visibilityFilters.unlisted && video.visibility === 'unlisted';

    // Check status filters
    const statusFilters = activeFilters.status;
    const matchesStatus = statusFilters.published && video.status === 'published' ||
      statusFilters.processing && video.status === 'processing' ||
      statusFilters.draft && video.status === 'draft';

    // If both filter types are active, match both
    if (Object.values(visibilityFilters).some(val => val) &&
      Object.values(statusFilters).some(val => val)) {
      return matchesSearch && matchesVisibility && matchesStatus;
    }

    // Otherwise, match either visibility or status if one is active
    return matchesSearch && (
      Object.values(visibilityFilters).some(val => val) ? matchesVisibility : true
    ) && (
        Object.values(statusFilters).some(val => val) ? matchesStatus : true
      );
  });
  const sortVideos = (videos: VideoItem[]) => {
    switch (sortOption) {
      case 'recent':
        return [...videos].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      case 'oldest':
        return [...videos].sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
      case 'views':
        return [...videos].sort((a, b) => b.views - a.views);
      case 'alpha':
        return [...videos].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return videos;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatViews = (views: number) => {
    if (views === 0) return '0 views';
    if (views < 1000) return `${views} ${views === 1 ? 'view' : 'views'}`;
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K views`;
    return `${(views / 1000000).toFixed(1)}M views`;
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

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
      </div>      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search your videos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter</span>
                {areAnyFiltersActive() && (
                  <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {Object.values(activeFilters.visibility).filter(Boolean).length +
                      Object.values(activeFilters.status).filter(Boolean).length}
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <h4 className="font-medium text-sm mb-1.5">Visibility</h4>
                <div className="space-y-1">
                  <DropdownMenuCheckboxItem
                    checked={activeFilters.visibility.public}
                    onCheckedChange={() => toggleFilter('visibility', 'public')}
                  >
                    Public
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={activeFilters.visibility.private}
                    onCheckedChange={() => toggleFilter('visibility', 'private')}
                  >
                    Private
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={activeFilters.visibility.unlisted}
                    onCheckedChange={() => toggleFilter('visibility', 'unlisted')}
                  >
                    Unlisted
                  </DropdownMenuCheckboxItem>
                </div>
              </div>

              <DropdownMenuSeparator />

              <div className="p-2">
                <h4 className="font-medium text-sm mb-1.5">Status</h4>
                <div className="space-y-1">
                  <DropdownMenuCheckboxItem
                    checked={activeFilters.status.published}
                    onCheckedChange={() => toggleFilter('status', 'published')}
                  >
                    Published
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={activeFilters.status.processing}
                    onCheckedChange={() => toggleFilter('status', 'processing')}
                  >
                    Processing
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={activeFilters.status.draft}
                    onCheckedChange={() => toggleFilter('status', 'draft')}
                  >
                    Draft
                  </DropdownMenuCheckboxItem>
                </div>
              </div>

              <DropdownMenuSeparator />

              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center text-xs"
                  onClick={clearAllFilters}
                  disabled={!areAnyFiltersActive()}
                >
                  Clear filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full md:w-auto">
                <span>Sort: {sortOption === 'recent' ? 'Most recent' :
                  sortOption === 'oldest' ? 'Oldest' :
                    sortOption === 'views' ? 'Most viewed' :
                      'Alphabetical'}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOption('recent')}>
                Most recent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('oldest')}>
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('views')}>
                Most viewed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('alpha')}>
                Alphabetical
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="p-0">
                <Skeleton className="w-full h-40 rounded-t-lg" />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="w-full h-5" />
                <Skeleton className="w-3/4 h-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="w-1/3 h-4" />
                  <Skeleton className="w-1/4 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            {searchQuery
              ? `No videos match your search for "${searchQuery}". Try a different search term.`
              : "You haven't uploaded any videos yet or none match the current filters."}
          </p>
          <Button onClick={handleOpenUploadModal}>
            <Plus className="h-4 w-4 mr-2" />
            Upload your first video
          </Button>
        </div>
      ) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortVideos(filteredVideos).map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative group">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {video.duration}
              </div>                {video.status === 'processing' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium px-3 py-1 bg-orange-500/90 rounded-sm">
                    Processing
                  </span>
                </div>
              )}
              {video.status === 'draft' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-medium px-3 py-1 bg-blue-500/90 rounded-sm">
                    Draft
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Link to={`/video/${video.id}`}>
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4 mr-1.5" />
                    Watch
                  </Button>
                </Link>
                <Link to={`${ROUTES.DASHBOARD_EDIT_VIDEO(video.id)}`}>
                  <Button size="sm" variant="secondary">
                    <Edit2 className="h-4 w-4 mr-1.5" />
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold line-clamp-1">{video.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{video.description}</p>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>{formatViews(video.views)}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  <span>{formatDate(video.uploadDate)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-4 py-2 bg-muted/30 flex justify-between">
              <div className="flex items-center">
                <span className={`
                    text-xs px-2 py-0.5 rounded-full capitalize
                    ${video.visibility === 'public' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                    ${video.visibility === 'private' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : ''}
                    ${video.visibility === 'unlisted' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                  `}>
                  {video.visibility}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild={false}>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to={`/video/${video.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`${ROUTES.DASHBOARD_EDIT_VIDEO(video.id)}`}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      )}

      {/* Upload Modal */}
      <UploadModal isOpen={isUploadModalOpen} onClose={handleCloseUploadModal} />
    </div>
  );
};

export default MyVideosPage;

