'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEvents } from '@/contexts/event-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { useRouter } from 'next/navigation';


export default function EventsPage() {
  const { events } = useEvents();
  const router = useRouter();

  return (
    <div className="space-y-8">
      <PageHeader title="Events" description="Manage all your past and upcoming events.">
        <Button asChild>
          <Link href="/events/create">
            <PlusCircle />
            Create Event
          </Link>
        </Button>
      </PageHeader>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col">
            <div className="relative">
              <Image
                src={event.image}
                alt={event.name}
                width={600}
                height={400}
                className="w-full h-48 object-cover rounded-t-lg"
                data-ai-hint="event poster"
              />
              <Badge className="absolute top-2 right-2">{event.status}</Badge>
            </div>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>{event.date} &middot; {event.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push(`/events/${event.id}`)}>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
