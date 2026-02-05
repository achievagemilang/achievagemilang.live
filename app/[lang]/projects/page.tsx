import PageTransition from '@/components/util/page-transition';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProjectsClientPage from './ProjectClientPage';

export const metadata: Metadata = {
  title: 'Projects | Achieva Futura Gemilang',
  description: "Showcase of Achieva Futura Gemilang's projects and work.",
  openGraph: {
    title: 'Projects | Achieva Futura Gemilang',
    description: "Showcase of Achieva Futura Gemilang's projects and work.",
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
    title: 'Projects | Achieva Futura Gemilang',
    description: "Showcase of Achieva Futura Gemilang's projects and work.",
    images: ['https://achievagemilang.dev/AGLogoRevamped.png'],
  },
};

export default function ProjectsPage() {
  return (
    <PageTransition>
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsClientPage />
      </Suspense>
    </PageTransition>
  );
}
