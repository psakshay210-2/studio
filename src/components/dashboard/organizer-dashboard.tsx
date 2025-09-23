'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_TASKS } from '@/lib/data';
import { useEvents } from '@/contexts/event-context';
import { List, Calendar, CheckSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { DashboardSummary } from './dashboard-summary';
import { RegistrationsChart } from './registrations-chart';

export function OrganizerDashboard() {
  const { events } = useEvents();
  const upcomingEvents = events.filter(e => e.status === 'Upcoming' && !e.parentId).slice(0, 2);
  const recentTasks = MOCK_TASKS.slice(0, 3);

  return (
    <div className="grid gap-6">
      <DashboardSummary />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            {upcomingEvents.map((event) => (
              <Link href={`/events/${event.id}`} key={event.id} className="group">
                <Card className="overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                  <Image
                    src={event.image}
                    alt={event.name}
                    width={600}
                    height={400}
                    className="w-full h-32 object-cover"
                    data-ai-hint="event image"
                  />
                  <CardHeader>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{event.startDate} &middot; {event.location}</p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">{events.find(e => e.id === task.eventId)?.name}</p>
                </div>
                <Badge variant={task.status === 'Done' ? 'secondary' : 'default'} className={task.status === 'In Progress' ? 'bg-accent text-accent-foreground' : ''}>{task.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><List className="w-5 h-5" /> Registrations Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationsChart />
        </CardContent>
      </Card>
    </div>
  );
}
