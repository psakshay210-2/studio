'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useEvents } from '@/contexts/event-context';
import Image from 'next/image';
import { Ticket } from 'lucide-react';
import { DashboardSummary } from './dashboard-summary';
import Link from 'next/link';

export function ParticipantDashboard() {
  const { events } = useEvents();
  const myEvents = events.filter(e => !e.parentId).slice(0, 2);

  return (
    <div className="grid gap-6">
      <DashboardSummary />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            My Upcoming Events
          </CardTitle>
          <CardDescription>Here are the events you are registered for.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          {myEvents.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className="group">
              <Card className="overflow-hidden h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                <Image
                  src={event.image}
                  alt={event.name}
                  width={600}
                  height={400}
                  className="w-full h-40 object-cover"
                  data-ai-hint="event poster"
                />
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription>{event.startDate} at {event.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
