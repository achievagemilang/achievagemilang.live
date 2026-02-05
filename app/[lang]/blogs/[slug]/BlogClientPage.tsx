'use client';

import RelatedBlogs from '@/components/blogs/related-blogs';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/content-config';
import { useBlogViewCount } from '@/hooks/use-blog-view-count';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, Eye } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Import MDXContent with dynamic import to ensure it only runs on the client
const MDXContent = dynamic(() => import('@/components/mdx-content'), {
  ssr: false, // This is crucial - disables server-side rendering
  loading: () => <div className="animate-pulse h-96 bg-muted/20 rounded-md"></div>,
});

interface BlogPostClientProps {
  post: Post;
  allPosts: Post[];
}

export default function BlogPostClient({ post, allPosts }: BlogPostClientProps) {
  const url = `https://achievagemilang.dev/blogs/${post.slug}`;
  const publishedTime = new Date(post.date).toISOString();

  // Fetch and increment view count from Redis
  const { viewCount, isLoading: isViewCountLoading } = useBlogViewCount(post.slug, {
    initialCount: 0,
    incrementOnMount: true,
  });

  // Generate JSON-LD structured data for SEO
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: 'https://achievagemilang.dev/AGLogoRevamped.png',
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      '@type': 'Person',
      name: 'Achieva Futura Gemilang',
      url: 'https://achievagemilang.dev',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Achieva Futura Gemilang',
      logo: {
        '@type': 'ImageObject',
        url: 'https://achievagemilang.dev/AGLogoRevamped.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: post.tags?.join(', ') || '',
    articleSection: post.tags?.[0] || 'Blog',
    timeRequired: `PT${post.readingTime}M`,
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://achievagemilang.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Writes',
        item: 'https://achievagemilang.dev/blogs',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: url,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="container mx-auto py-12">
        <article
          className="prose dark:prose-invert max-w-none"
          itemScope
          itemType="https://schema.org/BlogPosting"
        >
          {/* Enhanced Header Section */}
          <div className="not-prose space-y-6 mb-12">
            {/* Animated Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground bg-clip-text transition-all duration-500 hover:from-primary hover:via-red-500 hover:to-orange-500 hover:text-transparent cursor-default"
              itemProp="headline"
            >
              {post.title}
            </motion.h1>

            {/* Author Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-border shadow-sm">
                <Image
                  src="/AGLogoRevamped.png"
                  alt="Achieva Futura Gemilang"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-foreground font-semibold">Achieva Futura Gemilang</span>
                <span className="text-muted-foreground text-xs">Author</span>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <time
                  dateTime={post.date}
                  itemProp="datePublished"
                  className="text-muted-foreground whitespace-nowrap"
                >
                  {format(new Date(post.date), 'MMM d, yyyy')}
                </time>
              </div>

              <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground whitespace-nowrap" itemProp="timeRequired">
                  {post.readingTime} min
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                {isViewCountLoading ? (
                  <Skeleton className="h-3.5 w-8" />
                ) : (
                  <span className="text-muted-foreground whitespace-nowrap">
                    {viewCount.toLocaleString()}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-2"
              >
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium hover:bg-primary/20 transition-colors cursor-default"
                    itemProp="keywords"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          <div className="px-8 py-4 border border-border rounded-md" itemProp="articleBody">
            {post.mdxSource ? (
              <div className="mdx-content">
                <MDXContent source={post.mdxSource} />
              </div>
            ) : (
              <div className="bg-muted/20">{'No content available'}</div>
            )}
          </div>
        </article>

        {/* Related Posts Section */}
        <RelatedBlogs currentPostSlug={post.slug} posts={allPosts} />
      </div>
    </>
  );
}
