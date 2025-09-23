'use client';

import { useEvents } from '@/contexts/event-context';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Ticket, Clapperboard, GalleryHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/role-context';
import Link from 'next/link';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { getEventById, getSubEvents } = useEvents();
  const { role } = useRole();
  const event = getEventById(id as string);
  const subEvents = getSubEvents(id as string);

  if (!event) {
    return (
        <div className="space-y-8">
            <PageHeader title="Event Not Found" description="Sorry, we couldn't find the event you're looking for." />
        </div>
    );
  }
  
  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    if (endDate) {
        const end = new Date(endDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
        return `${start} - ${end}`;
    }
    return start;
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

          {event.gallery && event.gallery.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><GalleryHorizontal /> Gallery</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery.map((imgUrl, index) => (
                  <Image key={index} src={imgUrl} alt={`${event.name} gallery image ${index + 1}`} width={400} height={300} className="rounded-lg object-cover aspect-video" data-ai-hint="event photo" />
                ))}
              </CardContent>
            </Card>
          )}

          {subEvents.length > 0 && (
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Clapperboard /> Sub-Events</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                    {subEvents.map(subEvent => (
                        <Link href={`/events/${subEvent.id}`} key={subEvent.id} className="group">
                        <Card className="overflow-hidden h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1">
                          <Image
                            src={subEvent.image}
                            alt={subEvent.name}
                            width={600}
                            height={400}
                            className="w-full h-40 object-cover"
                            data-ai-hint="event poster"
                          />
                          <CardHeader>
                            <CardTitle>{subEvent.name}</CardTitle>
                            <CardDescription>{formatDateRange(subEvent.startDate, subEvent.endDate)} at {subEvent.location}</CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                </CardContent>
            </Card>
          )}
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{formatDateRange(event.startDate, event.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge>{event.status}</Badge>
                    </div>
                     {event.parentId && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/events/${event.parentId}`}>
                          Part of a larger event
                        </Link>
                      </Button>
                    )}
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
