import type { User, Event, Task, Channel } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alex Morgan', email: 'alex@eventflow.com', avatar: 'https://i.pravatar.cc/150?u=user-1', role: 'Organizer' },
  { id: 'user-2', name: 'Brenda Smith', email: 'brenda@eventflow.com', avatar: 'https://i.pravatar.cc/150?u=user-2', role: 'Approver' },
  { id: 'user-3', name: 'Charlie Day', email: 'charlie@example.com', avatar: 'https://i.pravatar.cc/150?u=user-3', role: 'Participant' },
  { id: 'user-4', name: 'David Lee', email: 'david@catering.com', avatar: 'https://i.pravatar.cc/150?u=user-4', role: 'Vendor' },
  { id: 'user-5', name: 'Eva Green', email: 'eva@sponsorcorp.com', avatar: 'https://i.pravatar.cc/150?u=user-5', role: 'Sponsor' },
  { id: 'user-6', name: 'Frank West', email: 'frank@eventflow.com', avatar: 'https://i.pravatar.cc/150?u=user-6', role: 'Organizer' },
];

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-1',
    name: 'InnovateX 2024',
    date: '2024-10-26',
    location: 'San Francisco, CA',
    description: 'The premier conference for technology and innovation, bringing together the brightest minds and showcasing the future of tech.',
    image: findImage('tech-conference'),
    status: 'Upcoming',
  },
  {
    id: 'event-2',
    name: 'Sunset Music Fest',
    date: '2024-08-15',
    location: 'Miami, FL',
    description: 'An unforgettable weekend of live music, art installations, and beach vibes.',
    image: findImage('music-festival'),
    status: 'Upcoming',
  },
  {
    id: 'event-3',
    name: 'Annual Charity Gala',
    date: '2024-11-05',
    location: 'New York, NY',
    description: 'An elegant evening dedicated to raising funds for a noble cause, with special guest performances.',
    image: findImage('corporate-gala'),
    status: 'Upcoming',
  },
  {
    id: 'event-4',
    name: 'Art & Soul Exhibition',
    date: '2024-07-20',
    location: 'Paris, France',
    description: 'A curated exhibition of contemporary art from emerging artists around the globe.',
    image: findImage('art-exhibition'),
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
    name: '@BrendaSmith',
    messages: [
      { id: 'msg-6', sender: MOCK_USERS[0], text: 'Hi Brenda, could you please approve the budget for the marketing campaign?', timestamp: '9:00 AM' },
    ]
  }
];

export const MOCK_APPROVALS = [
  { id: 'approve-1', eventName: 'InnovateX 2024', item: 'Catering Contract - "Gourmet Bites"', submittedBy: 'Alex Morgan', amount: 45000 },
  { id: 'approve-2', eventName: 'Sunset Music Fest', item: 'Artist Rider - DJ Phoenix', submittedBy: 'Frank West', amount: 20000 },
  { id: 'approve-3', eventName: 'InnovateX 2024', item: 'AV Equipment Rental', submittedBy: 'Alex Morgan', amount: 15000 },
];

export const MOCK_SPONSORSHIPS = [
  { id: 'sponsor-1', eventName: 'InnovateX 2024', level: 'Platinum', benefits: 'Keynote shoutout, logo on all materials, dedicated booth.' },
  { id: 'sponsor-2', eventName: 'Sunset Music Fest', level: 'Gold', benefits: 'Logo on main stage banner, social media mentions.' },
  { id: 'sponsor-3', eventName: 'Annual Charity Gala', level: 'Silver', benefits: 'Logo in event program, table of 10.' },
];
