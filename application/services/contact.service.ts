import type { ContactFormRequest, ContactFormResponse } from '@/domain/dtos/contact.dto';
import type { IEmailService } from '@/domain/interfaces/email-service.interface';
import { contactFormSchema } from '../validators/contact.validator';

/**
 * Contact service - handles contact form business logic
 */
export class ContactService {
  constructor(private readonly emailService: IEmailService) {}

  async sendContactForm(request: ContactFormRequest): Promise<ContactFormResponse> {
    // Validate input
    const validationResult = contactFormSchema.safeParse(request);
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message).join(', ');
      throw new Error(`Validation failed: ${errors}`);
    }

    // Send email through email service
    const { id } = await this.emailService.sendContactFormEmail(validationResult.data);

    return {
      success: true,
      message: 'Email sent successfully',
      id,
    };
  }
}






