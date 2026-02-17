import type { ContactFormRequest } from '@/domain/dtos/contact.dto';
import type { IEmailService } from '@/domain/interfaces/email-service.interface';
import { Resend } from 'resend';
import { EmailTemplateService } from './email-template.service';

/**
 * Resend email service implementation
 */
export class ResendEmailService implements IEmailService {
  private resend: Resend;
  private fromEmail: string;
  private toEmail: string;

  constructor(apiKey: string, fromEmail: string, toEmail: string) {
    if (!apiKey) {
      throw new Error('Resend API key is required');
    }
    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
    this.toEmail = toEmail;
  }

  async sendContactFormEmail(request: ContactFormRequest): Promise<{ id: string }> {
    const html = EmailTemplateService.generateContactFormTemplate(request);

    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: [this.toEmail],
      subject: `New Contact Form Message from ${request.name} - Portfolio Web`,
      html,
      replyTo: request.email,
    });

    if (error) {
      throw new Error(`Failed to send email: ${error.message || 'Unknown error'}`);
    }

    if (!data?.id) {
      throw new Error('Email sent but no ID returned');
    }

    return { id: data.id };
  }

  async sendNewsletterConfirmation(email: string, confirmUrl: string): Promise<{ id: string }> {
    const html = EmailTemplateService.generateNewsletterConfirmationTemplate(confirmUrl);

    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: [email],
      subject: 'Confirm your subscription - Achieva Gemilang',
      html,
    });

    if (error) {
      throw new Error(`Failed to send confirmation email: ${error.message || 'Unknown error'}`);
    }

    if (!data?.id) {
      throw new Error('Confirmation email sent but no ID returned');
    }

    return { id: data.id };
  }

  async sendNewsletterWelcome(email: string): Promise<{ id: string }> {
    const html = EmailTemplateService.generateNewsletterWelcomeTemplate();

    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: [email],
      subject: 'Welcome to the newsletter! - Achieva Gemilang',
      html,
    });

    if (error) {
      throw new Error(`Failed to send welcome email: ${error.message || 'Unknown error'}`);
    }

    if (!data?.id) {
      throw new Error('Welcome email sent but no ID returned');
    }

    return { id: data.id };
  }

  async sendNewsletterDigest(
    email: string,
    posts: Array<{ title: string; excerpt: string; url: string; date: string }>,
    unsubscribeUrl: string
  ): Promise<{ id: string }> {
    const html = EmailTemplateService.generateNewsletterDigestTemplate(posts, unsubscribeUrl);

    const { data, error } = await this.resend.emails.send({
      from: this.fromEmail,
      to: [email],
      subject: 'New posts from Achieva Gemilang',
      html,
    });

    if (error) {
      throw new Error(`Failed to send digest email: ${error.message || 'Unknown error'}`);
    }

    if (!data?.id) {
      throw new Error('Digest email sent but no ID returned');
    }

    return { id: data.id };
  }
}
