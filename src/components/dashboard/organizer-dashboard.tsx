'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MOCK_TASKS, MOCK_APPROVALS } from '@/lib/data';
import { useEvents } from '@/contexts/event-context';
import { List, Calendar, CheckSquare, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { DashboardSummary } from './dashboard-summary';
import { RegistrationsChart } from './registrations-chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import type { Approval } from '@/lib/types';
import { CreateFinancialRequestDialog } from './create-financial-request-dialog';

export function OrganizerDashboard() {
  const { events } = useEvents();
  const upcomingEvents = events
    .filter((e) => e.status === 'Upcoming' && !e.parentId)
    .slice(0, 2);
  const recentTasks = MOCK_TASKS.slice(0, 3);
  const selectableEvents = events.filter((e) => !e.parentId);
  const [selectedEventId, setSelectedEventId] = useState(
    selectableEvents[0]?.id
  );
  const [financialRequests, setFinancialRequests] = useState<Approval[]>(MOCK_APPROVALS.filter(a => a.submittedBy === 'Balaji M'));
  const [isCreateRequestOpen, setCreateRequestOpen] = useState(false);

  const handleAddRequest = (item: string, amount: number, eventName: string) => {
    const newRequest: Approval = {
        id: `approve-${Date.now()}`,
        eventName,
        item,
        amount,
        submittedBy: 'Balaji M'
    };
    setFinancialRequests(prev => [newRequest, ...prev]);
  };

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
              <Link
                href={`/events/${event.id}`}
                key={event.id}
                className="group"
              >
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
                    <p className="text-sm text-muted-foreground">
                      {event.startDate} &middot; {event.location}
                    </p>
                  </CardHeader>
                </Card>
              </Link>
            ))}
            {upcomingEvents.length === 0 && <p className="text-muted-foreground text-sm">No upcoming events.</p>}
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
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between"
              >
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {events.find((e) => e.id === task.eventId)?.name}
                  </p>
                </div>
                <Badge
                  variant={task.status === 'Done' ? 'secondary' : 'default'}
                  className={
                    task.status === 'In Progress'
                      ? 'bg-accent text-accent-foreground'
                      : ''
                  }
                >
                  {task.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Financial Requests</CardTitle>
              <CardDescription>Manage budget requests for your events.</CardDescription>
            </div>
            <Button onClick={() => setCreateRequestOpen(true)}>
              <PlusCircle/>
              New Request
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financialRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.eventName}</TableCell>
                  <TableCell>{request.item}</TableCell>
                  <TableCell className="text-right">${request.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))}
               {financialRequests.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No financial requests submitted.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <List className="w-5 h-5" /> Registrations Overview
              </CardTitle>
              <CardDescription>
                View registration trends for a specific event.
              </CardDescription>
            </div>
            <Select
              value={selectedEventId}
              onValueChange={setSelectedEventId}
            >
              <SelectTrigger className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select an event" />
              </SelectTrigger>
              <SelectContent>
                {selectableEvents.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <RegistrationsChart eventId={selectedEventId} />
        </CardContent>
      </Card>

      <CreateFinancialRequestDialog
        isOpen={isCreateRequestOpen}
        onOpenChange={setCreateRequestOpen}
        onFinancialRequestCreate={handleAddRequest}
      />
    </div>
  );
}
