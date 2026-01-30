export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
}

export interface ResumeProfile {
  id: string;
  basics: {
    name: string;
    email: string;
    phone: string;
    website: string;
    location: string;
    summary: string;
  };
  work: WorkExperience[];
  education: Education[];
  skills: string[];
}

export type ApplicationStatus = 'wishlist' | 'applied' | 'interviewing' | 'offer' | 'rejected';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  dateApplied: string;
  link: string;
  notes: string;
  salary?: string;
  interviewStage?: string;
  interviewDate?: string;
}

export interface InterviewNote {
  id: string;
  category: string;
  question: string;
  content: string;
  createdAt: string;
}
