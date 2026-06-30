import type { Lesson, SubjectGrade, Absence, Exam, Announcement } from '@/lib/types';
import { BookOpen, Calculator, FlaskConical, Globe, Palette, Languages } from 'lucide-react';

export const timetable: Lesson[] = [
  { id: 'l1', subject: 'Calculus', teacher: 'Dr. Evelyn Reed', time: '09:00 - 10:30', room: 'A-301', day: 'MON', type: 'lesson' },
  { id: 'l2', subject: 'World History', teacher: 'Mr. David Chen', time: '11:00 - 12:30', room: 'B-102', day: 'MON', type: 'lesson' },
  { id: 'l3', subject: 'Organic Chemistry', teacher: 'Dr. Sarah Jenkins', time: '09:00 - 10:30', room: 'C-210', day: 'TUE', type: 'lesson' },
  { id: 'l4', subject: 'English Literature', teacher: 'Ms. Olivia Ford', time: '13:00 - 14:30', room: 'B-105', day: 'TUE', type: 'lesson' },
  { id: 'l5', subject: 'Calculus', teacher: 'Dr. Evelyn Reed', time: '09:00 - 10:30', room: 'A-301', day: 'WED', type: 'lesson' },
  { id: 'l6', subject: 'Digital Painting', teacher: 'Prof. Anya Sharma', time: '14:00 - 16:00', room: 'D-Art', day: 'WED', type: 'lesson' },
  { id: 'l7', subject: 'Organic Chemistry Lab', teacher: 'Dr. Sarah Jenkins', time: '11:00 - 12:30', room: 'C-Lab', day: 'THU', type: 'lesson' },
  { id: 'l8', subject: 'Spanish II', teacher: 'Sra. Martinez', time: '13:00 - 14:30', room: 'F-101', day: 'THU', type: 'lesson' },
  { id: 'l9', subject: 'World History', teacher: 'Mr. David Chen', time: '09:00 - 10:30', room: 'B-102', day: 'FRI', type: 'lesson' },
  { id: 'l10', subject: 'English Literature', teacher: 'Ms. Olivia Ford', time: '11:00 - 12:30', room: 'B-105', day: 'FRI', type: 'lesson' },
];

export const grades: SubjectGrade[] = [
  {
    id: 'sg1',
    subject: 'Calculus',
    average: 88,
    icon: Calculator,
    type: 'grade',
    grades: [
      { id: 'g1', assignment: 'Midterm Exam', score: 85, maxScore: 100, date: '2023-10-15' },
      { id: 'g2', assignment: 'Homework 5', score: 95, maxScore: 100, date: '2023-10-22' },
      { id: 'g3', assignment: 'Quiz 3', score: 82, maxScore: 100, date: '2023-10-29' },
    ],
  },
  {
    id: 'sg2',
    subject: 'Organic Chemistry',
    average: 92,
    icon: FlaskConical,
    type: 'grade',
    grades: [
      { id: 'g4', assignment: 'Lab Report 2', score: 94, maxScore: 100, date: '2023-10-18' },
      { id: 'g5', assignment: 'Problem Set 4', score: 90, maxScore: 100, date: '2023-10-25' },
    ],
  },
  {
    id: 'sg3',
    subject: 'English Literature',
    average: 85,
    icon: BookOpen,
    type: 'grade',
    grades: [
      { id: 'g6', assignment: 'Essay: The Great Gatsby', score: 88, maxScore: 100, date: '2023-10-20' },
      { id: 'g7', assignment: 'Presentation', score: 82, maxScore: 100, date: '2023-10-27' },
      { id: 'g14', assignment: 'Participation', score: 95, maxScore: 100, date: '2023-11-01' },
      { id: 'g15', assignment: 'Reading Quiz', score: 78, maxScore: 100, date: '2023-11-03' },
    ],
  },
  {
    id: 'sg4',
    subject: 'World History',
    average: 89,
    icon: Globe,
    type: 'grade',
    grades: [
        { id: 'g8', assignment: 'Research Paper', score: 91, maxScore: 100, date: '2023-10-19' },
        { id: 'g9', assignment: 'Map Quiz', score: 87, maxScore: 100, date: '2023-10-26' },
    ]
  },
  {
    id: 'sg5',
    subject: 'Digital Painting',
    average: 95,
    icon: Palette,
    type: 'grade',
    grades: [
        { id: 'g10', assignment: 'Project 1: Still Life', score: 93, maxScore: 100, date: '2023-10-21' },
        { id: 'g11', assignment: 'Project 2: Character Design', score: 97, maxScore: 100, date: '2023-11-01' },
    ]
  },
   {
    id: 'sg6',
    subject: 'Spanish II',
    average: 91,
    icon: Languages,
    type: 'grade',
    grades: [
        { id: 'g12', assignment: 'Oral Exam', score: 90, maxScore: 100, date: '2023-10-23' },
        { id: 'g13', assignment: 'Written Test', score: 92, maxScore: 100, date: '2023-10-30' },
    ]
  }
];

export const absences: Absence[] = [
  { id: 'a1', subject: 'Calculus', teacher: 'Dr. Evelyn Reed', date: '2023-10-23', reason: 'Doctor\'s Appointment', status: 'Excused', type: 'absence' },
  { id: 'a2', subject: 'English Literature', teacher: 'Ms. Olivia Ford', date: '2023-10-18', reason: 'Not specified', status: 'Unexcused', type: 'absence' },
  { id: 'a3', subject: 'Organic Chemistry', teacher: 'Dr. Sarah Jenkins', date: '2023-09-12', reason: 'Family Emergency', status: 'Excused', type: 'absence' },
];

export const exams: Exam[] = [
  { id: 'e1', subject: 'Calculus Midterm II', date: '2023-11-15', time: '09:00', location: 'Hall A', type: 'exam' },
  { id: 'e2', subject: 'Chemistry Final', date: '2023-12-12', time: '13:00', location: 'Gymnasium', type: 'exam' },
  { id: 'e3', subject: 'History Final Paper Due', date: '2023-12-14', time: '23:59', location: 'Online Submission', type: 'exam' },
];

export const announcements: Announcement[] = [
  { id: 'an1', title: 'Upcoming School Holiday', content: 'Please be advised that the school will be closed next Monday for a national holiday. Classes will resume on Tuesday. Enjoy your long weekend!', author: 'School Administration', date: '2023-11-02', type: 'announcement' },
  { id: 'an2', title: 'Library System Update', content: 'The library\'s online catalog system will be down for maintenance this Saturday from 8 AM to 12 PM. We apologize for any inconvenience.', author: 'Library Staff', date: '2023-11-01', type: 'announcement' },
  { id: 'an3', title: 'Basketball Team Tryouts', content: 'Tryouts for the varsity basketball team will be held next Wednesday and Thursday after school in the main gym. All students are welcome to try out.', author: 'Coach Miller', date: '2023-10-31', type: 'announcement' },
];
