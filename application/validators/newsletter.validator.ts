import { z } from 'zod';

/**
 * Validation schema for newsletter subscription requests
 */
export const newsletterSubscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .toLowerCase()
    .trim(),
  honeypot: z.string().max(0, 'Bot detected').optional(),
});

export const newsletterUnsubscribeSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  token: z.string().min(1, 'Token is required'),
});

export const newsletterConfirmSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  token: z.string().min(1, 'Token is required'),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
export type NewsletterUnsubscribeInput = z.infer<typeof newsletterUnsubscribeSchema>;
export type NewsletterConfirmInput = z.infer<typeof newsletterConfirmSchema>;
