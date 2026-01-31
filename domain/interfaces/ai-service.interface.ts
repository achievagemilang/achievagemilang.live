import type { AiChatRequest, AiChatResponse } from '../dtos/ai-chat.dto';

/**
 * AI service interface - abstraction for AI chat functionality
 */
export interface IAiService {
  generateResponse(request: AiChatRequest): Promise<AiChatResponse>;
  detectSchedulingIntent(message: string): boolean;
}






