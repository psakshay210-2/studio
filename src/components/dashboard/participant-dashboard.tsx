import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MOCK_EVENTS } from '@/lib/data';
import Image from 'next/image';
import { Ticket } from 'lucide-react';
import { DashboardSummary } from './dashboard-summary';

export function ParticipantDashboard() {
  const myEvents = MOCK_EVENTS.slice(0, 2);

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
            <Card key={event.id} className="overflow-hidden">
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
                <CardDescription>{event.date} at {event.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
