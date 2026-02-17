import type { NewsletterSubscriber } from '../dtos/newsletter.dto';

/**
 * Newsletter repository interface - abstraction for newsletter subscriber data access
 */
export interface INewsletterRepository {
  addSubscriber(subscriber: NewsletterSubscriber): Promise<void>;
  removeSubscriber(email: string): Promise<void>;
  getSubscriber(email: string): Promise<NewsletterSubscriber | null>;
  confirmSubscriber(email: string): Promise<void>;
  getAllConfirmedSubscribers(): Promise<NewsletterSubscriber[]>;
  isRateLimited(identifier: string): Promise<boolean>;
  recordAttempt(identifier: string): Promise<void>;
}
