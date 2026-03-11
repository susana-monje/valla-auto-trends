export interface Keyword {
  id: number;
  term: string;
  slug: string;
  category: 'car' | 'moto';
  type: 'buy' | 'price' | 'comparison' | 'financing' | 'service' | 'rental' | 'insurance';
  location: string;
  volume: number;
  difficulty: number;
  trend_score: number;
  potential_score: number;
  est_cpc: number;
  est_conversion_rate: number;
  meta_title: string;
  meta_description: string;
  content_html: string;
  faq_json: string; // JSON string
  schema_markup: string; // JSON string
  last_updated: string;
}

export interface TrendData {
  id: number;
  keyword_id: number;
  date: string;
  volume: number;
}

export interface Alert {
  id: number;
  keyword_id: number;
  term: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  created_at: string;
  is_read: number;
}

export interface ContentSuggestion {
  id: number;
  keyword_id: number;
  title: string;
  structure: string;
  meta_description: string;
  content_type: 'post' | 'landing' | 'ad' | 'social';
  created_at: string;
}
