export interface CopywritingInput {
  topic: string;
  productName: string;
  features: string[];
  targetAudience: string;
  style: 'planting' | 'review' | 'tutorial' | 'story';
}

export interface GeneratedCopy {
  id: string;
  title: string;
  content: string;
  tags: string[];
  emojis: string[];
  timestamp: string;
  isFavorite: boolean;
}

export interface HistoryItem {
  id: string;
  input: CopywritingInput;
  outputs: GeneratedCopy[];
  timestamp: string;
}

export interface ApiResponse {
  success: boolean;
  data?: GeneratedCopy[];
  error?: string;
}
