export type UserType = 'student' | 'company' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  createdAt?: string;
  updatedAt?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
  websiteUrl?: string;
  
  // Student-specific fields
  university?: string;
  major?: string;
  graduationYear?: number;
  skills?: string[];
  resumeUrl?: string;
  preferredIndustries?: string[];
  preferredLocations?: string[];
  
  // Company-specific fields
  companyName?: string;
  industry?: string;
  companySize?: string;
}

export interface Internship {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  location: string;
  isRemote: boolean;
  salary: {
    amount: number;
    period: 'hourly' | 'monthly';
  };
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  applicationDeadline: string;
  industry: string;
  skills: string[];
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  internshipId: string;
  studentId: string;
  status: 'pending' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  coverLetter?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface Scout {
  id: string;
  companyId: string;
  studentId: string;
  internshipId?: string;
  message: string;
  status: 'sent' | 'read' | 'responded' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  relatedTo?: {
    type: 'internship' | 'application' | 'scout';
    id: string;
  };
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  relatedTo?: {
    type: 'internship' | 'application' | 'scout' | 'message';
    id: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}