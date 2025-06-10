const formatDuration = (duration: string | number): string => {
    let seconds: number;
    if (typeof duration === 'string' && duration.startsWith('PT')) {
        // Handle ISO 8601 duration (e.g., "PT5M30S")
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = duration.match(regex);
        if (!matches) return '0:00';
        const hours = parseInt(matches[1] || '0', 10);
        const minutes = parseInt(matches[2] || '0', 10);
        const secs = parseInt(matches[3] || '0', 10);
        seconds = hours * 3600 + minutes * 60 + secs;
    } else {
        // Handle duration as number of seconds
        seconds = typeof duration === 'number' ? duration : parseInt(duration, 10) || 0;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
};

const formatViews = (views: number | undefined) => {
    if (!views) return '0 views';
    if (views < 1000) return `${views} ${views === 1 ? 'view' : 'views'}`;
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K views`;
    return `${(views / 1000000).toFixed(1)}M views`;
};

export { formatDate, formatDuration, formatViews };

