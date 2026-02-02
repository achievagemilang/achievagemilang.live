'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ImageWithSkeleton from '@/components/ui/image-with-skeleton';
import { useLanguage } from '@/context/language-context';
import { TechStackBadge, getTechStackInfo } from '@/lib/tech-stack-logos';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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

interface SpotlightProjectProps {
  project: Project;
  index?: number;
}

export default function SpotlightProject({ project, index = 0 }: SpotlightProjectProps) {
  const { t, language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  // Filter tech stack tags
  const techStackTags = project.tags.filter((tag) => getTechStackInfo(tag) !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12 md:mb-20"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative group">
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />

        <Card className="relative overflow-hidden bg-background/50 backdrop-blur-xl border-border/50 rounded-[1.5rem] shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0 lg:gap-8">
            {/* Image Section */}
            <div
              className={`relative h-64 sm:h-80 lg:h-auto overflow-hidden group/image ${index % 2 === 1 ? 'lg:order-last' : ''}`}
            >
              <ImageWithSkeleton
                src={project.image || '/placeholder.svg'}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-1000 ease-out group-hover/image:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80 lg:opacity-40" />

              {/* Year Badge */}
              <div className="absolute top-6 left-6">
                <div className="relative px-4 py-1.5 rounded-full bg-background/90 backdrop-blur-md border border-border/50 shadow-lg flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span className="text-xs font-bold text-foreground tracking-wider">
                    Featured Project
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col p-6 sm:p-8 lg:py-10 lg:pr-10 justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-semibold text-primary tracking-wide uppercase">
                    {project.year}
                  </span>
                  <div className="h-px bg-border flex-1" />
                </div>

                <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* TL;DR Section */}
                {project.tldr && project.tldr.length > 0 && (
                  <div className="mb-8 space-y-3 bg-secondary/10 p-5 rounded-xl border border-secondary/20">
                    {project.tldr.map((point, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-foreground/90">{point}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {techStackTags.map((tag) => (
                    <TechStackBadge key={tag} tag={tag} />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="group/btn relative overflow-hidden bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 rounded-xl"
                  >
                    <Link href={`/${language}/projects/${project.slug}`}>
                      <span className="font-semibold">{t.project.card.viewDetails}</span>
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="group/btn border-border/50 hover:bg-muted/50 rounded-xl"
                  >
                    <Link href={project.link} target="_blank" rel="noopener noreferrer">
                      <span className="font-semibold">{t.project.card.visitProject}</span>
                      <ExternalLink className="h-4 w-4 ml-2 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:rotate-6" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
