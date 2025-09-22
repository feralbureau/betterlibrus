
import type { Lesson, SubjectGrade, Absence, Exam, Announcement, Message, MessageFolder, Day } from './types';
import { BookOpen, Calculator, FlaskConical, Globe, Palette, Languages } from 'lucide-react';

// A helper function to make fetch requests and handle errors
async function fetchData(url: string) {
    const response = await fetch(url);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return response.json();
}

// Helper to get an icon for a subject
function getIconForSubject(subjectName: string) {
    const lowerCaseSubject = subjectName.toLowerCase();
    if (lowerCaseSubject.includes('matematyka') || lowerCaseSubject.includes('calculus')) return Calculator;
    if (lowerCaseSubject.includes('chemia') || lowerCaseSubject.includes('chemistry')) return FlaskConical;
    if (lowerCaseSubject.includes('historia') || lowerCaseSubject.includes('history')) return Globe;
    if (lowerCaseSubject.includes('plastyka') || lowerCaseSubject.includes('sztuka') || lowerCaseSubject.includes('painting')) return Palette;
    if (lowerCaseSubject.includes('hiszpański') || lowerCaseSubject.includes('spanish')) return Languages;
    // Default icon
    return BookOpen;
}

// Maps day numbers from the API (1=Mon, 5=Fri) to our Day type
function mapDay(dayNumber: number): Day {
    const dayMap: { [key: number]: Day } = {
        1: 'MON',
        2: 'TUE',
        3: 'WED',
        4: 'THU',
        5: 'FRI',
    };
    return dayMap[dayNumber] || 'MON';
}


export async function getTimetable(): Promise<Lesson[]> {
    const apiData = await fetchData('/api/timetable');

    // Check if apiData is valid and is an object
    if (!apiData || typeof apiData !== 'object') {
        return [];
    }

    // The API returns an object with days as keys, so we need to flatten and map it.
    const lessons: Lesson[] = Object.entries(apiData).flatMap(([day, dayLessons]) => {
        const dayNumber = parseInt(day.replace('d', ''), 10);

        if (!Array.isArray(dayLessons)) {
            return [];
        }
        return dayLessons.map((lesson, index) => ({
            id: `l-${dayNumber}-${index}`,
            subject: lesson.subject || 'Unknown Subject',
            teacher: lesson.teacher || 'Unknown Teacher',
            time: lesson.time || '00:00',
            room: lesson.room || 'N/A',
            day: mapDay(dayNumber),
            type: 'lesson'
        }));
    });

    return lessons;
}

