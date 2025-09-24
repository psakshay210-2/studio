'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { ServiceRequest } from '@/lib/types';
import { useEvents } from '@/contexts/event-context';

const bidSchema = z.object({
  amount: z.coerce.number().positive('Bid amount must be positive.'),
});

type BidFormData = z.infer<typeof bidSchema>;

type SubmitBidDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  serviceRequest: ServiceRequest;
  onSubmit: (requestId: string, amount: number) => void;
};

export function SubmitBidDialog({
  isOpen,
  onOpenChange,
  serviceRequest,
  onSubmit,
}: SubmitBidDialogProps) {
    const { events } = useEvents();
    const event = events.find(e => e.id === serviceRequest.eventId);

  const form = useForm<BidFormData>({
    resolver: zodResolver(bidSchema),
  });

  const handleFormSubmit = (data: BidFormData) => {
    onSubmit(serviceRequest.id, data.amount);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Bid for "{serviceRequest.service}"</DialogTitle>
          <DialogDescription>
            For event: {event?.name}. Please enter your bid amount below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bid Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit">Submit Bid</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
