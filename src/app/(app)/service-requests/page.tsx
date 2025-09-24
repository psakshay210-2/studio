'use client';

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvents } from "@/contexts/event-context";
import { MOCK_SERVICE_REQUESTS, MOCK_USERS } from "@/lib/data";
import type { ServiceRequest } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function ServiceRequestsPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>(MOCK_SERVICE_REQUESTS);
    const { events } = useEvents();

    const getStatusVariant = (status: ServiceRequest['status']) => {
        switch (status) {
            case 'Open': return 'secondary';
            case 'Pending Approval': return 'default';
            case 'Awarded': return 'outline'; // Or a custom success variant
            default: return 'default';
        }
    }

    return (
        <div className="space-y-8">
            <PageHeader title="Service Requests" description="Manage service needs for your events.">
                <Button>
                    <PlusCircle />
                    Create Request
                </Button>
            </PageHeader>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {requests.map(request => {
                    const event = events.find(e => e.id === request.eventId);
                    const appliedVendor = MOCK_USERS.find(u => u.id === request.appliedVendorId);
                    const awardedVendor = MOCK_USERS.find(u => u.id === request.awardedVendorId);

                    return (
                        <Card key={request.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{request.service}</CardTitle>
                                <CardDescription>{event?.name}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                               <div className="flex justify-between items-center">
                                    <p className="font-semibold text-sm">Status</p>
                                    <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                               </div>
                               <p className="text-sm text-muted-foreground line-clamp-3">{request.description}</p>
                               {appliedVendor && (
                                 <div>
                                    <p className="text-sm font-semibold">Vendor Bid</p>
                                    <p className="text-sm text-muted-foreground">{appliedVendor.name}</p>
                                 </div>
                               )}
                                {awardedVendor && (
                                    <div>
                                        <p className="text-sm font-semibold">Awarded To</p>
                                        <p className="text-sm text-muted-foreground">{awardedVendor.name}</p>
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full">View Details</Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
