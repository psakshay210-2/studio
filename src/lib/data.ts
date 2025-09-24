'use client';
import type { User, Event, Task, Channel, Approval, ServiceRequest } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Balaji M', email: 'balaji@eventflow.com', avatar: 'https://i.pravatar.cc/150?u=user-1', role: 'Organizer' },
  { id: 'user-2', name: 'Laville Vishnu Prasath', email: 'laville@eventflow.com', avatar: 'https://i.pravatar.cc/150?u=user-2', role: 'Approver' },
  { id: 'user-3', name: 'Hemabaalan C', email: 'hemabaalan@example.com', avatar: 'https://i.pravatar.cc/150?u=user-3', role: 'Participant' },
  { id: 'user-4', name: 'Vaishnavaraja R G', email: 'vaishnavaraja@catering.com', avatar: 'https://i.pravatar.cc/150?u=user-4', role: 'Vendor' },
  { id: 'user-5', name: 'PS Akshay', email: 'akshay@sponsorcorp.com', avatar: 'https://i.pravatar.cc/150?u=user-5', role: 'Sponsor' },
  { id: 'user-6', name: 'Govind Raj', email: 'govind@eventflow.com', avatar: 'https://i.pravatar.cc/150?u=user-6', role: 'Organizer' },
  { id: 'user-7', name: 'Jacob George', email: 'jacob@eventflow.com', avatar: 'https://i.pravatar.cc/150?u=user-7', role: 'Organizer' },
  { id: 'user-8', name: 'Soundman Sam', email: 'sam@sound.com', avatar: 'https://i.pravatar.cc/150?u=user-8', role: 'Vendor' },

];

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-1',
    name: 'InnovateX 2024',
    startDate: '2024-10-26',
    endDate: '2024-10-28',
    location: 'San Francisco, CA',
    description: 'The premier conference for technology and innovation, bringing together the brightest minds and showcasing the future of tech.',
    image: findImage('tech-conference'),
    gallery: [findImage('tech-conference'), findImage('product-launch'), findImage('corporate-gala')],
    status: 'Upcoming',
    coordinators: [
        { userId: 'user-1', eventRole: 'Lead Organizer' },
        { userId: 'user-6', eventRole: 'Logistics' },
    ],
    approverId: 'user-2',
  },
  {
    id: 'sub-event-1',
    parentId: 'event-1',
    name: 'AI in Practice Workshop',
    startDate: '2024-10-27',
    location: 'Room 201, Moscone Center',
    description: 'A hands-on workshop on implementing AI solutions.',
    image: findImage('product-launch'),
    status: 'Upcoming',
  },
  {
    id: 'sub-event-2',
    parentId: 'event-1',
    name: 'Founder Networking Mixer',
    startDate: '2024-10-27',
    location: 'Rooftop Terrace, Moscone Center',
    description: 'An exclusive networking event for startup founders.',
    image: findImage('corporate-gala'),
    status: 'Upcoming',
  },
  {
    id: 'event-2',
    name: 'Sunset Music Fest',
    startDate: '2024-08-15',
    endDate: '2024-08-17',
    location: 'Miami, FL',
    description: 'An unforgettable weekend of live music, art installations, and beach vibes.',
    image: findImage('music-festival'),
    gallery: [findImage('music-festival'), findImage('charity-run'), findImage('art-exhibition')],
    status: 'Pending Approval',
    approverId: 'user-2',
  },
  {
    id: 'event-3',
    name: 'Annual Charity Gala',
    startDate: '2024-11-05',
    location: 'New York, NY',
    description: 'An elegant evening dedicated to raising funds for a noble cause, with special guest performances.',
    image: findImage('corporate-gala'),
    gallery: [findImage('corporate-gala')],
    status: 'Upcoming',
    approverId: 'user-2',
  },
  {
    id: 'event-4',
    name: 'Art & Soul Exhibition',
    startDate: '2024-07-20',
    location: 'Paris, France',
    description: 'A curated exhibition of contemporary art from emerging artists around the globe.',
    image: findImage('art-exhibition'),
    gallery: [findImage('art-exhibition')],
    status: 'Past',
  },
];

export const MOCK_TASKS: Task[] = [
  { id: 'task-1', eventId: 'event-1', title: 'Finalize Speaker List', description: 'Confirm final list of keynote speakers and their topics.', status: 'In Progress', assignee: MOCK_USERS[0] },
  { id: 'task-2', eventId: 'event-1', title: 'Book Venue Catering', description: 'Select and book catering service for all three days.', status: 'To Do' },
  { id: 'task-3', eventId: 'event-2', title: 'Secure Stage Lighting', description: 'Rent and set up lighting equipment for the main stage.', status: 'Done', assignee: MOCK_USERS[5] },
  { id: 'task-4', eventId: 'event-1', title: 'Design Event Badges', description: 'Create and print badges for all attendee types.', status: 'To Do', assignee: MOCK_USERS[0] },
  { id: 'task-5', eventId: 'event-2', title: 'Arrange Artist Transportation', description: 'Coordinate flights and ground transport for all performing artists.', status: 'In Progress' },
  { id: 'task-6', eventId: 'event-3', title: 'Send out Invitations', description: 'Mail formal invitations to the gala guest list.', status: 'Done' },
  { id: 'task-7', eventId: 'event-1', title: 'Develop Event App', description: 'Work with the dev team to build the official event mobile app.', status: 'In Progress' },
];

