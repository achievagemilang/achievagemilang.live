'use client';

import BlogCard from '@/components/blogs/blog-card';
import BlogCardSkeleton from '@/components/blogs/blog-card-skeleton';
import SearchBar from '@/components/molecule/search-bar';
import TagFilter from '@/components/molecule/tag-filter';
import NewsletterForm from '@/components/shared/newsletter-form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Post } from '@/content-config';
import { useLanguage } from '@/context/language-context';
import { AnimatePresence, motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface PostsProps {
  posts: Post[];
}

export default function BlogClientPage({ posts }: PostsProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || '1';

  const allPosts = posts;
  const [filteredPosts, setFilteredPosts] = useState(allPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const allTags = Array.from(new Set(allPosts.flatMap((post) => post.tags || [])));

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    allPosts.forEach((post) => {
      if (post.date) {
        const year = new Date(post.date).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [allPosts]);

  useEffect(() => {
    let result = allPosts;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTag) {
      result = result.filter((post) => post.tags?.includes(selectedTag));
    }

    if (selectedYears.length > 0) {
      result = result.filter((post) => {
        if (!post.date) return false;
        const year = new Date(post.date).getFullYear();
        return selectedYears.includes(year);
      });
    }

    setFilteredPosts(result);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedTag, selectedYears, allPosts]);

  const postsPerPage = 6;
  const totalPosts = filteredPosts.length;
  const totalPages = useMemo(
    () => Math.ceil(totalPosts / postsPerPage),
    [totalPosts, postsPerPage]
  );

  const currentPage = useMemo(() => {
    const pageNum = parseInt(page, 10);
    return Math.min(Math.max(pageNum, 1), totalPages || 1);
  }, [page, totalPages]);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  }, [filteredPosts, currentPage, postsPerPage]);

  const handleSearch = (query: string) => {
    if (query === searchQuery) return;
    setIsLoading(true);
    setSearchQuery(query);
    router.replace('?page=1', { scroll: false });
  };

  const handleTagSelect = (tag: string | null) => {
    if (tag === selectedTag) return;
    setIsLoading(true);
    setSelectedTag(tag);
    router.replace('?page=1', { scroll: false });
  };

  const toggleYear = (year: number) => {
    setIsLoading(true);
    const newSelectedYears = selectedYears.includes(year)
      ? selectedYears.filter((y) => y !== year)
      : [...selectedYears, year];
    setSelectedYears(newSelectedYears);
    router.replace('?page=1', { scroll: false });
  };

  const clearFilters = () => {
    setIsLoading(true);
    setSearchQuery('');
    setSelectedTag(null);
    setSelectedYears([]);
    router.replace('?page=1', { scroll: false });
  };

  const hasActiveFilters = searchQuery || selectedTag || selectedYears.length > 0;

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">{t.blog.title}</h1>

      {/* Newsletter Section */}
      <div className="mb-8 p-6 bg-muted/50 rounded-lg border">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-2">{t.newsletter.heading}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t.newsletter.description}</p>
          <NewsletterForm />
        </div>
      </div>

      {/* Search and Year Filter - Side by Side */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 w-full">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
        </div>

        {/* Year Filter Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              {t.blog.filter.year}
              {selectedYears.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {selectedYears.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t.blog.filter.filterByYear}</h4>
                <div className="space-y-2">
                  {availableYears.map((year) => (
                    <div key={year} className="flex items-center space-x-2">
                      <Checkbox
                        id={`year-${year}`}
                        checked={selectedYears.includes(year)}
                        onCheckedChange={() => toggleYear(year)}
                      />
                      <Label
                        htmlFor={`year-${year}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {year}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Tag Filter and Clear Button */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <TagFilter tags={allTags} onTagSelect={handleTagSelect} initialTag={selectedTag} />

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
            {t.blog.filter.clearFilters}
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </motion.div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <p className="text-lg text-muted-foreground">{t.blog.empty.noWrites}</p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              {t.blog.filter.clearFilters}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="posts-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {currentPosts.map((post, index) => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredPosts.length > 0 && (
        <>
          {totalPosts > 0 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {currentPage > 1 && (
                <Link
                  href={`?page=${currentPage - 1}`}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md border bg-foreground hover:bg-gray-300 text-background transition-colors shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  {t.blog.pagination.previous}
                </Link>
              )}
              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`?page=${pageNum}`}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-primary text-secondary'
                        : 'text-secondary-700 hover:bg-primary/10'
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>
              {currentPage < totalPages && (
                <Link
                  href={`?page=${currentPage + 1}`}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md border bg-foreground hover:bg-gray-300 text-background transition-colors shadow-sm"
                >
                  {t.blog.pagination.next}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
