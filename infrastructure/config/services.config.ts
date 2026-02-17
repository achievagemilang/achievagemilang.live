/**
 * Service configuration - factory functions for creating service instances
 */

import { AiChatService } from '@/application/services/ai-chat.service';
import { ContactService } from '@/application/services/contact.service';
import { OpenAiService } from '../services/openai-service';
import { ResendEmailService } from '../services/resend-email.service';

/**
 * Create and configure email service
 */
export function createEmailService(): ResendEmailService {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = 'Portfolio Contact <onboarding@resend.dev>';
  const toEmail = 'achievafuturagemilang@gmail.com';

  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is required');
  }

  return new ResendEmailService(apiKey, fromEmail, toEmail);
}

/**
 * Create and configure AI service
 */
export function createAiService(): OpenAiService {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-5-nano';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  return new OpenAiService(apiKey, model);
}

/**
 * Create contact service with dependencies
 */
export function createContactService(): ContactService {
  const emailService = createEmailService();
  return new ContactService(emailService);
}

/**
 * Create AI chat service with dependencies
 */
export function createAiChatService(): AiChatService {
  const aiService = createAiService();
  return new AiChatService(aiService);
}

/**
 * Create newsletter service with dependencies
 */
export function createNewsletterService() {
  const { NewsletterService } = require('@/application/services/newsletter.service');
  const { UpstashNewsletterRepository } = require('../repositories/upstash-newsletter.repository');

  const repository = new UpstashNewsletterRepository();
  const emailService = createEmailService();
  return new NewsletterService(repository, emailService);
}
