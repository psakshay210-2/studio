'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Handshake } from 'lucide-react';
import { DashboardSummary } from './dashboard-summary';
import type { ServiceRequest } from '@/lib/types';
import { useState } from 'react';
import { useEvents } from '@/contexts/event-context';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/contexts/role-context';
import { SubmitBidDialog } from '../service-requests/submit-bid-dialog';

export function VendorDashboard() {
  const { events, serviceRequests, updateServiceRequest } = useEvents();
  const { user } = useRole();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

  const myAgreements = serviceRequests.filter(sr => sr.awardedVendorId === user.id);
  const openOpportunities = serviceRequests.filter(sr => sr.status === 'Open');

  const handleBidSubmit = (requestId: string, amount: number) => {
    updateServiceRequest(requestId, {
        status: 'Pending Approval',
        appliedVendorId: user.id,
        bidAmount: amount
    });

    const request = serviceRequests.find(sr => sr.id === requestId);
    if(request) {
        toast({
            title: 'Bid Submitted!',
            description: `Your bid of $${amount.toLocaleString()} for "${request.service}" has been submitted for approval.`,
        });
    }
  };


  return (
    <div className="grid gap-6">
      <DashboardSummary />
      
      {myAgreements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Your Service Agreements
            </CardTitle>
            <CardDescription>Your current confirmed service agreements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {myAgreements.map(service => (
              <Card key={service.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">{service.service}</p>
                  <p className="text-sm text-muted-foreground">{events.find(e => e.id === service.eventId)?.name}</p>
                </div>
                <Badge>{service.status}</Badge>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5" />
            Open Opportunities
          </CardTitle>
          <CardDescription>Service requests you can bid on.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {openOpportunities.map(request => {
            const event = events.find(e => e.id === request.eventId);
            return (
              <Card key={request.id}>
                 <CardHeader>
                    <CardTitle>{request.service}</CardTitle>
                    <CardDescription>{event?.name}</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{request.description}</p>
                    <Button className="w-full" onClick={() => setSelectedRequest(request)}>Submit Bid</Button>
                 </CardContent>
              </Card>
            )
          })}
          {openOpportunities.length === 0 && (
            <p className="text-muted-foreground text-sm text-center col-span-full py-8">
              There are no open service opportunities at this time.
            </p>
          )}
        </CardContent>
      </Card>
      
      {selectedRequest && (
        <SubmitBidDialog
            isOpen={!!selectedRequest}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setSelectedRequest(null);
                }
            }}
            serviceRequest={selectedRequest}
            onSubmit={handleBidSubmit}
        />
      )}
    </div>
  );
}
