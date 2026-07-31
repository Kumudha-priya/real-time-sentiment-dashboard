export interface WeeklyTrend {
  date: string;
  platform: string;
  sentiment: string;
  count: number;
}

export interface PlatformTrend {
  platform: string;
  count: number;
}

export interface BrandTrend {
  brand: string;
  count: number;
}

export interface KeywordItem {
  keyword: string;
  count?: number;
  score?: number;
}

export interface AnomalyItem {
  text?: string;
  z_score?: number;
  is_spike?: boolean;
  alert?: string;
}

export interface DailyTrend {
  date: string;
  count?: number;
  sentiment_count?: number;
  moving_avg_sentiment?: number;
}

export interface AlertItem {
  text: string;
  sentiment: string;
  confidence_score?: number;
  topic?: string;
  topic_name?: string;
  created_at?: string;
}
export interface AnalyticsResponse {


  logged_in_user?:string;

  total_posts?:number;


  positive?:number;

  negative?:number;

  neutral?:number;



  daily_trends:DailyTrend[];

  trend_data:DailyTrend[];



  weekly_trends:WeeklyTrend[];


  platform_trends:PlatformTrend[];



  sentiment_distribution:{
    platform:string;

    Positive?:number;

    Neutral?:number;

    Negative?:number;

  }[];

  brand_trends: BrandTrend[];

  alerts: AlertItem[];
  brand_alerts: unknown[];

  topic_frequency: TopicItem[];
  keyword_frequency: KeywordItem[];

  anomalies: AnomalyItem[];

top_topics: TopicItem[];
top_keywords: KeywordItem[];
}
export interface TopicItem {
  topic?: string;
  count?: number;
}