import VideoPlayer from '@/components/video/VideoPlayer';
import { useParams } from 'react-router-dom';

const WatchPage = () => {
  // get video id param
  const { videoId } = useParams<{ videoId: string }>();


  const videoUrl = `https://d1bapesvzv4qyl.cloudfront.net/processed/${videoId}/index.m3u8`;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-yellow-900">Test Video Streaming</h1>
      <VideoPlayer src={videoUrl} />
    </div>
  );
};

export default WatchPage;
