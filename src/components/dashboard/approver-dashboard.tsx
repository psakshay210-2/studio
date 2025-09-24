'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MOCK_APPROVALS, MOCK_SERVICE_REQUESTS } from '@/lib/data';
import { CheckCircle, XCircle } from 'lucide-react';
import { DashboardSummary } from './dashboard-summary';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import type { Approval, ServiceRequest, Event } from '@/lib/types';
import { useEvents } from '@/contexts/event-context';
import Link from 'next/link';

export function ApproverDashboard() {
    const { toast } = useToast();
    const { events, updateEvent } = useEvents();

    const [approvals, setApprovals] = useState<Approval[]>(MOCK_APPROVALS);
    const [eventsForApproval, setEventsForApproval] = useState<Event[]>([]);
    const [serviceRequestsForApproval, setServiceRequestsForApproval] = useState<ServiceRequest[]>([]);


    useEffect(() => {
        setEventsForApproval(events.filter(e => e.status === 'Pending Approval'));
    }, [events]);

    useEffect(() => {
        setServiceRequestsForApproval(MOCK_SERVICE_REQUESTS.filter(sr => sr.status === 'Pending Approval'));
    }, []);


    const handleApproval = (id: string, approved: boolean) => {
        const item = approvals.find(a => a.id === id);
        if (!item) return;

        toast({
            title: approved ? 'Request Approved' : 'Request Denied',
            description: `You have ${approved ? 'approved' : 'denied'} the request for "${item.item}".`,
        });
        setApprovals(approvals.filter(a => a.id !== id));
    };

    const handleEventApproval = (id: string, approved: boolean) => {
        const event = events.find(e => e.id === id);
        if (!event) return;
        const newStatus = approved ? 'Upcoming' : 'Cancelled';
        updateEvent(id, { status: newStatus });
        toast({
            title: `Event ${approved ? 'Approved' : 'Rejected'}`,
            description: `The event "${event.name}" has been ${approved ? 'approved' : 'rejected'}.`,
        });
    }

    const handleServiceRequestApproval = (id: string, approved: boolean) => {
        const request = serviceRequestsForApproval.find(sr => sr.id === id);
        if (!request) return;

        // In a real app, you'd update the state in your context/backend
        setServiceRequestsForApproval(prev => prev.filter(sr => sr.id !== id));

        toast({
            title: `Service Bid ${approved ? 'Approved' : 'Rejected'}`,
            description: `The bid for "${request.service}" has been ${approved ? 'approved' : 'rejected'}.`,
        });
    }


  return (
     <div className="grid gap-6">
        <DashboardSummary />
        
        {eventsForApproval.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Event Launch Approvals</CardTitle>
                    <CardDescription>The following events are waiting for your approval to go live.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {eventsForApproval.map(event => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/events/${event.id}`} className="hover:underline text-primary">
                                            {event.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{event.startDate}</TableCell>
                                    <TableCell>{event.location}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleEventApproval(event.id, true)}>
                                                <CheckCircle className="h-5 w-5" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleEventApproval(event.id, false)}>
                                                <XCircle className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}

        {serviceRequestsForApproval.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>Service Request Approvals</CardTitle>
                    <CardDescription>The following service bids from vendors require your approval.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Vendor Bid</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serviceRequestsForApproval.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell>{events.find(e => e.id === req.eventId)?.name}</TableCell>
                                    <TableCell className="font-medium">{req.service}</TableCell>
                                    <TableCell>{req.appliedVendor?.name}</TableCell>
                                    <TableCell>${req.bidAmount?.toLocaleString()}</TableCell>
                                    <TableCell className="text-center">
                                    <div className="flex justify-center gap-2">
                                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleServiceRequestApproval(req.id, true)}>
                                            <CheckCircle className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleServiceRequestApproval(req.id, false)}>
                                            <XCircle className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}

        <Card>
        <CardHeader>
            <CardTitle>Pending Financial Approvals</CardTitle>
            <CardDescription>Review and respond to the following financial requests.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Submitted By</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {approvals.map((approval) => (
                <TableRow key={approval.id}>
                    <TableCell className="font-medium">{approval.eventName}</TableCell>
                    <TableCell>{approval.item}</TableCell>
                    <TableCell>{approval.submittedBy}</TableCell>
                    <TableCell className="text-right">${approval.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApproval(approval.id, true)}>
                        <CheckCircle className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleApproval(approval.id, false)}>
                        <XCircle className="h-5 w-5" />
                        </Button>
                    </div>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </CardContent>
        </Card>
    </div>
  );
}
