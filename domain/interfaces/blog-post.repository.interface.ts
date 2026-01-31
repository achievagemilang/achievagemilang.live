import type { Post } from '@/content-config';

/**
 * Blog post repository interface - abstraction for blog post data access
 */
export interface IBlogPostRepository {
  getAllPosts(): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | null>;
}





