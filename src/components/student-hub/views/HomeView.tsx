
'use client';
import { useState, useEffect } from 'react';
import type { Lesson, DetailItem, Day, SubjectGrade } from '@/lib/types';
import { Section } from '@/components/student-hub/Section';
import { getTimetable, getGrades } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { NewGradesList } from '@/components/student-hub/NewGradesList';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getSubjectColor } from '@/lib/utils';


interface HomeViewProps {
    onOpenSheet: (item: DetailItem) => void;
}

function getDayOfWeek(date: Date): 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' {
    const day = date.getDay();
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
    const today = days[day];
    if (today === 'SAT' || today === 'SUN') return 'MON'; // Default to Monday on weekends
    return today;
}

export function HomeView({ onOpenSheet }: HomeViewProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [grades, setGrades] = useState<SubjectGrade[]>([]);
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
                const [timetableData, gradesData] = await Promise.all([
                    getTimetable(),
                    getGrades()
                ]);
                setLessons(timetableData);
                setGrades(gradesData);
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
                <Section title="Today">
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

    const todayKey = getDayOfWeek(currentTime);
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
                                <p className="text-2xl font-bold text-primary">
                                    {overallAverage !== null ? overallAverage.toFixed(1) : '-'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{t('home.overallAverage')}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/70">
                            <CardContent className="p-4 text-center">
                                <p className="text-2xl font-bold text-primary">
                                    {currentLesson ? t('home.inProgress') : (nextLesson ? nextLesson.time.split(' - ')[0] : '-')}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{currentLesson ? currentLesson.subject : t('home.nextClass')}</p>
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
                            <p>No more lessons today.</p>
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
