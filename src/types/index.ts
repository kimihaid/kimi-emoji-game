export interface ClickCounterData {
  userClicks: number;
  globalClicks: number;
  lastUpdated: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface GlobalClickData {
  totalClicks: number;
  lastUpdated: string;
  increment?: number;
  message?: string;
}

export interface EmojiClickEvent {
  emoji: string;
  timestamp: Date;
  soundDuration?: number;
}