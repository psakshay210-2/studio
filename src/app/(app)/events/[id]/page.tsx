'use client';

import { useEvents } from '@/contexts/event-context';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/role-context';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { getEventById } = useEvents();
  const { role } = useRole();
  const event = getEventById(id as string);

  if (!event) {
    return (
        <div className="space-y-8">
            <PageHeader title="Event Not Found" description="Sorry, we couldn't find the event you're looking for." />
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title={event.name} />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <Image
              src={event.image}
              alt={event.name}
              width={1200}
              height={600}
              className="w-full h-96 object-cover rounded-t-lg"
              data-ai-hint="event hero image"
            />
            <CardHeader>
                <CardTitle className="text-4xl">{event.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">{event.description}</p>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge>{event.status}</Badge>
                    </div>
                    {role === 'Participant' && (
                        <Button className="w-full mt-4">
                            <Ticket className="mr-2 h-4 w-4" />
                            Register Now
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
