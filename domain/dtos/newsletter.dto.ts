/**
 * Newsletter Data Transfer Objects
 */

export interface NewsletterSubscribeRequest {
  email: string;
  honeypot?: string; // anti-bot field, must be empty
}

export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
}

export interface NewsletterUnsubscribeRequest {
  email: string;
  token: string;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string; // ISO date
  confirmed: boolean;
  confirmToken: string; // random token for confirm/unsubscribe
}

export interface NewsletterDigestPost {
  title: string;
  excerpt: string;
  url: string;
  date: string;
}