export async function getGrades(): Promise<SubjectGrade[]> {
    const apiData = await fetchData('/api/grades');

    // Check if apiData is valid and is an array
    if (!apiData || !Array.isArray(apiData)) {
        return [];
    }

    // The API returns an array of subjects, each with an array of grades.
    // We need to map this to our SubjectGrade type.
    return apiData.map((subject: any) => ({
        id: subject.id || `subject-${Math.random()}`,
        subject: subject.name || 'Unknown Subject',
        average: subject.average || 0, // Assuming the API provides an average
        icon: getIconForSubject(subject.name || ''),
        type: 'grade',
        grades: Array.isArray(subject.grades) ? subject.grades.map((grade: any) => ({
            id: grade.id || `grade-${Math.random()}`,
            assignment: grade.description?.category?.name || grade.category || 'Assignment',
            score: parseFloat((grade.grade || '0').toString().replace(',', '.')), // Handle comma decimal separator
            maxScore: grade.description?.category?.weight || 100, // This might need adjustment based on real data
            date: grade.date ? new Date(grade.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        })) : []
    }));
}

export async function getAbsences(): Promise<Absence[]> {
    const apiData = await fetchData('/api/absences');

    // Check if apiData is valid and is an array
    if (!apiData || !Array.isArray(apiData)) {
        return [];
    }

    // The API returns an array of absences, which we map to our Absence type.
    return apiData.map((absence: any) => ({
        id: absence.id || `absence-${Math.random()}`,
        subject: absence.lesson?.subject || 'Unknown Subject',
        teacher: absence.teacher?.name || 'Unknown Teacher',
        date: absence.date ? new Date(absence.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        reason: absence.reason || 'Not specified',
        status: absence.isExcused ? 'Excused' : absence.isPresenceJustified ? 'Pending' : 'Unexcused',
        type: 'absence'
    }));
}

export async function getExams(): Promise<Exam[]> {
    const apiData = await fetchData('/api/exams');

    // Check if apiData is valid and is an array
    if (!apiData || !Array.isArray(apiData)) {
        return [];
    }

    // The API returns calendar events, we map them to our Exam type.
    return apiData.map((event: any) => ({
        id: event.id || `exam-${Math.random()}`,
        subject: event.title || 'Unknown Subject',
        date: event.dateFrom ? new Date(event.dateFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        time: event.dateFrom ? new Date(event.dateFrom).toTimeString().split(' ')[0].substring(0, 5) : '00:00',
        location: event.place || 'N/A',
        type: 'exam'
    }));
}

export async function getAnnouncements(): Promise<Announcement[]> {
    const apiData = await fetchData('/api/announcements');

    // Check if apiData is valid and is an array
    if (!apiData || !Array.isArray(apiData)) {
        return [];
    }

    // The API returns announcements, we map them to our Announcement type.
    return apiData.map((announcement: any) => ({
        id: announcement.id || `announcement-${Math.random()}`,
        title: announcement.title || announcement.subject || announcement.name || 'Untitled',
        content: announcement.content || announcement.body || announcement.text || '',
        author: announcement.user || announcement.author?.name || announcement.sender?.name || announcement.from || 'Unknown Author',
        date: announcement.date ? new Date(announcement.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: 'announcement' as const
    }));
}

export async function getUser(): Promise<any> {
    return await fetchData('/api/user');
}

// Message-related API functions
export async function getMessageFolders(): Promise<MessageFolder[]> {
    const apiData = await fetchData('/api/messages/folders');

    if (!apiData || !Array.isArray(apiData)) {
        return [];
    }

    return apiData.map((folder: any) => ({
        id: folder.id || `folder-${Math.random()}`,
        name: folder.name || 'Unknown Folder',
        count: folder.count || 0
    }));
}

export interface PaginatedResponse<T> {
    messages: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export async function getMessages(folderId: string, page = 1, limit = 10): Promise<PaginatedResponse<Message>> {
    const apiData = await fetchData(`/api/messages/${folderId}?page=${page}&limit=${limit}`);

    // Handle new paginated format
    if (apiData?.messages && Array.isArray(apiData.messages)) {
        return {
            messages: apiData.messages.map((message: any) => ({
                id: message.id || `msg-${Math.random()}`,
                title: message.title || 'No Subject',
                content: message.content || '',
                html: message.html || '',
                user: message.user || 'Unknown Sender',
                date: message.date || new Date().toISOString().split('T')[0],
                read: message.read || false,
                folderId: message.folderId || folderId,
                files: Array.isArray(message.files) ? message.files : [],
                type: 'message' as const
            })),
            pagination: apiData.pagination || {
                currentPage: 1,
                totalPages: 1,
                totalItems: apiData.messages.length,
                hasNext: false,
                hasPrev: false
            }
        };
    }

    // Handle legacy array format for backward compatibility
    if (Array.isArray(apiData)) {
        const messages = apiData.map((message: any) => ({
            id: message.id || `msg-${Math.random()}`,
            title: message.title || 'No Subject',
            content: message.content || '',
            html: message.html || '',
            user: message.user || 'Unknown Sender',
            date: message.date || new Date().toISOString().split('T')[0],
            read: message.read || false,
            folderId: message.folderId || folderId,
            files: Array.isArray(message.files) ? message.files : [],
            type: 'message' as const
        }));

        return {
            messages,
            pagination: {
                currentPage: 1,
                totalPages: 1,
                totalItems: messages.length,
                hasNext: false,
                hasPrev: false
            }
        };
    }

    // Default empty response
    return {
        messages: [],
        pagination: {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            hasNext: false,
            hasPrev: false
        }
    };
}

export async function getMessage(folderId: string, messageId: string): Promise<Message> {
    const apiData = await fetchData(`/api/messages/${folderId}/${messageId}`);

    return {
        id: apiData.id || messageId,
        title: apiData.title || 'No Subject',
        content: apiData.content || '',
        html: apiData.html || '',
        user: apiData.user || 'Unknown Sender',
        date: apiData.date || new Date().toISOString().split('T')[0],
        read: apiData.read || false,
        folderId: apiData.folderId || folderId,
        files: Array.isArray(apiData.files) ? apiData.files : [],
        type: 'message' as const
    };
}



