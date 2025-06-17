import { ScrollArea } from '@/components/ui/scroll-area';
import { Outlet } from 'react-router-dom';

export const WatchLayout = () => {
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
              {/* Sidebar content will be added here */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Related Videos</h2>
                {/* Related videos will be added here */}
              </div>
            </ScrollArea>
          </aside>
        </div>
      </div>
    </div>
  );
};
