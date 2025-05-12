import VideoPlayer from '@/components/video/VideoPlayer';

const WatchPage = () => {
  const videoUrl = `https://d1bapesvzv4qyl.cloudfront.net/processed/cb21de00-e93c-42ff-a7c6-080308871c43/index.m3u8`;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-yellow-900">Test Video Streaming</h1>
      <VideoPlayer src={videoUrl} />
    </div>
  );
};

export default WatchPage;
