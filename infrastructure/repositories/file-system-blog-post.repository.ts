import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import type { IBlogPostRepository } from '@/domain/interfaces/blog-post.repository.interface';
import type { Post } from '@/content-config';

/**
 * File system-based blog post repository implementation
 */
export class FileSystemBlogPostRepository implements IBlogPostRepository {
  private postsDirectory: string;

  constructor(postsDirectory?: string) {
    this.postsDirectory = postsDirectory || path.join(process.cwd(), 'content/posts');
  }

  async getAllPosts(): Promise<Post[]> {
    try {
      if (!fs.existsSync(this.postsDirectory)) {
        console.warn('Posts directory does not exist');
        return [];
      }

      const fileNames = fs.readdirSync(this.postsDirectory);

      const posts = await Promise.all(
        fileNames
          .filter((fileName) => fileName.endsWith('.mdx'))
          .map(async (fileName) => {
            const slug = fileName.replace(/\.mdx$/, '');
            const post = await this.getPostBySlug(slug);
            return post;
          })
      );

      // Filter out any null values and sort by date
      return posts
        .filter((post): post is Post => post !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error loading posts:', error);
      return [];
    }
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      const filePath = path.join(this.postsDirectory, `${slug}.mdx`);

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const fileContents = fs.readFileSync(filePath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents);

      // Serialize the MDX content for use with MDXRemote
      const mdxSource = await serialize(content);

      const readingTime = this.calculateReadingTime(content);

      return {
        _id: slug,
        slug,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString().split('T')[0],
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        readingTime,
        mdxSource,
      };
    } catch (error) {
      console.error(`Error loading post ${slug}:`, error);
      return null;
    }
  }

  private calculateReadingTime(content: string): number {
    const words = content.split(/\s+/).filter((word) => word.length > 0);
    const wordCount = words.length;
    const wordsPerMinute = 250;
    const readingTimeMinutes = wordCount / wordsPerMinute;
    return Math.ceil(readingTimeMinutes);
  }
}






