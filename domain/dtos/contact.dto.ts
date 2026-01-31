/**
 * Contact Form Data Transfer Objects
 */
export interface ContactFormRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  id?: string;
}





