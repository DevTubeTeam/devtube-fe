import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';

interface VideoEmptyStateProps {
    searchQuery: string;
    handleOpenUploadModal: () => void;
}

const VideoEmptyState = ({ searchQuery, handleOpenUploadModal }: VideoEmptyStateProps) => {
    return (
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
    );
};

export default VideoEmptyState;