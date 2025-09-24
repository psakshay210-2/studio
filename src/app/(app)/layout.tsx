import { AppLayout } from '@/components/app-layout';
import { AuthGuard } from '@/contexts/auth-context';
import { EventProvider } from '@/contexts/event-context';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <EventProvider>
        <AppLayout>{children}</AppLayout>
      </EventProvider>
    </AuthGuard>
  );
}
