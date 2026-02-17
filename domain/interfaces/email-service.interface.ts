import type { ContactFormRequest } from '../dtos/contact.dto';
import type { NewsletterDigestPost } from '../dtos/newsletter.dto';

/**
 * Email service interface - abstraction for email sending
 */
export interface IEmailService {
  sendContactFormEmail(request: ContactFormRequest): Promise<{ id: string }>;
  sendNewsletterConfirmation(email: string, confirmUrl: string): Promise<{ id: string }>;
  sendNewsletterWelcome(email: string): Promise<{ id: string }>;
  sendNewsletterDigest(
    email: string,
    posts: NewsletterDigestPost[],
    unsubscribeUrl: string
  ): Promise<{ id: string }>;
}
