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
}





