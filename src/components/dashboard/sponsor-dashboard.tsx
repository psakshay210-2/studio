import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MOCK_SPONSORSHIPS } from '@/lib/data';
import { Handshake } from 'lucide-react';
import { DashboardSummary } from './dashboard-summary';

export function SponsorDashboard() {
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
                {MOCK_SPONSORSHIPS.map((opp) => (
                    <Card key={opp.id}>
                        <CardHeader>
                            <CardTitle>{opp.eventName}</CardTitle>
                            <CardDescription>
                                <span className="font-semibold text-primary">{opp.level} Tier</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">{opp.benefits}</p>
                            <Button className="w-full bg-accent hover:bg-accent/90">Learn More</Button>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
     </div>
  );
}
