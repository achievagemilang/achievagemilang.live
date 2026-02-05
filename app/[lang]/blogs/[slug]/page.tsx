import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from './BlogClientPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post!.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const url = `https://achievagemilang.dev/blogs/${slug}`;
  const publishedTime = new Date(post.date).toISOString();
  const tags = post.tags || [];
  const keywords = tags.join(', ');

  return {
    title: `${post.title} | Achieva Futura Gemilang`,
    description: post.excerpt,
    keywords: keywords,
    authors: [{ name: 'Achieva Futura Gemilang', url: 'https://achievagemilang.dev' }],
    creator: 'Achieva Futura Gemilang',
    publisher: 'Achieva Futura Gemilang',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${post.title} | Achieva Futura Gemilang`,
      description: post.excerpt,
      url: url,
      type: 'article',
      publishedTime: publishedTime,
      authors: ['Achieva Futura Gemilang'],
      tags: tags,
      siteName: 'Achieva Futura Gemilang',
      images: [
        {
          url: 'https://achievagemilang.dev/AGLogoRevamped.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Achieva Futura Gemilang`,
      description: post.excerpt,
      creator: '@achievagemilang',
      images: ['https://achievagemilang.dev/AGLogoRevamped.png'],
    },
    other: {
      'article:published_time': publishedTime,
      'article:author': 'Achieva Futura Gemilang',
      'article:section': tags[0] || 'Blog',
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get all posts for related blogs section
  const allPosts = await getAllPosts();

  return <BlogPostClient post={post} allPosts={allPosts} />;
}
