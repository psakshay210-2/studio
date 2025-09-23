import { AppLayout } from '@/components/app-layout';
import { EventProvider } from '@/contexts/event-context';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <EventProvider><AppLayout>{children}</AppLayout></EventProvider>;
}
