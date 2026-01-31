import { z } from 'zod';

/**
 * Validation schema for AI chat requests
 */
export const aiChatRequestSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
});

export type AiChatRequestInput = z.infer<typeof aiChatRequestSchema>;






