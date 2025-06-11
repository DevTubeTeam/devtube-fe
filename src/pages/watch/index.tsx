import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HLSVideoPlayer } from '@/components/video';
import { MessageSquare, MoreHorizontal, Share2, ThumbsUp } from 'lucide-react';
import { useParams } from 'react-router-dom';

const WatchPage = () => {
  // get video id param
  const { videoId } = useParams<{ videoId: string }>();


  const videoUrl = `https://d1bapesvzv4qyl.cloudfront.net/processed/${videoId}/index.m3u8`;
  const posterUrl = `https://d1bapesvzv4qyl.cloudfront.net/thumbnails/${videoId}.jpg`;

  return (
    <div className="space-y-6">
      {/* Video Player Section */}
      <div className="bg-black rounded-lg overflow-hidden">
        <HLSVideoPlayer
          source={videoUrl}
          poster={posterUrl}
          className="w-full aspect-video"
        />
      </div>

      {/* Video Info Section */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Video Title</h1>

        {/* Video Stats and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Channel Name</p>
                <p className="text-sm text-muted-foreground">1.2K subscribers</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Subscribe</Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm" className="gap-2">
              <ThumbsUp className="h-4 w-4" />
              Like
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Comment
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Video Description */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>1.2K views</span>
                <span>•</span>
                <span>2 days ago</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">
                This is the video description. It can be multiple lines long and contain
                information about the video content, links, and other relevant details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WatchPage;
