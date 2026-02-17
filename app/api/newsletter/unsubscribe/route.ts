import { createNewsletterService } from '@/infrastructure/config/services.config';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/newsletter/unsubscribe?email=...&token=...
 * Unsubscribe from newsletter
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json({ error: 'Email and token are required' }, { status: 400 });
    }

    const newsletterService = createNewsletterService();
    await newsletterService.unsubscribe(email, token);

    // Redirect to success page
    const locale = request.nextUrl.pathname.includes('/id/') ? 'id' : 'en';
    return NextResponse.redirect(
      new URL(`/${locale}/newsletter/status?type=unsubscribed`, request.url)
    );
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);

    const locale = request.nextUrl.pathname.includes('/id/') ? 'id' : 'en';

    // Redirect to error page with message
    return NextResponse.redirect(
      new URL(
        `/${locale}/newsletter/status?type=error&message=${encodeURIComponent(
          error instanceof Error ? error.message : 'Unsubscribe failed'
        )}`,
        request.url
      )
    );
  }
}
