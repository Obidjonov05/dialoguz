
export type Role = 'student' | 'teacher' | 'parent';
export type Language = 'en' | 'uz' | 'ru';

export interface UserContext {
  id: string; // Unique ID for every user
  email?: string; // New: For login
  password?: string; // New: For login (simulated)
  role: Role;
  language: Language;
  firstName: string; 
  lastName: string;
  name: string; 
  
  // Educational Context
  schoolName?: string;
  
  // Student Specific
  studentId?: string; // The display ID for parents to link
  className?: string; // e.g., "3-A"
  grade?: number;     // Numeric grade derived from className
  age?: number;
  interests?: string[];
  subjects?: string[];
  readingSpeed?: number;
  mistakes?: string[];
  
  // Teacher Specific
  classesTaught?: string[]; // ["3-A", "3-B"]
  subjectsTaught?: string[]; // ["Math", "Science"]
  
  // Parent Specific
  childId?: string; // ID of the linked student
  childName?: string;
  childSchool?: string;
  childClass?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export interface ChartData {
  name: string;
  value: number;
  fullMark?: number;
}
