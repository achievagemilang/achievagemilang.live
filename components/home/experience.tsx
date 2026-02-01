'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageWithSkeleton from '@/components/ui/image-with-skeleton';
import type { Experience } from '@/content-config';
import { useLanguage } from '@/context/language-context';
import { format } from 'date-fns';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { Briefcase, Calendar, ChevronDown, ExternalLink, GraduationCap, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import StickyExperienceCard from './sticky-experience-card';

interface ExperienceProps {
  experiences: Experience[];
}

function groupExperiencesById(experiences: Experience[]) {
  const groups: Record<string, Experience[]> = {};
  experiences.forEach((exp) => {
    if (!groups[exp._id]) groups[exp._id] = [];
    groups[exp._id].push(exp);
  });
  // Sort each group by startDate descending
  Object.values(groups).forEach((group) =>
    group.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  );
  return Object.values(groups);
}

export default function Experience({ experiences }: ExperienceProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const [activeFilter, setActiveFilter] = useState<'professional' | 'education' | 'volunteer'>(
    'professional'
  );
  const [visibleCount, setVisibleCount] = useState(3);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const filteredExperiences = experiences
    .filter((exp) => exp.category === activeFilter)
    .sort((a, b) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

  const groupedExperiences = groupExperiencesById(filteredExperiences);
  const visibleExperiences = groupedExperiences.slice(0, visibleCount);
  const hasMore = groupedExperiences.length > visibleCount;

  // Reset visible count and expanded cards when filter changes
  useEffect(() => {
    setVisibleCount(3);
    setExpandedCards(new Set());
  }, [activeFilter]);

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, groupedExperiences.length));
  };

  const handleCollapseAll = () => {
    setVisibleCount(3);
    // Smooth scroll to top of experience section after collapse animation
    setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      }
    }, 350); // Delay to allow collapse animation to complete
  };

  // Only show "Collapse All" if we've expanded beyond the initial count (3) and all items are visible
  const isAllExpanded = visibleCount > 3 && visibleCount >= groupedExperiences.length;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const totalVisibleCards = visibleExperiences.reduce((acc, group) => acc + group.length, 0);

  return (
    <motion.section
      ref={sectionRef}
      className="py-16 bg-muted/50"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container px-4 sm:px-6">
        <motion.h2
          className="text-3xl font-bold mb-4 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          {t.home.experience.title}
        </motion.h2>

        {/* Category Filter Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-12 px-2 sm:px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            variant={activeFilter === 'professional' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('professional')}
            className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2"
          >
            <Briefcase size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">{t.home.experience.professional}</span>
            <span className="xs:hidden">{t.home.experience.work}</span>
          </Button>
          <Button
            variant={activeFilter === 'education' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('education')}
            className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2"
          >
            <GraduationCap size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">{t.home.experience.education}</span>
            <span className="xs:hidden">{t.home.experience.edu}</span>
          </Button>
          <Button
            variant={activeFilter === 'volunteer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('volunteer')}
            className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2"
          >
            <Heart size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="hidden xs:inline">{t.home.experience.volunteer}</span>
            <span className="xs:hidden">{t.home.experience.org}</span>
          </Button>
        </motion.div>

        {/* Mobile View - Sticky Deck */}
        <div className="block md:hidden pb-12">
          {/* Added pb-12 to ensure last card has space */}
          <AnimatePresence mode="popLayout">
            {visibleExperiences.map((group, groupIdx) => (
              <StickyExperienceCard
                key={group[0]._id}
                experiences={group}
                index={groupIdx}
                isExpanded={expandedCards.has(group[0]._id)}
                onToggle={toggleCard}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Desktop View - Timeline */}
        <motion.div
          className="hidden md:block relative max-w-3xl mx-auto"
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          {/* Timeline line - animate it growing */}
          <motion.div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-border"
            initial={{ height: 0 }}
            animate={isInView ? { height: '100%' } : { height: 0 }}
            transition={{ duration: 1.5 }}
          />

          <AnimatePresence mode="popLayout">
            {visibleExperiences.map((group, groupIdx) =>
              group.length === 1 ? (
                <motion.div
                  key={group[0]._id}
                  variants={item}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="relative mb-8 md:mb-12 pl-0 md:pl-0"
                >
                  {/* Timeline dot - with pulse animation */}
                  <motion.div
                    className="hidden md:block absolute left-1/2 top-6 w-3 h-3 rounded-full bg-transparent -ml-1.5"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                    transition={{ delay: 0.2 + groupIdx * 0.2, duration: 0.5 }}
                  />
                  <Card
                    className={`group transition-all duration-300 hover:shadow-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden ${
                      groupIdx % 2 === 0 ? 'md:ml-auto md:mr-16' : 'md:mr-auto md:ml-16'
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        {group[0].logoUrl && (
                          <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-border/50 bg-background p-2 shadow-sm group-hover:border-primary/30 transition-colors">
                            <ImageWithSkeleton
                              src={group[0].logoUrl || '/placeholder.svg'}
                              alt={`${group[0].company} logo`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-xl font-bold mb-1.5 leading-tight">
                                {group[0].company}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar size={14} className="flex-shrink-0" />
                                <span className="font-medium">
                                  {format(new Date(group[group.length - 1].startDate), 'MMM yyyy')}{' '}
                                  -{' '}
                                  {group[0].endDate
                                    ? format(new Date(group[0].endDate), 'MMM yyyy')
                                    : t.home.experience.present}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0 h-9 w-9 p-0 rounded-lg hover:bg-muted self-center"
                              onClick={() => toggleCard(group[0]._id)}
                              aria-label={expandedCards.has(group[0]._id) ? 'Collapse' : 'Expand'}
                            >
                              <motion.div
                                animate={{
                                  rotate: expandedCards.has(group[0]._id) ? 180 : 0,
                                }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </motion.div>
                            </Button>
                          </div>
                          <p className="text-base leading-relaxed text-muted-foreground">
                            {group[0].description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <AnimatePresence>
                      {expandedCards.has(group[0]._id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <CardContent className="pt-0 pb-6">
                            <div className="space-y-6">
                              {group.map((exp, idx) => (
                                <div
                                  key={`${exp._id}-${exp.startDate}`}
                                  className="relative pl-6 border-l-2 border-primary/20"
                                >
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-sm" />
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="text-lg font-semibold text-foreground mb-1">
                                        {exp.position}
                                      </h4>
                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar size={12} className="flex-shrink-0" />
                                          <span>
                                            {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                                            {exp.endDate
                                              ? format(new Date(exp.endDate), 'MMM yyyy')
                                              : t.home.experience.present}
                                          </span>
                                        </div>
                                        {exp.type && (
                                          <span className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-0.5 text-xs text-secondary-foreground ring-1 ring-inset ring-secondary/50">
                                            {exp.type}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <ul className="space-y-2.5">
                                      {exp.achievements.map((ach, i) => (
                                        <li
                                          key={i}
                                          className="text-sm leading-relaxed text-muted-foreground flex items-start gap-2.5"
                                        >
                                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                                          <div className="flex-1 prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown
                                              components={{
                                                p: ({ children }) => <span>{children}</span>,
                                                strong: ({ children }) => (
                                                  <strong className="font-semibold text-foreground">
                                                    {children}
                                                  </strong>
                                                ),
                                                em: ({ children }) => (
                                                  <em className="italic">{children}</em>
                                                ),
                                                a: ({ href, children }) => (
                                                  <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline font-medium"
                                                  >
                                                    {children}
                                                  </a>
                                                ),
                                                ul: ({ children }) => (
                                                  <ul className="list-disc list-inside space-y-1 my-2">
                                                    {children}
                                                  </ul>
                                                ),
                                                ol: ({ children }) => (
                                                  <ol className="list-decimal list-inside space-y-1 my-2">
                                                    {children}
                                                  </ol>
                                                ),
                                                li: ({ children }) => (
                                                  <li className="text-sm">{children}</li>
                                                ),
                                              }}
                                            >
                                              {ach}
                                            </ReactMarkdown>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {group[0].website && (
                              <div className="flex justify-end mt-6 pt-4 border-t border-border/50">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                                  onClick={() => window.open(group[0].website, '_blank')}
                                >
                                  {t.home.experience.visitWebsite}
                                  <ExternalLink size={14} className="flex-shrink-0" />
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key={group[0]._id}
                  variants={item}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="relative mb-8 md:mb-12 pl-0 md:pl-0"
                >
                  {/* Timeline dot - with pulse animation */}
                  <motion.div
                    className="hidden md:block absolute left-1/2 top-6 w-3 h-3 rounded-full bg-transparent -ml-1.5"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: [0, 1.2, 1] } : { scale: 0 }}
                    transition={{ delay: 0.2 + groupIdx * 0.2, duration: 0.5 }}
                  />

                  <Card
                    className={`group transition-all duration-300 hover:shadow-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden ${
                      groupIdx % 2 === 0 ? 'md:ml-auto md:mr-16' : 'md:mr-auto md:ml-16'
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        {group[0].logoUrl && (
                          <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-border/50 bg-background p-2 shadow-sm group-hover:border-primary/30 transition-colors">
                            <ImageWithSkeleton
                              src={group[0].logoUrl || '/placeholder.svg'}
                              alt={`${group[0].company} logo`}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-xl font-bold mb-1.5 leading-tight">
                                {group[0].company}
                              </CardTitle>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar size={14} className="flex-shrink-0" />
                                <span className="font-medium">
                                  {format(new Date(group[group.length - 1].startDate), 'MMM yyyy')}{' '}
                                  -{' '}
                                  {group[0].endDate
                                    ? format(new Date(group[0].endDate), 'MMM yyyy')
                                    : t.home.experience.present}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0 h-9 w-9 p-0 rounded-lg hover:bg-muted self-center"
                              onClick={() => toggleCard(group[0]._id)}
                              aria-label={expandedCards.has(group[0]._id) ? 'Collapse' : 'Expand'}
                            >
                              <motion.div
                                animate={{
                                  rotate: expandedCards.has(group[0]._id) ? 180 : 0,
                                }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </motion.div>
                            </Button>
                          </div>
                          <p className="text-base leading-relaxed text-muted-foreground">
                            {group[0].description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <AnimatePresence>
                      {expandedCards.has(group[0]._id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                          style={{ overflow: 'hidden' }}
                        >
                          <CardContent className="pt-0 pb-6">
                            <div className="space-y-6">
                              {group.map((exp, idx) => (
                                <div
                                  key={`${exp._id}-${exp.startDate}`}
                                  className="relative pl-6 border-l-2 border-primary/20"
                                >
                                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-2 border-background shadow-sm" />
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="text-lg font-semibold text-foreground mb-1">
                                        {exp.position}
                                      </h4>
                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                          <Calendar size={12} className="flex-shrink-0" />
                                          <span>
                                            {format(new Date(exp.startDate), 'MMM yyyy')} -{' '}
                                            {exp.endDate
                                              ? format(new Date(exp.endDate), 'MMM yyyy')
                                              : t.home.experience.present}
                                          </span>
                                        </div>
                                        {exp.type && (
                                          <span className="inline-flex items-center rounded-md bg-secondary/50 px-2 py-0.5 text-xs text-secondary-foreground ring-1 ring-inset ring-secondary/50">
                                            {exp.type}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <ul className="space-y-2.5">
                                      {exp.achievements.map((ach, i) => (
                                        <li
                                          key={i}
                                          className="text-sm leading-relaxed text-muted-foreground flex items-start gap-2.5"
                                        >
                                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary/60 mt-2" />
                                          <div className="flex-1 prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown
                                              components={{
                                                p: ({ children }) => <span>{children}</span>,
                                                strong: ({ children }) => (
                                                  <strong className="font-semibold text-foreground">
                                                    {children}
                                                  </strong>
                                                ),
                                                em: ({ children }) => (
                                                  <em className="italic">{children}</em>
                                                ),
                                                a: ({ href, children }) => (
                                                  <a
                                                    href={href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline font-medium"
                                                  >
                                                    {children}
                                                  </a>
                                                ),
                                                ul: ({ children }) => (
                                                  <ul className="list-disc list-inside space-y-1 my-2">
                                                    {children}
                                                  </ul>
                                                ),
                                                ol: ({ children }) => (
                                                  <ol className="list-decimal list-inside space-y-1 my-2">
                                                    {children}
                                                  </ol>
                                                ),
                                                li: ({ children }) => (
                                                  <li className="text-sm">{children}</li>
                                                ),
                                              }}
                                            >
                                              {ach}
                                            </ReactMarkdown>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {group[0].website && (
                              <div className="flex justify-end mt-6 pt-4 border-t border-border/50">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                                  onClick={() => window.open(group[0].website, '_blank')}
                                >
                                  {t.home.experience.visitWebsite}
                                  <ExternalLink size={14} className="flex-shrink-0" />
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </motion.div>

        {/* Show More / Collapse All Buttons - Outside timeline container */}
        {(hasMore || isAllExpanded) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex justify-center mt-8 gap-3"
          >
            {hasMore && (
              <Button variant="outline" onClick={handleShowMore} className="gap-2">
                {t.home.experience.showMore.replace(
                  '{count}',
                  String(Math.min(3, groupedExperiences.length - visibleCount))
                )}
              </Button>
            )}
            {isAllExpanded && (
              <Button variant="outline" onClick={handleCollapseAll} className="gap-2">
                {t.home.experience.collapseAll}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
