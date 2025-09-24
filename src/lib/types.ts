export type Role = 'Organizer' | 'Approver' | 'Participant' | 'Vendor' | 'Sponsor';

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
};

export type EventCoordinator = {
    userId: string;
    eventRole: string;
};

export type EventStatus = 'Upcoming' | 'Past' | 'Cancelled' | 'Pending Approval';

export type Event = {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  image: string;
  gallery?: string[];
  status: EventStatus;
  parentId?: string;
  coordinators?: EventCoordinator[];
  approverId?: string;
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
  id:string;
  name: string;
  messages: Message[];
};

export type Approval = {
  id: string;
  eventName: string;
  item: string;
  submittedBy: string;
  amount: number;
};

export type ServiceRequestStatus = 'Open' | 'Pending Approval' | 'Awarded' | 'Completed' | 'Rejected';

export type ServiceRequest = {
    id: string;
    eventId: string;
    service: string;
    description: string;
    status: ServiceRequestStatus;
    organizerId: string;
    appliedVendorId?: string;
    appliedVendor?: User;
    awardedVendorId?: string;
};
