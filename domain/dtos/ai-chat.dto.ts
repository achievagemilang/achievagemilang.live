/**
 * AI Chat Data Transfer Objects
 */
export interface AiChatRequest {
  message: string;
}

export interface AiChatResponse {
  message: string;
  shouldScheduleMeeting: boolean;
}





