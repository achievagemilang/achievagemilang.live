import AnimatedAboutContent from '@/components/about/animated-about-content';
import AnimatedContactForm from '@/components/about/animated-contact-form';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Achieva Futura Gemilang',
  description:
    'Learn more about Achieva Futura Gemilang, a lifelong learner and software engineer, who is passionate about building scalable and efficient systems.',
  openGraph: {
    title: 'About | Achieva Futura Gemilang',
    description:
      'Learn more about Achieva Futura Gemilang, a lifelong learner and software engineer, who is passionate about building scalable and efficient systems.',
    url: 'https://achievagemilang.dev/about',
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
    title: 'About | Achieva Futura Gemilang',
    description:
      'Learn more about Achieva Futura Gemilang, a lifelong learner and software engineer, who is passionate about building scalable and efficient systems.',
    images: ['https://achievagemilang.dev/AGLogoRevamped.png'],
  },
};

export default function AboutPage() {
  return (
    <main className="container mx-auto py-12 px-2 md:px-4">
      <div className="container mx-auto py-12">
        <AnimatedAboutContent />
      </div>
      <section className="max-w-2xl mx-auto rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
        <AnimatedContactForm />
      </section>
    </main>
  );
}
