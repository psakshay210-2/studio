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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEvents } from '@/contexts/event-context';
import { useToast } from '@/hooks/use-toast';

const financialRequestSchema = z.object({
  item: z.string().min(3, 'Item name must be at least 3 characters.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  eventId: z.string({ required_error: 'Please select an event.' }),
});

type FinancialRequestFormData = z.infer<typeof financialRequestSchema>;

type CreateFinancialRequestDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onFinancialRequestCreate: (item: string, amount: number, eventName: string) => void;
};

export function CreateFinancialRequestDialog({
  isOpen,
  onOpenChange,
  onFinancialRequestCreate,
}: CreateFinancialRequestDialogProps) {
  const { events } = useEvents();
  const { toast } = useToast();
  const form = useForm<FinancialRequestFormData>({
    resolver: zodResolver(financialRequestSchema),
    defaultValues: {
      item: '',
    },
  });

  const onSubmit = (data: FinancialRequestFormData) => {
    const event = events.find(e => e.id === data.eventId);
    if (event) {
        onFinancialRequestCreate(data.item, data.amount, event.name);
        toast({
            title: "Request Submitted",
            description: `Your financial request for "${data.item}" has been sent for approval.`,
        });
        onOpenChange(false);
        form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Financial Request</DialogTitle>
          <DialogDescription>
            Submit a new item for budget approval.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="item"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item / Service</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Venue Deposit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event for this request" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events
                        .filter((e) => !e.parentId)
                        .map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit">Submit for Approval</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
