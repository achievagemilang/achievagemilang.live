'use client';

import NewsletterForm from '@/components/shared/newsletter-form';
import { useLanguage } from '@/context/language-context';
import { BookOpen, Github, Instagram, Linkedin, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const { t } = useLanguage();
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto">
        {/* Newsletter Section */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">{t.newsletter.heading}</h3>
            <p className="text-sm text-muted-foreground">{t.newsletter.description}</p>
          </div>
          <NewsletterForm />
        </div>

        {/* Existing Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-border">
          {/* Logo on the left */}
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-10 overflow-hidden">
                <Image
                  src="/AGLogoRevamped.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-bold">Achieva Gemilang</span>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground mb-4 md:mb-0 text-center md:text-left w-full md:w-auto">
            © {currentYear} Achieva Futura Gemilang. {t.footer.rights}
          </div>

          {/* Social links on the right */}
          <div className="flex items-center space-x-4">
            <a
              href="https://linkedin.com/in/achieva-futura-gemilang"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://instagram.com/achieva17_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Line"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://github.com/achievagemilang"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="mailto:achievafuturagemilang@gmail.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href="https://medium.com/@achievafuturagemilang"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Medium"
            >
              <BookOpen size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
