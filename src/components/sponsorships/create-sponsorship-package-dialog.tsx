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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEvents } from '@/contexts/event-context';
import type { SponsorshipPackage } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const packageSchema = z.object({
  name: z.string().min(3, 'Package name must be at least 3 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  benefits: z.string().min(10, 'Benefits must be at least 10 characters.'),
  eventId: z.string({ required_error: 'Please select an event.' }),
});

type PackageFormData = z.infer<typeof packageSchema>;

type CreateSponsorshipPackageDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSponsorshipPackageCreate: (pkg: Omit<SponsorshipPackage, 'id' | 'status'>) => void;
};

export function CreateSponsorshipPackageDialog({
  isOpen,
  onOpenChange,
  onSponsorshipPackageCreate,
}: CreateSponsorshipPackageDialogProps) {
  const { events } = useEvents();
  const { toast } = useToast();
  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      name: '',
      benefits: '',
    },
  });

  const onSubmit = (data: PackageFormData) => {
    onSponsorshipPackageCreate(data);
    toast({
      title: 'Sponsorship Package Created!',
      description: `The "${data.name}" package has been created successfully.`,
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Sponsorship Package</DialogTitle>
          <DialogDescription>
            Define a new sponsorship tier for an event.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                        <SelectValue placeholder="Select an event for this package" />
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Platinum Tier" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Benefits</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List the benefits for this tier..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit">Create Package</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
