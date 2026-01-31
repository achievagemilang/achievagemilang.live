import type { AiChatRequest, AiChatResponse } from '@/domain/dtos/ai-chat.dto';
import type { IAiService } from '@/domain/interfaces/ai-service.interface';
import { aiChatRequestSchema } from '../validators/ai-chat.validator';

/**
 * AI Chat service - handles AI chat business logic
 */
export class AiChatService {
  constructor(private readonly aiService: IAiService) {}

  async handleChatRequest(request: AiChatRequest): Promise<AiChatResponse> {
    // Validate input
    const validationResult = aiChatRequestSchema.safeParse(request);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message).join(', ');
      throw new Error(`Validation failed: ${errors}`);
    }

    // Generate response through AI service
    return this.aiService.generateResponse(validationResult.data);
  }
}






