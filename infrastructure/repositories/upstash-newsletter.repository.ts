import type { NewsletterSubscriber } from '@/domain/dtos/newsletter.dto';
import type { INewsletterRepository } from '@/domain/interfaces/newsletter.repository.interface';
import redis from '@/lib/redis';

/**
 * Upstash Redis implementation for newsletter repository
 * Data model:
 * - newsletter:subscriber:{email} -> NewsletterSubscriber (hash)
 * - newsletter:subscribers -> Set of all subscriber emails
 * - newsletter:rate:{ip} -> Rate limiting counter (TTL: 1 hour)
 */
export class UpstashNewsletterRepository implements INewsletterRepository {
  async addSubscriber(subscriber: NewsletterSubscriber): Promise<void> {
    try {
      // Store subscriber data - convert to Record for Redis compatibility
      const subscriberData: Record<string, string | boolean> = {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
        confirmed: subscriber.confirmed,
        confirmToken: subscriber.confirmToken,
      };
      await redis.hset(`newsletter:subscriber:${subscriber.email}`, subscriberData);
      // Add to subscribers set
      await redis.sadd('newsletter:subscribers', subscriber.email);
    } catch (error) {
      console.error('Failed to add subscriber:', error);
      throw new Error('Failed to add subscriber');
    }
  }

  async removeSubscriber(email: string): Promise<void> {
    try {
      // Remove subscriber data
      await redis.del(`newsletter:subscriber:${email}`);
      // Remove from subscribers set
      await redis.srem('newsletter:subscribers', email);
    } catch (error) {
      console.error('Failed to remove subscriber:', error);
      throw new Error('Failed to remove subscriber');
    }
  }

  async getSubscriber(email: string): Promise<NewsletterSubscriber | null> {
    try {
      const subscriber = (await redis.hgetall(`newsletter:subscriber:${email}`)) as Record<
        string,
        string
      >;

      if (!subscriber || Object.keys(subscriber).length === 0) {
        return null;
      }

      // Redis stores booleans as strings, need to convert
      return {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
        confirmed: subscriber.confirmed === 'true',
        confirmToken: subscriber.confirmToken,
      };
    } catch (error) {
      console.error('Failed to get subscriber:', error);
      return null;
    }
  }

  async confirmSubscriber(email: string): Promise<void> {
    try {
      await redis.hset(`newsletter:subscriber:${email}`, { confirmed: true });
    } catch (error) {
      console.error('Failed to confirm subscriber:', error);
      throw new Error('Failed to confirm subscriber');
    }
  }

  async getAllConfirmedSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      // Get all subscriber emails
      const emails = (await redis.smembers('newsletter:subscribers')) as string[];

      if (!emails || emails.length === 0) {
        return [];
      }

      // Fetch each subscriber and filter confirmed ones
      const subscribers: NewsletterSubscriber[] = [];
      for (const email of emails) {
        const subscriber = await this.getSubscriber(email);
        if (subscriber?.confirmed) {
          subscribers.push(subscriber);
        }
      }

      return subscribers;
    } catch (error) {
      console.error('Failed to get confirmed subscribers:', error);
      return [];
    }
  }

  async isRateLimited(identifier: string): Promise<boolean> {
    try {
      const key = `newsletter:rate:${identifier}`;
      const count = await redis.get<number>(key);
      return count !== null && count >= 3;
    } catch (error) {
      console.error('Failed to check rate limit:', error);
      return false;
    }
  }

  async recordAttempt(identifier: string): Promise<void> {
    try {
      const key = `newsletter:rate:${identifier}`;
      const count = await redis.incr(key);

      // Set TTL on first attempt
      if (count === 1) {
        await redis.expire(key, 3600); // 1 hour
      }
    } catch (error) {
      console.error('Failed to record attempt:', error);
    }
  }
}
