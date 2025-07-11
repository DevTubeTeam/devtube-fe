import { PlaylistCard } from '@/components/playlists/PlaylistCard';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { VideoCard } from "@/components/video";
import { useUser } from '@/hooks/useUser';
import { useVideo } from '@/hooks/useVideo';
import { motion } from "framer-motion";
import { Bell, Grid3X3, List, Users, Video } from "lucide-react";
import { useState } from "react";
import { useParams } from 'react-router-dom';
import PageMeta from '../../components/common/PageMeta';

const ChannelPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    useGetChannelById,
    useIsSubscribed,
    useGetChannelSubscribersCount,
    useSubscribeToChannel,
    useUnsubscribeFromChannel
  } = useUser();

  const { useGetChannelVideos, useGetChannelPlaylists } = useVideo();

  // Lấy thông tin channel
  const { data: channelData, isLoading: isChannelLoading, error: channelError } = useGetChannelById(id!);
  // Lấy trạng thái đã subscribe chưa
  const { data: isSubscribedData, isLoading: isSubscribedLoading } = useIsSubscribed(id!);
  // Lấy số lượng subscribers
  const { data: subscribersCountData, isLoading: isSubscribersCountLoading } = useGetChannelSubscribersCount(id!);

  // Lấy videos và playlists của channel
  const { data: channelVideosData, isLoading: isChannelVideosLoading } = useGetChannelVideos(id!);
  const { data: channelPlaylistsData, isLoading: isChannelPlaylistsLoading } = useGetChannelPlaylists(id!);

  // Subscribe/Unsubscribe mutation
  const subscribeMutation = useSubscribeToChannel();
  const unsubscribeMutation = useUnsubscribeFromChannel();

  const isSubscribed = isSubscribedData?.status ?? false;
  const subscribersCount = subscribersCountData?.data?.totalCount ?? 0;
  const channelVideos = channelVideosData?.videos ?? [];
  const channelPlaylists = channelPlaylistsData?.playlists ?? [];


  const handleSubscribe = () => {
    if (!id) return;
    if (isSubscribed) {
      unsubscribeMutation.mutate(id);
    } else {
      subscribeMutation.mutate(id);
    }
  };

  const [activeTab, setActiveTab] = useState("videos");

  const formatSubscribers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long'
    });
  };

  const tabs = [
    { id: "videos", label: "Videos", icon: Grid3X3, count: channelVideos.length },
    { id: "playlists", label: "Playlists", icon: List, count: channelPlaylists.length },
  ];

  if (isChannelLoading || isSubscribedLoading || isSubscribersCountLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (channelError) {
    return <div className="p-8 text-center text-red-500">{channelError.message}</div>;
  }
  const channel = channelData?.data;

  return (
    <>
      <PageMeta
        title={channel?.name ? `${channel.name} - DevTube` : "Channel - DevTube"}
        description="View channel details, videos, and playlists. Subscribe to your favorite channels and stay updated."
      />
      <div className="min-h-screen bg-background">
        {/* Channel Banner */}
        <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            <img
              src={channel?.thumbnailUrl}
              alt="Channel Banner"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>

        {/* Channel Info Section */}
        <div className="relative px-4 md:px-8 lg:px-16 -mt-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-28 h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 border-4 border-background shadow-2xl ring-4 ring-background/20">
                <AvatarImage src={channel?.thumbnailUrl} alt={channel?.name} />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {channel?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Channel Details */}
            <div className="flex-1 min-w-0 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground truncate mb-2">
                    {channel?.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2 font-medium">
                      <Users className="w-4 h-4" />
                      {formatSubscribers(subscribersCount)} subscribers
                    </span>
                    <span className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      {channelVideos.length} videos
                    </span>
                    <span>Joined {channel?.createdAt ? formatJoinDate(channel.createdAt) : ''}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleSubscribe}
                    variant={isSubscribed ? "outline" : "default"}
                    size="lg"
                    className="rounded-full px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending || unsubscribeMutation.isPending ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    ) : isSubscribed ? (
                      <>
                        <Bell className="w-5 h-5 mr-2" />
                        Subscribed
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                  </div>
              </div>

              {/* Channel Description */}
              <div className="max-w-3xl">
                <p className="text-base text-muted-foreground leading-relaxed">
                  {channel?.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mt-8" />

        {/* Custom Tabs Section */}
        <div className="px-4 md:px-8 lg:px-16">
          <div className="border-b border-border">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 py-4 px-1 text-base font-medium transition-all duration-200 ${isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {tab.count}
                      </Badge>
                    )}

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === "videos" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isChannelVideosLoading ? (
                  <div className="text-center py-16">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading videos...</p>
                  </div>
                ) : channelVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {channelVideos.map((video, index) => (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group"
                      >
                        <VideoCard video={video} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                      <Video className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">No videos yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      This channel hasn't uploaded any videos yet. Check back later for new content.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "playlists" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isChannelPlaylistsLoading ? (
                  <div className="text-center py-16">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading playlists...</p>
                  </div>
                ) : channelPlaylists.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {channelPlaylists.map((playlist, index) => (
                      <motion.div
                        key={playlist.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group"
                      >
                        <PlaylistCard playlist={playlist} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                      <List className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">No playlists yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      This channel hasn't created any playlists. Check back later for organized video collections.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChannelPage;
