import { createNewsletterService } from '@/infrastructure/config/services.config';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/newsletter/subscribe
 * Handle newsletter subscription requests
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newsletterService = createNewsletterService();

    // Get IP address for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    const repository = newsletterService['repository'];
    if (await repository.isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Record attempt
    await repository.recordAttempt(ip);

    // Get base URL for confirmation link
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    const result = await newsletterService.subscribe(body, baseUrl);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Handle validation errors
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Handle generic errors
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
