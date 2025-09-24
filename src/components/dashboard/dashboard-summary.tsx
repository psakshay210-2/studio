'use client';
import { useState, useEffect, useRef } from 'react';
import { summarizeDashboard } from '@/ai/flows/personalized-dashboard-summarization';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MOCK_TASKS, MOCK_APPROVALS } from '@/lib/data';
import { useEvents } from '@/contexts/event-context';
import { useRole } from '@/contexts/role-context';
import { Sparkles } from 'lucide-react';
import type { Role } from '@/lib/types';

const summaryCache = new Map<Role, string>();

export function DashboardSummary() {
  const { role } = useRole();
  const { events } = useEvents();
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSummary() {
      if (summaryCache.has(role)) {
        setSummary(summaryCache.get(role)!);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const input = {
          userRole: role,
          currentActivities: 'Preparing for upcoming events and managing tasks.',
          events: events.map(e => `${e.name} on ${e.startDate}`),
          tasks: MOCK_TASKS.filter(t => t.status !== 'Done').map(t => t.title),
          updates: role === 'Approver' ? MOCK_APPROVALS.map(a => `Approval request for ${a.item}`) : [],
        };
        const result = await summarizeDashboard(input);
        setSummary(result.summary);
        summaryCache.set(role, result.summary);
      } catch (error) {
        console.error('Error generating summary:', error);
        // Don't cache errors, just show a message.
        setSummary('Could not generate a summary at this time due to high traffic. Please try again in a moment.');
      } finally {
        setLoading(false);
      }
    }
    getSummary();
  }, [role, events]);

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-primary">
          <Sparkles className="w-6 h-6" />
          Personalized Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : (
          <div className="text-foreground/90 whitespace-pre-wrap">{summary}</div>
        )}
      </CardContent>
    </Card>
  );
}
