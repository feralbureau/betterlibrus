
'use client';
import { useState, useEffect } from 'react';
import { Section } from '@/components/student-hub/Section';
import { Exams } from '@/components/student-hub/Exams';
import { getExams } from '@/lib/api';
import type { Exam } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

export function ExamsView() {
    const [isLoading, setIsLoading] = useState(true);
    const [exams, setExams] = useState<Exam[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getExams();
                setExams(data);
            } catch (error) {
                console.error("Failed to fetch exams", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    if (isLoading) {
        return (
            <Section title={t('section.examSchedule')}>
                <div className="px-4 md:px-0 space-y-3">
                    {[...Array(3)].map((_, i) => (
                         <div key={i} className="p-4 space-y-2 rounded-lg border bg-card text-card-foreground">
                             <div className="flex items-center gap-4">
                                <div className="flex flex-col items-center justify-center p-3 rounded-md bg-muted border w-20">
                                    <Skeleton className="h-4 w-10 mb-1" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                                <div className="flex-grow space-y-2">
                                  <Skeleton className="h-5 w-3/4" />
                                  <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-4 pt-2">
                                 <div className='flex items-center gap-2'>
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-12" />
                                </div>
                                 <div className='flex items-center gap-2'>
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                            </div>
                         </div>
                    ))}
                </div>
            </Section>
        );
    }

    return (
        <Section title={t('section.examSchedule')}>
            <Exams exams={exams} />
        </Section>
    );
}
