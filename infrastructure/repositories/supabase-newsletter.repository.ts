import type { NewsletterSubscriber } from '@/domain/dtos/newsletter.dto';
import type { INewsletterRepository } from '@/domain/interfaces/newsletter.repository.interface';
import redis from '@/lib/redis';
import { supabase } from '@/lib/supabase';

/**
 * Supabase (PostgreSQL) implementation for newsletter repository
 * Uses hybrid approach: subscribers in Supabase, rate limiting in Redis
 */
export class SupabaseNewsletterRepository implements INewsletterRepository {
  async addSubscriber(subscriber: NewsletterSubscriber): Promise<void> {
    try {
      // Upsert: if email exists and unconfirmed, regenerate token and update
      const { error } = await supabase.from('newsletter_subscribers').upsert(
        {
          email: subscriber.email,
          subscribed_at: subscriber.subscribedAt,
          confirmed: subscriber.confirmed,
          confirm_token: subscriber.confirmToken,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
          // Only update if the existing subscriber is not confirmed
          ignoreDuplicates: false,
        }
      );

      if (error) {
        console.error('Failed to add subscriber:', error);
        throw new Error('Failed to add subscriber');
      }
    } catch (error) {
      console.error('Failed to add subscriber:', error);
      throw new Error('Failed to add subscriber');
    }
  }

  async removeSubscriber(email: string): Promise<void> {
    try {
      const { error } = await supabase.from('newsletter_subscribers').delete().eq('email', email);

      if (error) {
        console.error('Failed to remove subscriber:', error);
        throw new Error('Failed to remove subscriber');
      }
    } catch (error) {
      console.error('Failed to remove subscriber:', error);
      throw new Error('Failed to remove subscriber');
    }
  }

  async getSubscriber(email: string): Promise<NewsletterSubscriber | null> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        console.error('Failed to get subscriber:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      return {
        email: data.email,
        subscribedAt: data.subscribed_at,
        confirmed: data.confirmed,
        confirmToken: data.confirm_token,
      };
    } catch (error) {
      console.error('Failed to get subscriber:', error);
      return null;
    }
  }

  async confirmSubscriber(email: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          confirmed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('email', email);

      if (error) {
        console.error('Failed to confirm subscriber:', error);
        throw new Error('Failed to confirm subscriber');
      }
    } catch (error) {
      console.error('Failed to confirm subscriber:', error);
      throw new Error('Failed to confirm subscriber');
    }
  }

  async getAllConfirmedSubscribers(): Promise<NewsletterSubscriber[]> {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('confirmed', true);

      if (error) {
        console.error('Failed to get confirmed subscribers:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
      }

      return data.map((row) => ({
        email: row.email,
        subscribedAt: row.subscribed_at,
        confirmed: row.confirmed,
        confirmToken: row.confirm_token,
      }));
    } catch (error) {
      console.error('Failed to get confirmed subscribers:', error);
      return [];
    }
  }

  // Rate limiting stays in Redis (TTL-based)
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
