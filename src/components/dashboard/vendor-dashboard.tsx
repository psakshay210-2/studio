import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';
import { DashboardSummary } from './dashboard-summary';

const MOCK_SERVICES = [
  { id: 'serv-1', eventName: 'InnovateX 2024', service: 'Full-service catering for 3 days', status: 'Confirmed' },
  { id: 'serv-2', eventName: 'Sunset Music Fest', service: 'Audio/Visual equipment rental', status: 'Pending' },
  { id: 'serv-3', eventName: 'Annual Charity Gala', service: 'Floral arrangements', status: 'Confirmed' },
];

export function VendorDashboard() {
  return (
    <div className="grid gap-6">
        <DashboardSummary />
        <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Service Requests
            </CardTitle>
            <CardDescription>Your current service agreements and requests.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {MOCK_SERVICES.map(service => (
            <Card key={service.id} className="flex items-center justify-between p-4">
                <div>
                <p className="font-semibold">{service.service}</p>
                <p className="text-sm text-muted-foreground">{service.eventName}</p>
                </div>
                <Badge variant={service.status === 'Confirmed' ? 'default' : 'secondary'}>{service.status}</Badge>
            </Card>
            ))}
        </CardContent>
        </Card>
    </div>
  );
}
