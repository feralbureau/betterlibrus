
'use client'

import { useState, useEffect } from 'react';
import { Section } from '@/components/student-hub/Section';
import { Timetable } from '@/components/student-hub/Timetable';
import { getTimetable } from '@/lib/api';
import type { DetailItem, Day, Lesson } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

interface TimetableViewProps {
    onOpenSheet: (item: DetailItem) => void;
}

function getToday(): Day {
    const day = new Date().getDay();
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
    const today = daysOfWeek[day];
    if (today === 'SAT' || today === 'SUN') return 'MON';
    return today as Day;
}

export function TimetableView({ onOpenSheet }: Readonly<TimetableViewProps>) {
    const [isLoading, setIsLoading] = useState(true);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [initialDay, setInitialDay] = useState<Day | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getTimetable();
                setLessons(data);
                setInitialDay(getToday());
            } catch (error) {
                console.error("Failed to fetch timetable", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    if (isLoading || !initialDay) {
        return (
            <Section title={t('timetable.weeklyTimetable')}>
                <div className="w-full space-y-4">
                    <div className="flex items-center gap-2 px-4 md:px-0">
                        <Skeleton className="h-12 flex-grow rounded-lg" />
                        <Skeleton className="h-12 w-12 rounded-lg" />
                    </div>
                    <div className="px-4 md:px-0 space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={`skeleton-${i}`} className="p-4 flex justify-between items-center rounded-lg border bg-card">
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
                </div>
            </Section>
        );
    }

    return (
        <Section title={t('timetable.weeklyTimetable')}>
            <Timetable lessons={lessons} onLessonClick={onOpenSheet} initialDay={initialDay} />
        </Section>
    );
}
