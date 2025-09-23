'use client';

import { useRole } from '@/contexts/role-context';
import { OrganizerDashboard } from '@/components/dashboard/organizer-dashboard';
import { ApproverDashboard } from '@/components/dashboard/approver-dashboard';
import { ParticipantDashboard } from '@/components/dashboard/participant-dashboard';
import { VendorDashboard } from '@/components/dashboard/vendor-dashboard';
import { SponsorDashboard } from '@/components/dashboard/sponsor-dashboard';
import { PageHeader } from '@/components/page-header';

export default function DashboardPage() {
  const { role } = useRole();

  const renderDashboard = () => {
    switch (role) {
      case 'Organizer':
        return <OrganizerDashboard />;
      case 'Approver':
        return <ApproverDashboard />;
      case 'Participant':
        return <ParticipantDashboard />;
      case 'Vendor':
        return <VendorDashboard />;
      case 'Sponsor':
        return <SponsorDashboard />;
      default:
        return <div>Invalid Role</div>;
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="An overview of your events and tasks." />
      {renderDashboard()}
    </div>
  );
}
