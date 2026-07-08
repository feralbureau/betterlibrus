
'use client';
import { useState, useEffect } from 'react';
import type { Lesson, DetailItem, Day, SubjectGrade, Exam } from '@/lib/types';
import { Section } from '@/components/student-hub/Section';
import { getTimetable, getGrades, getExams } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { NewGradesList } from '@/components/student-hub/NewGradesList';
import { cn, getCurrentDay, getSubjectColor } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useLanguage } from '@/contexts/LanguageContext';


interface HomeViewProps {
    onOpenSheet: (item: DetailItem) => void;
}

export function HomeView({ onOpenSheet }: HomeViewProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [grades, setGrades] = useState<SubjectGrade[]>([]);
    const [exams, setExams] = useState<Exam[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());
    const { anonymizeName } = usePrivacy();
    const { t } = useLanguage();

    const getDayName = (dayKey: Day): string => {
        const names = { 
            MON: t('timetable.monday'), 
            TUE: t('timetable.tuesday'), 
            WED: t('timetable.wednesday'), 
            THU: t('timetable.thursday'), 
            FRI: t('timetable.friday') 
        };
        return names[dayKey];
    };

    useEffect(() => {
        async function loadData() {
            try {
                const [timetableData, gradesData, examsData] = await Promise.all([
                    getTimetable(),
                    getGrades(),
                    getExams()
                ]);
                setLessons(timetableData);
                setGrades(gradesData);
                setExams(examsData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
        
        const interval = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    if (isLoading) {
        return (
             <div className="space-y-8">
                <Section title={t('home.nextLesson')}>
                    <div className="px-4 md:px-0">
                        <div className="p-4 flex justify-between items-center rounded-lg border bg-card">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-32" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                            <div className="text-right space-y-2">
                                <Skeleton className="h-5 w-24" />
                            </div>
                        </div>
                    </div>
                </Section>
                 <Section title={t('home.newGrades')}>
                    <div className="px-4 md:px-0">
                        <div className="p-4 rounded-lg border bg-card">
                            <div className="flex space-x-3">
                                <Skeleton className="h-10 w-10 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-md" />
                            </div>
                        </div>
                    </div>
                </Section>
                <Section title={t('home.today')}>
                     <div className="px-4 md:px-0 space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 flex justify-between items-center rounded-lg border bg-card">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                                <div className="text-right space-y-2">
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </div>
                        ))}
                     </div>
                </Section>
            </div>
        );
    }

    const todayKey = getCurrentDay();
    const todaysLessons = lessons.filter(lesson => lesson.day === todayKey).sort((a,b) => a.time.localeCompare(b.time));

    const toMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const nowInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const nextLesson = todaysLessons.find(lesson => {
        const lessonStart = toMinutes(lesson.time.split(' - ')[0]);
        return lessonStart > nowInMinutes;
    });

    const currentLesson = todaysLessons.find(lesson => {
        const [startTime, endTime] = lesson.time.split(' - ').map(toMinutes);
        return nowInMinutes >= startTime && nowInMinutes <= endTime;
    });

    const totalGradeCount = grades.reduce((sum, subject) => sum + (subject.grades?.length || 0), 0);
    const subjectAverages = grades.map(s => s.average).filter(a => a > 0);
    const overallAverage = subjectAverages.length > 0
        ? subjectAverages.reduce((a, b) => a + b, 0) / subjectAverages.length
        : null;

    const averageColor = overallAverage !== null
        ? overallAverage >= 80 ? 'text-green-500'
          : overallAverage >= 60 ? 'text-amber-500'
          : 'text-red-500'
        : 'text-primary';

    // Find the next upcoming exam
    const getNextExam = () => {
        const now = new Date();
        const upcoming = exams
            .filter(e => new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return upcoming.length > 0 ? upcoming[0] : null;
    };

    const nextExam = getNextExam();
    const daysUntilExam = nextExam
        ? Math.ceil((new Date(nextExam.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        : null;

    const examLabel = daysUntilExam === 0
        ? t('home.examToday')
        : daysUntilExam === 1
            ? t('home.examTomorrow')
            : daysUntilExam !== null
                ? `${daysUntilExam} ${t('home.examDays')}`
                : null;

    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <Section title="">
                <div className="px-4 md:px-0">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Card className="bg-card/70">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-primary">{todaysLessons.length}</p>
                                <p className="text-xs text-muted-foreground mt-1">{t('home.todaysLessons')}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/70">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-primary">{totalGradeCount}</p>
                                <p className="text-xs text-muted-foreground mt-1">{t('home.newGrades')}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/70">
                            <CardContent className="p-4 text-center">
                                <p className={`text-2xl font-bold ${averageColor}`}>
                                    {overallAverage !== null ? overallAverage.toFixed(1) : '-'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{t('home.overallAverage')}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/70">
                            <CardContent className="p-4 text-center">
                                <p className={`text-2xl font-bold ${nextExam ? 'text-primary' : 'text-primary'}`}>
                                    {currentLesson ? t('home.inProgress') : (nextLesson ? nextLesson.time.split(' - ')[0] : (examLabel || '-'))}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {currentLesson
                                        ? currentLesson.subject
                                        : nextLesson
                                            ? t('home.nextClass')
                                            : nextExam
                                                ? nextExam.subject
                                                : t('home.nextClass')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Section>

            <Section title={t('home.nextLesson')}>
                <div className="px-4 md:px-0">
                {nextLesson ? (
                     <Card
                        className="cursor-pointer transition-all hover:bg-card/80 hover:shadow-md overflow-hidden relative"
                        onClick={() => onOpenSheet(nextLesson)}
                      >
                        <div className={`h-1 w-full ${getSubjectColor(nextLesson.subject).accent}`} />
                        <CardContent className="p-4 flex justify-between items-center">
                          <div>
                            <p className="font-bold">{nextLesson.subject}</p>
                            <p className="text-sm text-muted-foreground">{`${anonymizeName(nextLesson.teacher)} · ${nextLesson.room}`}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{nextLesson.time}</p>
                          </div>
                        </CardContent>
                      </Card>
                ) : (
                    <Card className="bg-card/50">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            <p>{t('home.noMoreLessons')}</p>
                        </CardContent>
                    </Card>
                )}
                </div>
            </Section>

            <Section title={t('home.newGrades')}>
                 <div className="px-4 md:px-0">
                    <NewGradesList grades={grades} onGradeClick={(grade) => onOpenSheet(grade)} />
                </div>
            </Section>

            <Section title={getDayName(todayKey)}>
                 <div className="px-4 md:px-0 space-y-3">
                    {todaysLessons.length > 0 ? (
                        todaysLessons.map(lesson => (
                            <Card
                                key={lesson.id}
                                className={cn(
                                    "cursor-pointer transition-all hover:bg-card/80 hover:shadow-md overflow-hidden relative",
                                    currentLesson?.id === lesson.id && "border-primary bg-primary/10"
                                )}
                                onClick={() => onOpenSheet(lesson)}
                            >
                                <div className={`h-1 w-full ${getSubjectColor(lesson.subject).accent}`} />
                                <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{lesson.subject}</p>
                                    <p className="text-sm text-muted-foreground">{`${anonymizeName(lesson.teacher)} · ${lesson.room}`}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{lesson.time}</p>
                                </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card className="bg-card/50">
                            <CardContent className="p-16 text-center text-muted-foreground">
                                <p>{t('home.noLessonsToday')}</p>
                            </CardContent>
                        </Card>
                    )}
                 </div>
            </Section>
        </div>
    );
}
