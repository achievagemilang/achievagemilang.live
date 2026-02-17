'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/language-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  honeypot: z.string().max(0).optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe');
      }

      toast.success(result.message || t.newsletter.success);
      reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(error instanceof Error ? error.message : t.newsletter.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Honeypot field - hidden from users */}
        <input
          type="text"
          {...register('honeypot')}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Email input */}
        <div className="flex-1">
          <Input
            type="email"
            placeholder={t.newsletter.placeholder}
            {...register('email')}
            disabled={isLoading}
            className="w-full"
          />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
        </div>

        {/* Submit button */}
        <Button type="submit" disabled={isLoading} className="sm:w-auto w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.newsletter.subscribing}
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              {t.newsletter.subscribe}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
