'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/icons/logo';
import { MOCK_USERS } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: 'password', // Pre-filled for demo purposes
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setIsLoggingIn(true);
    const success = login(data.email);
    if (!success) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'No user found with that email. Please use one of the demo accounts below.',
      });
      setIsLoggingIn(false);
    }
  };

  const handleDemoLogin = (email: string) => {
    form.setValue('email', email);
    form.handleSubmit(onSubmit)();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
            <Logo className="w-16 h-16 mb-4" />
            <h1 className="text-3xl font-bold font-headline">Welcome to EventFlow</h1>
            <p className="text-muted-foreground">The all-in-one platform for event management.</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="balaji@eventflow.com" {...field} disabled={isLoggingIn} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} disabled={isLoggingIn} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn && <Loader2 className="animate-spin" />}
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Demo Accounts</CardTitle>
                <CardDescription className="text-xs">Click any account to log in instantly. (Password is "password")</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {MOCK_USERS.map(user => (
                    <button key={user.id} onClick={() => handleDemoLogin(user.email)} className="w-full text-left p-2 rounded-md hover:bg-muted transition-colors flex justify-between items-center text-sm" disabled={isLoggingIn}>
                        <span>{user.email}</span>
                        <Badge variant="secondary">{user.role}</Badge>
                    </button>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
