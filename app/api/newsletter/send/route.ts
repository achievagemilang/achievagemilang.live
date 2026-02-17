import type { NewsletterDigestPost } from '@/domain/dtos/newsletter.dto';
import { createBlogPostRepository } from '@/infrastructure/config/blog-repositories.config';
import { createNewsletterService } from '@/infrastructure/config/services.config';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/newsletter/send
 * Send newsletter digest to all confirmed subscribers
 * Protected by NEWSLETTER_SECRET
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, postSlugs } = body;

    if (!secret) {
      return NextResponse.json({ error: 'Secret is required' }, { status: 401 });
    }

    if (!postSlugs || !Array.isArray(postSlugs) || postSlugs.length === 0) {
      return NextResponse.json({ error: 'Post slugs are required' }, { status: 400 });
    }

    // Get base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    // Fetch post data
    const blogRepository = createBlogPostRepository();
    const posts: NewsletterDigestPost[] = [];

    for (const slug of postSlugs) {
      const post = await blogRepository.getPostBySlug(slug);
      if (post) {
        posts.push({
          title: post.title,
          excerpt: post.excerpt,
          url: `${baseUrl}/en/blogs/${post.slug}`,
          date: post.date,
        });
      }
    }

    if (posts.length === 0) {
      return NextResponse.json({ error: 'No valid posts found' }, { status: 404 });
    }

    // Send digest
    const newsletterService = createNewsletterService();
    const result = await newsletterService.sendDigest(posts, secret, baseUrl);

    return NextResponse.json(
      {
        success: true,
        message: `Digest sent to ${result.sent} subscriber(s)`,
        sent: result.sent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter send error:', error);

    // Handle unauthorized errors
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle generic errors
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
