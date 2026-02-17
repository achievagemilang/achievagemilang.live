import type {
  NewsletterDigestPost,
  NewsletterSubscribeRequest,
  NewsletterSubscribeResponse,
  NewsletterSubscriber,
} from '@/domain/dtos/newsletter.dto';
import type { IEmailService } from '@/domain/interfaces/email-service.interface';
import type { INewsletterRepository } from '@/domain/interfaces/newsletter.repository.interface';
import { randomBytes } from 'crypto';
import {
  newsletterConfirmSchema,
  newsletterSubscribeSchema,
  newsletterUnsubscribeSchema,
} from '../validators/newsletter.validator';

/**
 * Newsletter service - handles newsletter subscription business logic
 */
export class NewsletterService {
  constructor(
    private readonly repository: INewsletterRepository,
    private readonly emailService: IEmailService
  ) {}

  async subscribe(
    request: NewsletterSubscribeRequest,
    baseUrl: string
  ): Promise<NewsletterSubscribeResponse> {
    // Validate input
    const validationResult = newsletterSubscribeSchema.safeParse(request);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message).join(', ');
      throw new Error(`Validation failed: ${errors}`);
    }

    const { email } = validationResult.data;

    // Check if subscriber already exists
    const existingSubscriber = await this.repository.getSubscriber(email);
    if (existingSubscriber?.confirmed) {
      return {
        success: true,
        message: 'You are already subscribed!',
      };
    }

    // Generate confirmation token
    const confirmToken = randomBytes(32).toString('hex');

    // Create subscriber
    const subscriber: NewsletterSubscriber = {
      email,
      subscribedAt: new Date().toISOString(),
      confirmed: false,
      confirmToken,
    };

    await this.repository.addSubscriber(subscriber);

    // Send confirmation email
    const confirmUrl = `${baseUrl}/api/newsletter/confirm?email=${encodeURIComponent(
      email
    )}&token=${confirmToken}`;
    await this.emailService.sendNewsletterConfirmation(email, confirmUrl);

    return {
      success: true,
      message: 'Check your email to confirm your subscription!',
    };
  }

  async confirmSubscription(email: string, token: string): Promise<void> {
    // Validate input
    const validationResult = newsletterConfirmSchema.safeParse({ email, token });
    if (!validationResult.success) {
      throw new Error('Invalid confirmation parameters');
    }

    const { email: validatedEmail, token: validatedToken } = validationResult.data;

    // Get subscriber
    const subscriber = await this.repository.getSubscriber(validatedEmail);
    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    if (subscriber.confirmed) {
      throw new Error('Already confirmed');
    }

    if (subscriber.confirmToken !== validatedToken) {
      throw new Error('Invalid confirmation token');
    }

    // Confirm subscriber
    await this.repository.confirmSubscriber(validatedEmail);

    // Send welcome email
    await this.emailService.sendNewsletterWelcome(validatedEmail);
  }

  async unsubscribe(email: string, token: string): Promise<void> {
    // Validate input
    const validationResult = newsletterUnsubscribeSchema.safeParse({ email, token });
    if (!validationResult.success) {
      throw new Error('Invalid unsubscribe parameters');
    }

    const { email: validatedEmail, token: validatedToken } = validationResult.data;

    // Get subscriber
    const subscriber = await this.repository.getSubscriber(validatedEmail);
    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    if (subscriber.confirmToken !== validatedToken) {
      throw new Error('Invalid unsubscribe token');
    }

    // Remove subscriber
    await this.repository.removeSubscriber(validatedEmail);
  }

  async sendDigest(
    posts: NewsletterDigestPost[],
    secretKey: string,
    baseUrl: string
  ): Promise<{ sent: number }> {
    // Verify admin secret
    const expectedSecret = process.env.NEWSLETTER_SECRET;
    if (!expectedSecret || secretKey !== expectedSecret) {
      throw new Error('Unauthorized');
    }

    // Get all confirmed subscribers
    const subscribers = await this.repository.getAllConfirmedSubscribers();

    // Send digest to each subscriber
    let sent = 0;
    for (const subscriber of subscribers) {
      try {
        const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(
          subscriber.email
        )}&token=${subscriber.confirmToken}`;
        await this.emailService.sendNewsletterDigest(subscriber.email, posts, unsubscribeUrl);
        sent++;
      } catch (error) {
        console.error(`Failed to send digest to ${subscriber.email}:`, error);
      }
    }

    return { sent };
  }
}
