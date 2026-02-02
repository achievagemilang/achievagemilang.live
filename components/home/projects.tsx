'use client';

import SpotlightProject from '@/components/projects/spotlight-project';
import { Button } from '@/components/ui/button';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
  year?: number;
  slug?: string;
  tldr?: string[];
}

interface ProjectsProps {
  projects: Project[];
}

import { useLanguage } from '@/context/language-context';

export default function Projects({ projects }: ProjectsProps) {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 md:py-24"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container">
        <motion.div
          className="flex justify-between items-center mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t.home.projects.title}
          </h2>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/projects">{t.home.projects.viewAll}</Link>
          </Button>
        </motion.div>

        <motion.div variants={container} initial="hidden" animate={isInView ? 'show' : 'hidden'}>
          {projects.map((project, index) => (
            <motion.div key={project.id} variants={item}>
              <SpotlightProject project={project} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
