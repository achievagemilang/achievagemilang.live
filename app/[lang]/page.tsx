import BlogPosts from '@/components/home/blog-posts';
import Experience from '@/components/home/experience';
import Hero from '@/components/home/hero';
import Projects from '@/components/home/projects';
import PageTransition from '@/components/util/page-transition';
import { experiencesList } from '@/constant/constant';
import { createBlogPostRepository } from '@/infrastructure/config/blog-repositories.config';
import { createProjectService } from '@/infrastructure/config/repositories.config';

import { en } from '@/locales/en';
import { id } from '@/locales/id';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = lang === 'id' ? id : en;

  return {
    title: `Home | Achieva Futura Gemilang`,
    description: t.hero.description,
    openGraph: {
      title: `Home | Achieva Futura Gemilang`,
      description: t.hero.description,
      url: `https://achievagemilang.dev/${lang}`,
      type: 'website',
      images: [
        {
          url: 'https://achievagemilang.dev/AGLogoRevamped.png',
          width: 1200,
          height: 630,
          alt: 'Achieva Futura Gemilang',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Home | Achieva Futura Gemilang`,
      description: t.hero.description,
      images: ['https://achievagemilang.dev/AGLogoRevamped.png'],
    },
  };
}

export default async function Home() {
  const experiences = experiencesList;

  // Use repository for blog posts
  const blogPostRepository = createBlogPostRepository();
  const posts = await blogPostRepository.getAllPosts();
  const recentPosts = posts;

  // Use service for featured projects
  const projectService = createProjectService();
  const featuredProjects = projectService.getFeaturedProjects();

  return (
    <PageTransition>
      <main className="min-h-screen">
        <Hero />
        <Experience experiences={experiences} />
        <Projects projects={featuredProjects} />
        <BlogPosts posts={recentPosts} />
      </main>
    </PageTransition>
  );
}
