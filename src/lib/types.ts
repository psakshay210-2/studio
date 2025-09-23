export type Role = 'Organizer' | 'Approver' | 'Participant' | 'Vendor' | 'Sponsor';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
};

export type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  image: string;
  gallery?: string[];
  status: 'Upcoming' | 'Past' | 'Cancelled';
  parentId?: string;
};

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: User;
  eventId: string;
};

export type Message = {
  id: string;
  sender: User;
  text: string;
  timestamp: string;
};

export type Channel = {
  id: string;
  name: string;
  messages: Message[];
};
