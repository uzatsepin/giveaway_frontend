export interface ReportItem {
    id: number;
    date: string;
    subscribers: number;
    views: number;
    reach: number;
    timestamp: string;
}

export interface IDifferenceReport {
    subscribers: number;
    views: number;
    reach: number;
}

export interface InteractionData {
    forwarded_messages: number;
    link_clicks: number;
}

export interface IPopularPosts {
    id: number;
    link: string;
    views: number;
    forwards: number;
    reactions: number;
    text: string;
}

export interface IHotStats {
    channel_info: {
        participants_count: number;
        total_views: number;
        reach: number;
    };
    engagement_metrics: {
        average_views: number;
        max_views: number;
        engagement_rate: number;
        max_engagement_rate: number;
        active_readers: number;
    };
}

export interface IDailyStats {
    date: string;
    participant_count: number;
    total_posts: number;
    total_views: number;
    average_views: number;
    max_views: number;
    engagement_rate: number;
    max_engagement_rate: number;
    posts: [
        {
            id: number;
            time: string;
            views: number;
            forwards: number;
            replies: number;
        },
    ];
}

export interface IStats {
    participants_count: number;
    total_messages: number;
    total_views: number;
    average_views: number;
    max_views: number;
    engagement_rate: number;
    max_engagement_rate: number;
}

export interface IHistoryData {
    period: string;
    current_subscribers: number;
    summary: {
        total_subscriber_growth: number;
        total_views_growth: number;
        average_reach: number;
    };
    history: Array<{
        id: number;
        date: string;
        subscribers: number;
        views: number;
        reach: number;
        posts_count: number;
        daily_views: number;
        engagement_rate: number;
        timestamp: string;
        subscribers_growth: number;
        views_growth: number;
        reach_growth: number;
    }>;
}
