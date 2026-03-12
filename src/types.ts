export interface Keyword {
  id: string;
  name: string;
  volume: number;
  difficulty: number;
  trend: string;
  category: string;
  location: string;
  type: string;
  potential: number;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'success';
  message: string;
  date: string;
}

export interface TrendData {
  date: string;
  value: number;
}

export interface ContentSuggestion {
  id: string;
  title: string;
  type: string;
  impact: string;
}
