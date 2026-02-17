/**
 * Email template service - handles email template generation
 */
export class EmailTemplateService {
  static generateContactFormTemplate(request: {
    name: string;
    email: string;
    message: string;
  }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${this.escapeHtml(request.name)}</p>
          <p><strong>Email:</strong> ${this.escapeHtml(request.email)}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${this.formatMessage(request.message)}
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">
          This message was sent from your portfolio contact form.
        </p>
      </div>
    `;
  }

  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  private static formatMessage(message: string): string {
    return this.escapeHtml(message).replace(/\n/g, '<br>');
  }

  static generateNewsletterConfirmationTemplate(confirmUrl: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0; font-size: 28px;">Confirm Your Subscription</h1>
        </div>
        <div style="background-color: #f5f5f5; padding: 30px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for subscribing to Achieva Gemilang's newsletter!
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            To complete your subscription, please click the button below to confirm your email address:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${this.escapeHtml(confirmUrl)}" 
               style="background-color: #0070f3; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Confirm Subscription
            </a>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            If you didn't subscribe to this newsletter, you can safely ignore this email.
          </p>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          This email was sent from Achieva Gemilang's Portfolio
        </p>
      </div>
    `;
  }

  static generateNewsletterWelcomeTemplate(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0; font-size: 28px;">Welcome! 🎉</h1>
        </div>
        <div style="background-color: #f5f5f5; padding: 30px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for confirming your subscription!
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            You're now part of the community. You'll receive email notifications whenever I publish new blog posts, insights, and updates.
          </p>
          <p style="color: #333; font-size: 16px; line-height: 1.6;">
            Stay tuned for valuable content on software engineering, product development, and technology!
          </p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://achievagemilang.dev" 
             style="color: #0070f3; text-decoration: none; font-weight: 600;">
            Visit the blog →
          </a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          You can unsubscribe at any time from the links in our emails.
        </p>
      </div>
    `;
  }

  static generateNewsletterDigestTemplate(
    posts: Array<{ title: string; excerpt: string; url: string; date: string }>,
    unsubscribeUrl: string
  ): string {
    const postsHtml = posts
      .map(
        (post) => `
        <div style="background-color: white; padding: 20px; margin-bottom: 20px; border-radius: 6px; border: 1px solid #e5e5e5;">
          <h3 style="color: #333; margin: 0 0 10px 0; font-size: 20px;">
            <a href="${this.escapeHtml(post.url)}" style="color: #0070f3; text-decoration: none;">
              ${this.escapeHtml(post.title)}
            </a>
          </h3>
          <p style="color: #666; font-size: 14px; margin: 0 0 10px 0;">
            ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0;">
            ${this.escapeHtml(post.excerpt)}
          </p>
          <div style="margin-top: 15px;">
            <a href="${this.escapeHtml(post.url)}" 
               style="color: #0070f3; text-decoration: none; font-weight: 600; font-size: 14px;">
              Read more →
            </a>
          </div>
        </div>
      `
      )
      .join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0; font-size: 28px;">New Posts from Achieva Gemilang</h1>
        </div>
        <div style="background-color: #f5f5f5; padding: 30px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Here are the latest posts from the blog:
          </p>
          ${postsHtml}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://achievagemilang.dev/en/blogs" 
             style="color: #0070f3; text-decoration: none; font-weight: 600;">
            View all posts →
          </a>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">
          <a href="${this.escapeHtml(unsubscribeUrl)}" style="color: #999; text-decoration: underline;">
            Unsubscribe from this newsletter
          </a>
        </p>
      </div>
    `;
  }
}