export const MOCK_CHANNELS: Channel[] = [
  {
    id: 'channel-1',
    name: '#InnovateX-general',
    messages: [
      { id: 'msg-1', sender: MOCK_USERS[0], text: 'Hey team, what\'s the status on the venue booking?', timestamp: '10:30 AM' },
      { id: 'msg-2', sender: MOCK_USERS[5], text: 'Just got the confirmation from Moscone Center. We are all set!', timestamp: '10:32 AM' },
      { id: 'msg-3', sender: MOCK_USERS[0], text: 'Excellent! Let\'s move on to catering proposals.', timestamp: '10:33 AM' },
    ]
  },
  {
    id: 'channel-2',
    name: '#SunsetFest-vendors',
    messages: [
      { id: 'msg-4', sender: MOCK_USERS[3], text: 'Hi, confirming our load-in time is 8 AM on Friday.', timestamp: 'Yesterday' },
      { id: 'msg-5', sender: MOCK_USERS[0], text: 'That is correct. Please use the west gate entrance.', timestamp: 'Yesterday' },
    ]
  },
  {
    id: 'channel-3',
    name: '@LavilleVishnuPrasath',
    messages: [
      { id: 'msg-6', sender: MOCK_USERS[0], text: 'Hi Laville, could you please approve the budget for the marketing campaign?', timestamp: '9:00 AM' },
    ]
  }
];

export const MOCK_APPROVALS: Approval[] = [
  { id: 'approve-1', eventName: 'InnovateX 2024', item: 'Catering Contract - "Gourmet Bites"', submittedBy: 'Balaji M', amount: 45000 },
  { id: 'approve-2', eventName: 'Sunset Music Fest', item: 'Artist Rider - DJ Phoenix', submittedBy: 'Govind Raj', amount: 20000 },
  { id: 'approve-3', eventName: 'InnovateX 2024', item: 'AV Equipment Rental', submittedBy: 'Balaji M', amount: 15000 },
];

export const MOCK_SPONSORSHIPS = [
  { id: 'sponsor-1', eventName: 'InnovateX 2024', level: 'Platinum', benefits: 'Keynote shoutout, logo on all materials, dedicated booth.' },
  { id: 'sponsor-2', eventName: 'Sunset Music Fest', level: 'Gold', benefits: 'Logo on main stage banner, social media mentions.' },
  { id: 'sponsor-3', eventName: 'Annual Charity Gala', level: 'Silver', benefits: 'Logo in event program, table of 10.' },
];

export const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [
    { id: 'sr-1', eventId: 'event-1', service: 'Full-service Catering', description: 'Need catering for 500 people for 3 days. Breakfast, lunch, and evening snacks.', status: 'Open', organizerId: 'user-1' },
    { id: 'sr-2', eventId: 'event-2', service: 'Audio/Visual Equipment', description: 'Full AV setup for main stage, including speakers, mics, and lighting rig.', status: 'Pending Approval', organizerId: 'user-6', appliedVendorId: 'user-8', appliedVendor: MOCK_USERS[7], bidAmount: 22000 },
    { id: 'sr-3', eventId: 'event-3', service: 'Floral Arrangements', description: 'Elegant floral centerpieces for 50 tables, plus entrance decor.', status: 'Awarded', organizerId: 'user-1', awardedVendorId: 'user-4', bidAmount: 8500 },
    { id: 'sr-4', eventId: 'event-1', service: 'Security Staff', description: '20 security personnel for all event days, including overnight watch.', status: 'Open', organizerId: 'user-1' },
];

export const MOCK_REGISTRATIONS_DATA: Record<string, { month: string; registrations: number }[]> = {
    'event-1': [
      { month: "May", registrations: 186 },
      { month: "June", registrations: 305 },
      { month: "July", registrations: 237 },
      { month: "August", registrations: 473 },
      { month: "September", registrations: 609 },
      { month: "October", registrations: 814 },
    ],
    'event-2': [
      { month: "March", registrations: 50 },
      { month: "April", registrations: 120 },
      { month: "May", registrations: 250 },
      { month: "June", registrations: 400 },
      { month: "July", registrations: 600 },
      { month: "August", registrations: 750 },
    ],
    'event-3': [
      { month: "June", registrations: 100 },
      { month: "July", registrations: 150 },
      { month: "August", registrations: 280 },
      { month: "September", registrations: 400 },
      { month: "October", registrations: 520 },
      { month: "November", registrations: 600 },
    ],
    'event-4': [
        { month: "Feb", registrations: 30 },
        { month: "Mar", registrations: 60 },
        { month: "Apr", registrations: 90 },
        { month: "May", registrations: 150 },
        { month: "June", registrations: 210 },
        { month: "July", registrations: 250 },
    ]
};
