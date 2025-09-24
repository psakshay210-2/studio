'use client';

import { useState } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Loader2, Sparkles, Users, X } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { generateEventDescription } from '@/ai/flows/event-description-generator';
import { useEvents } from '@/contexts/event-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { DateRange } from 'react-day-picker';
import { MOCK_USERS } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { EventCoordinator } from '@/lib/types';


const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters."),
  location: z.string().min(3, "Location is required."),
  dateRange: z.object({
    from: z.date({ required_error: "A start date is required." }),
    to: z.date().optional(),
  }),
  keywords: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters."),
  coordinators: z.array(z.object({
    userId: z.string(),
    eventRole: z.string().min(1, "Role is required."),
  })).optional(),
  approverId: z.string({ required_error: "Please select an approver." }),
});

type EventFormData = z.infer<typeof eventSchema>;

const steps = [
  { id: 'Step 1', name: 'Event Details' },
  { id: 'Step 2', name: 'Add Team' },
  { id: 'Step 3', name: 'Confirmation' },
];

export function EventWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { addEvent } = useEvents();
  const router = useRouter();
  const approvers = MOCK_USERS.filter(u => u.role === 'Approver');

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      keywords: '',
      coordinators: [],
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
  
  const addCoordinator = (userId: string) => {
    const currentCoordinators = form.getValues('coordinators') || [];
    if (!currentCoordinators.find(c => c.userId === userId)) {
        form.setValue('coordinators', [...currentCoordinators, { userId, eventRole: 'Coordinator' }]);
    }
  };

  const removeCoordinator = (userId: string) => {
    const currentCoordinators = form.getValues('coordinators') || [];
    form.setValue('coordinators', currentCoordinators.filter(c => c.userId !== userId));
  };
  
  const updateCoordinatorRole = (userId: string, eventRole: string) => {
    const currentCoordinators = form.getValues('coordinators') || [];
    form.setValue('coordinators', currentCoordinators.map(c => c.userId === userId ? { ...c, eventRole } : c), {shouldValidate: true});
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
        status: 'Pending Approval',
        coordinators: data.coordinators,
        approverId: data.approverId,
    });
    toast({
        title: 'Event Submitted for Approval!',
        description: `Your event "${data.name}" has been sent for approval.`,
    });
    router.push('/events');
  };
  
  const next = async () => {
    let isValid = false;
    if (currentStep === 0) {
      isValid = await form.trigger(['name', 'location', 'dateRange', 'description', 'approverId']);
    } else if (currentStep === 1) {
      isValid = await form.trigger(['coordinators']);
    } else if (currentStep === 2) {
      isValid = true;
    }

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
  
  const selectedCoordinators = form.watch('coordinators') || [];
  const selectedApproverId = form.watch('approverId');
  const approverDetails = MOCK_USERS.find(u => u.id === selectedApproverId);

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
                <FormField
                    control={form.control}
                    name="approverId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Approver</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an approver to launch the event" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {approvers.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                    {user.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormDescription>This person will need to approve the event before it goes live.</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          )}

          {currentStep === 1 && (
             <div className="space-y-6">
                <h2 className="text-2xl font-bold font-headline">{steps[1].name}</h2>
                <p className="text-muted-foreground">Assign roles to your event staff.</p>

                <Controller
                    control={form.control}
                    name="coordinators"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Coordinators</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant="outline" className="w-full justify-start">
                                        <Users className="mr-2" />
                                        Select team members...
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search users..." />
                                    <CommandList>
                                        <CommandEmpty>No users found.</CommandEmpty>
                                        <CommandGroup>
                                            {MOCK_USERS.map(user => (
                                                <CommandItem
                                                    key={user.id}
                                                    onSelect={() => addCoordinator(user.id)}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Avatar className="w-6 h-6">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span>{user.name}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </FormItem>
                    )}
                />
                
                <Card>
                    <CardContent className="p-4 space-y-4">
                        {selectedCoordinators.length === 0 && <p className="text-muted-foreground text-sm text-center">No coordinators added yet.</p>}
                        {selectedCoordinators.map((coordinator, index) => {
                            const user = MOCK_USERS.find(u => u.id === coordinator.userId);
                            if (!user) return null;
                            return (
                                <div key={user.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`coordinators.${index}.eventRole`}
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormControl>
                                                    <Input placeholder="e.g., Lead" {...field} className="w-[150px]"/>
                                                </FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                        <Button variant="ghost" size="icon" onClick={() => removeCoordinator(user.id)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
          )}


          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold font-headline">{steps[2].name}</h2>
              <p className="text-muted-foreground mt-2">Review your event details before submitting for approval.</p>
              <Card className="mt-6">
                <CardContent className="p-6 grid gap-4">
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
                    {approverDetails && (
                        <div>
                            <p className="font-bold">Approver</p>
                            <div className="flex items-center gap-3 mt-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={approverDetails.avatar} />
                                    <AvatarFallback>{approverDetails.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="text-sm">{approverDetails.name}</p>
                            </div>
                        </div>
                    )}
                    {selectedCoordinators.length > 0 && (
                        <div>
                            <p className="font-bold">Team</p>
                            <div className="mt-2 space-y-2">
                                {selectedCoordinators.map(c => {
                                    const user = MOCK_USERS.find(u => u.id === c.userId);
                                    return (
                                        <div key={c.userId} className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={user?.avatar} />
                                                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{user?.name}</p>
                                                <p className="text-xs text-muted-foreground">{c.eventRole}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" onClick={prev} variant="outline" disabled={currentStep === 0}>
              Back
            </Button>
            <Button type="button" onClick={next}>
              {currentStep === steps.length - 1 ? 'Submit for Approval' : 'Next'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
