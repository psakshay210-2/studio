'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Loader2, Sparkles } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { generateEventDescription } from '@/ai/flows/event-description-generator';
import { useEvents } from '@/contexts/event-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from './ui/card';
import type { DateRange } from 'react-day-picker';

const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters."),
  location: z.string().min(3, "Location is required."),
  dateRange: z.object({
    from: z.date({ required_error: "A start date is required." }),
    to: z.date().optional(),
  }),
  keywords: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters."),
});

type EventFormData = z.infer<typeof eventSchema>;

const steps = [
  { id: 'Step 1', name: 'Event Details' },
  { id: 'Step 2', name: 'Confirmation' },
];

export function EventWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { addEvent } = useEvents();
  const router = useRouter();


  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      keywords: '',
    }
  });

  const handleGenerateDescription = async () => {
    const keywords = form.getValues('keywords');
    if (!keywords) {
      toast({
        variant: 'destructive',
        title: 'No Keywords Provided',
        description: 'Please enter some keywords to generate a description.',
      });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateEventDescription({ keywords });
      form.setValue('description', result.description, { shouldValidate: true });
    } catch (error) {
      console.error('Failed to generate description', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Could not generate a description at this time.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const processForm = (data: EventFormData) => {
    addEvent({
        id: `event-${Date.now()}`,
        name: data.name,
        startDate: format(data.dateRange.from, 'yyyy-MM-dd'),
        endDate: data.dateRange.to ? format(data.dateRange.to, 'yyyy-MM-dd') : undefined,
        location: data.location,
        description: data.description,
        image: 'https://picsum.photos/seed/new-event/600/400',
        status: 'Upcoming'
    });
    toast({
        title: 'Event Created!',
        description: `Your event "${data.name}" has been successfully created.`,
    });
    router.push('/events');
  };
  
  const next = async () => {
    const isValid = await form.trigger(['name', 'location', 'dateRange', 'description']);
    if (isValid) {
        if (currentStep < steps.length - 1) {
            setCurrentStep(step => step + 1);
        } else {
            form.handleSubmit(processForm)();
        }
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step - 1);
    }
  };

  const formatDateRangeForDisplay = (dateRange: DateRange | undefined) => {
    if (!dateRange || !dateRange.from) return "Pick a date range";
    if (dateRange.to) {
        return `${format(dateRange.from, "LLL dd, y")} - ${format(dateRange.to, "LLL dd, y")}`;
    }
    return format(dateRange.from, "PPP");
  }

  const formatConfirmationDate = (dateRange: { from: Date; to?: Date }) => {
    if (!dateRange.from) return "";
    let dateString = format(dateRange.from, "PPP");
    if (dateRange.to) {
      dateString += ` to ${format(dateRange.to, "PPP")}`;
    }
    return dateString;
  }

  return (
    <div>
      <Progress value={(currentStep + 1) / steps.length * 100} className="mb-8" />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(processForm)} className="space-y-8">
          {currentStep === 0 && (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold font-headline">{steps[0].name}</h2>
                <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl><Input placeholder="e.g., InnovateX 2024" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField name="location" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl><Input placeholder="e.g., San Francisco, CA" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="dateRange" control={form.control} render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date Range</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value?.from && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formatDateRangeForDisplay(field.value)}
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="range"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField name="keywords" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description Keywords</FormLabel>
                        <FormControl><Input placeholder="e.g., tech, innovation, startups, future" {...field} /></FormControl>
                        <FormDescription>Keywords used to generate the event description with AI.</FormDescription>
                    </FormItem>
                )} />

                <FormField name="description" control={form.control} render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <div className="relative">
                            <FormControl><Textarea placeholder="Tell us about your event..." className="min-h-[120px] pr-28" {...field} /></FormControl>
                            <Button type="button" size="sm" className="absolute bottom-2 right-2 bg-accent hover:bg-accent/90" onClick={handleGenerateDescription} disabled={isGenerating}>
                            {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                Generate
                            </Button>
                        </div>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold font-headline">{steps[1].name}</h2>
              <p className="text-muted-foreground mt-2">Review your event details before submitting.</p>
              <Card className="mt-6">
                <CardContent className="p-6 space-y-4">
                    <div>
                        <p className="font-bold">Event Name</p>
                        <p>{form.getValues('name')}</p>
                    </div>
                    <div>
                        <p className="font-bold">Date & Location</p>
                        <p>{formatConfirmationDate(form.getValues('dateRange'))} in {form.getValues('location')}</p>
                    </div>
                    <div>
                        <p className="font-bold">Description</p>
                        <p className="text-muted-foreground text-sm">{form.getValues('description')}</p>
                    </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" onClick={prev} variant="outline" disabled={currentStep === 0}>
              Back
            </Button>
            <Button type="button" onClick={next}>
              {currentStep === steps.length - 1 ? 'Create Event' : 'Next'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
