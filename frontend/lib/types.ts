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
  count: number;
  moving_avg_sentiment: number;
}

export interface AlertItem {
  text: string;
  sentiment: string;
  confidence: number;
  topic: string;
}
export interface AnalyticsResponse {
  daily_trends: DailyTrend[];
  weekly_trends: WeeklyTrend[];
  platform_trends: PlatformTrend[];

  sentiment_distribution: {
    platform: string;
    Positive?: number;
    Neutral?: number;
    Negative?: number;
  }[];

  brand_trends: BrandTrend[];

  alerts: AlertItem[];
  brand_alerts: unknown[];

  topic_frequency: unknown[];
  keyword_frequency: KeywordItem[];

  anomalies: AnomalyItem[];
}