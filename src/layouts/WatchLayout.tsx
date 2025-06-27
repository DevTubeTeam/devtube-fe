import { ScrollArea } from '@/components/ui/scroll-area';
import { RelatedVideos } from '@/components/video/RelatedVideos';
import { Outlet, useParams } from 'react-router-dom';

export const WatchLayout = () => {
  const { videoId } = useParams<{ videoId: string }>();

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content area - takes up 8 columns on large screens */}
          <main className="lg:col-span-8">
            <Outlet />
          </main>

          {/* Sidebar - takes up 4 columns on large screens */}
          <aside className="lg:col-span-4">
            <ScrollArea className="h-[calc(100vh-6rem)]">
              {videoId && <RelatedVideos videoId={videoId} />}
            </ScrollArea>
          </aside>
        </div>
      </div>
    </div>
  );
};
