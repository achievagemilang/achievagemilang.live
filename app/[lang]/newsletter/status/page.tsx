import { Button } from '@/components/ui/button';
import { getDictionary } from '@/locales/get-dictionary';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

type StatusType = 'confirmed' | 'unsubscribed' | 'error';

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ type?: StatusType; message?: string }>;
}

export default async function NewsletterStatusPage({ params, searchParams }: PageProps) {
  const { lang } = await params;
  const { type, message } = await searchParams;
  const t = await getDictionary(lang);

  const statusConfig = {
    confirmed: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950',
      title: t.newsletter.status.confirmed.title,
      description: t.newsletter.status.confirmed.message,
    },
    unsubscribed: {
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      title: t.newsletter.status.unsubscribed.title,
      description: t.newsletter.status.unsubscribed.message,
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
      title: t.newsletter.status.error.title,
      description: message || t.newsletter.status.error.message,
    },
  };

  const config = statusConfig[type || 'error'];
  const Icon = config.icon;

  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-md mx-auto">
        <div className={`p-8 rounded-lg border ${config.bgColor}`}>
          <div className="flex flex-col items-center text-center space-y-4">
            <Icon className={`h-16 w-16 ${config.iconColor}`} />
            <h1 className="text-2xl font-bold">{config.title}</h1>
            <p className="text-muted-foreground">{config.description}</p>
            <Button asChild className="mt-4">
              <Link href={`/${lang}/blogs`}>{t.newsletter.status.goToBlog}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
