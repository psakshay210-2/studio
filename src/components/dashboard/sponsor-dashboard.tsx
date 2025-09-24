'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_SPONSORSHIP_PACKAGES, MOCK_SPONSORSHIP_APPLICATIONS } from '@/lib/data';
import { Handshake } from 'lucide-react';
import { DashboardSummary } from './dashboard-summary';
import { useEvents } from '@/contexts/event-context';
import { useState } from 'react';
import { useRole } from '@/contexts/role-context';
import { useToast } from '@/hooks/use-toast';
import type { SponsorshipPackage, SponsorshipApplication } from '@/lib/types';
import { Badge } from '../ui/badge';

export function SponsorDashboard() {
  const { events } = useEvents();
  const { user } = useRole();
  const { toast } = useToast();
  
  const [packages, setPackages] = useState<SponsorshipPackage[]>(MOCK_SPONSORSHIP_PACKAGES);
  const [applications, setApplications] = useState<SponsorshipApplication[]>(MOCK_SPONSORSHIP_APPLICATIONS);

  const handleApply = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;

    // Create a new application
    const newApplication: SponsorshipApplication = {
        id: `app-${Date.now()}`,
        packageId,
        sponsorId: user.id,
        status: 'Pending',
    };
    setApplications(prev => [...prev, newApplication]);

    // Update package status
    setPackages(prev => prev.map(p => p.id === packageId ? { ...p, status: 'Pending' } : p));
    
    toast({
        title: 'Application Submitted!',
        description: `Your application for the ${pkg.name} package has been submitted.`,
    });
  };

  const getMyApplicationStatus = (packageId: string) => {
    const myApp = applications.find(app => app.packageId === packageId && app.sponsorId === user.id);
    if (myApp) {
        return myApp.status;
    }
    return null;
  }

  return (
     <div className="grid gap-6">
        <DashboardSummary />
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Handshake className="w-5 h-5" />
                    Sponsorship Opportunities
                </CardTitle>
                <CardDescription>Explore ways to partner with our upcoming events.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map((pkg) => {
                    const event = events.find(e => e.id === pkg.eventId);
                    const myAppStatus = getMyApplicationStatus(pkg.id);
                    const isAppliedByMe = !!myAppStatus;
                    const isAvailable = pkg.status === 'Available';

                    return (
                    <Card key={pkg.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{pkg.name}</CardTitle>
                                    <CardDescription>{event?.name}</CardDescription>
                                </div>
                                <Badge variant={isAvailable ? 'secondary' : 'default'}>{pkg.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm font-semibold text-primary">${pkg.price.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">{pkg.benefits}</p>
                            
                            {myAppStatus ? (
                                <Button className="w-full" disabled>
                                    Application {myAppStatus}
                                </Button>
                            ) : (
                                <Button 
                                    className="w-full bg-accent hover:bg-accent/90"
                                    onClick={() => handleApply(pkg.id)}
                                    disabled={!isAvailable}
                                >
                                    Apply Now
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )})}
            </CardContent>
        </Card>
     </div>
  );
}
