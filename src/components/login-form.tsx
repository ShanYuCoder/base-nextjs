'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { LoginRequest } from '@portal/models/auth';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui';
import { useAuth } from '@/hooks/use-auth';
import { ApiClientError } from '@/lib/api-client';
import { LOCAL_AUTH_EMAIL } from '@/config/local-auth';
import { loginFormSchema } from '@/validations/auth/schemas';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/';
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: LOCAL_AUTH_EMAIL, password: '' },
  });

  const onSubmit = async (data: LoginRequest) => {
    setError(null);
    try {
      await login(data);
      router.replace(nextPath);
    } catch (err) {
      if (err instanceof ApiClientError && err.statusCode === 403) {
        setError('このポータルへのアクセス権限がありません。');
        return;
      }
      setError('メールアドレスまたはパスワードが正しくありません。');
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} data-testid="auth-login-page" {...props}>
      <Card>
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>アカウント情報を入力してください。</CardDescription>
        </CardHeader>
        <CardContent>
          <form data-testid="auth-login-form" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {error && (
                <div
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  data-testid="auth-login-error-alert"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="email">メールアドレス</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  testId="auth-login-email-input"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">パスワード</FieldLabel>
                  <Link
                    href="/forgot-password/"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    パスワードをお忘れですか？
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  testId="auth-login-password-input"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={isSubmitting} testId="auth-login-submit-btn">
                  {isSubmitting ? 'ログイン中...' : 'ログイン'}
                </Button>
                <Button variant="outline" type="button" className="w-full">
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
