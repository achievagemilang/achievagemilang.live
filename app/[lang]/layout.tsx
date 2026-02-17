import '@/app/globals.css';
import Footer from '@/components/layout/footer';
import GlobalAIChat from '@/components/layout/global-ai-chat';
import Navbar from '@/components/layout/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { AIChatProvider } from '@/context/ai-chat-context';
import { LanguageProvider } from '@/context/language-context';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Home | Achieva Futura Gemilang',
  description: 'Professional portfolio showcasing projects, experiences, and blog posts',
  icons: {
    icon: [
      {
        url: '/AGLogoRevamped.png',
        href: '/AGLogoRevamped.png',
      },
    ],
    apple: {
      url: '/AGLogoRevamped.png',
      href: '/AGLogoRevamped.png',
    },
    shortcut: {
      url: '/AGLogoRevamped.png',
      href: '/AGLogoRevamped.png',
    },
  },
};

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'id' }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AIChatProvider>
            <LanguageProvider initialLang={lang as 'en' | 'id'}>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">{children}</main>
                <Analytics />
                <Footer />
              </div>
              <Toaster />
              <SonnerToaster />
              <GlobalAIChat />
            </LanguageProvider>
          </AIChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
