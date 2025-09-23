import { EventWizard } from "@/components/event-wizard";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function CreateEventPage() {
    return (
        <div className="space-y-8">
            <PageHeader title="Create a New Event" description="Follow the steps to get your event up and running." />
            <Card>
                <CardContent className="p-4 sm:p-6 lg:p-8">
                    <EventWizard />
                </CardContent>
            </Card>
        </div>
    );
}
