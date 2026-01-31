import type { ContactFormRequest } from '../dtos/contact.dto';

/**
 * Email service interface - abstraction for email sending
 */
export interface IEmailService {
  sendContactFormEmail(request: ContactFormRequest): Promise<{ id: string }>;
}





