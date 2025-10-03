import type { LucideIcon } from 'lucide-react';

export type Day = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';

export type View = 'Home' | 'Timetable' | 'Grades' | 'Absences' | 'Exams' | 'Announcements' | 'Messages' | 'Settings';

export interface Lesson {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  day: Day;
  type: 'lesson';
}

export interface Grade {
  id: string;
  assignment: string;
  score: number;
  maxScore: number;
  date: string;
}

export interface SubjectGrade {
  id: string;
  subject: string;
  average: number;
  icon: LucideIcon;
  grades: Grade[];
  type: 'grade';
}

export interface Absence {
  id: string;
  subject: string;
  teacher: string;
  date: string;
  reason: string;
  status: 'Excused' | 'Unexcused' | 'Pending';
  type: 'absence';
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  location: string;
  type: 'exam';
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  type: 'announcement';
}

export interface MessageFile {
  name: string;
  path: string;
}

export interface Message {
  id: string;
  title: string;
  content: string;
  html?: string;
  user: string; // sender
  date: string;
  read: boolean;
  folderId: string;
  files: MessageFile[];
  type: 'message';
}

export interface MessageFolder {
  id: string;
  name: string;
  count: number;
}

export type DetailItem = Lesson | SubjectGrade | Announcement | Message;
