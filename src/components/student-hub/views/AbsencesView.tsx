
'use client';
import { useState, useEffect } from 'react';
import { Section } from '@/components/student-hub/Section';
import { Absences } from '@/components/student-hub/Absences';
import { getAbsences } from '@/lib/api';
import type { Absence } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function AbsencesView() {
    const [isLoading, setIsLoading] = useState(true);
    const [absences, setAbsences] = useState<Absence[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getAbsences();
                setAbsences(data);
            } catch (error) {
                console.error("Failed to fetch absences", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    if (isLoading) {
        return (
            <Section title={t('absences.absenceRecord')}>
                <div className="px-4 md:px-0 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 space-y-2 rounded-lg border bg-card text-card-foreground">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-40" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="h-6 w-24 rounded-full" />
                            </div>
                            <div className="space-y-2 pt-2">
                                <div className='flex items-center gap-2'>
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        );
    }

    return (
        <Section title={t('absences.absenceRecord')}>
            <Absences absences={absences} />
        </Section>
    );
}
