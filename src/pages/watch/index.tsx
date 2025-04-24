import VideoPlayer from '@/components/video/VideoPlayer';

const WatchPage = () => {
  const videoUrl = `https://d1bapesvzv4qyl.cloudfront.net/processed/2rN0XTW8dU8/master.m3u8`;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-yellow-900">Test Video Streaming</h1>
      <VideoPlayer src={videoUrl} />
    </div>
  );
};

export default WatchPage;
