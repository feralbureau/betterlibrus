
'use client';
import { useState, useEffect } from 'react';
import { Section } from '@/components/student-hub/Section';
import { Grades } from '@/components/student-hub/Grades';
import { getGrades } from '@/lib/api';
import type { DetailItem, SubjectGrade } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

interface GradesViewProps {
    onOpenSheet: (item: DetailItem) => void;
}

export function GradesView({ onOpenSheet }: GradesViewProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [grades, setGrades] = useState<SubjectGrade[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getGrades();
                setGrades(data);
                if (process.env.NODE_ENV === 'development') {
                    console.log('GradesView: Loaded grades data:', data);
                }
            } catch (error) {
                console.error("Failed to fetch grades", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    // Calculate real averages from grades data
    const calculateAverages = (grades: SubjectGrade[]) => {
        if (!grades || grades.length === 0) {
            return { semester1: null, semester2: null, fullYear: null };
        }

        // For now, we'll use the average from each subject since we don't have semester info
        const subjectAverages = grades
            .map(subject => subject.average)
            .filter(avg => avg > 0);

        if (subjectAverages.length === 0) {
            return { semester1: null, semester2: null, fullYear: null };
        }

        const overallAverage = subjectAverages.reduce((sum, avg) => sum + avg, 0) / subjectAverages.length;
        
        // Semester 2 data is not available yet — show null instead of misleading 0
        return {
            semester1: overallAverage,
            semester2: null,
            fullYear: overallAverage
        };
    };

    const averages = calculateAverages(grades);
    const semester1Avg = averages.semester1;
    const semester2Avg = averages.semester2;
    const fullYearAvg = averages.fullYear;

    const formatAvg = (avg: number | null) => avg != null && avg > 0 ? avg.toFixed(1) : '-';

    if (isLoading) {
        return (
            <div className="space-y-8">
                <Section title={t('section.averages')}>
                    <div className="px-4 md:px-0 grid grid-cols-2 gap-4 mb-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-5 w-24" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-7 w-10" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-5 w-24" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-7 w-10" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="px-4 md:px-0">
                         <Card>
                            <CardHeader className="pb-2">
                                <Skeleton className="h-5 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-12" />
                            </CardContent>
                        </Card>
                    </div>
                </Section>
                <Section title={t('section.gradesBySubject')}>
                    <div className="w-full">
                        <div className="flex space-x-4 p-4 md:px-0 overflow-hidden">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-60 flex-shrink-0 space-y-3 p-4 rounded-lg border bg-card">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-10 h-10 rounded-lg" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                    <div className="flex space-x-2">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Section title={t('section.averages')}>
                 <div className="px-4 md:px-0 grid grid-cols-2 gap-4 mb-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t('section.semester1')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold">{formatAvg(semester1Avg)}</div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t('section.semester2')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold">{formatAvg(semester2Avg)}</div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="px-4 md:px-0">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">{t('section.fullYearAverage')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{formatAvg(fullYearAvg)}</div>
                        </CardContent>
                    </Card>
                </div>
            </Section>
            <Section title={t('section.gradesBySubject')}>
                <Grades grades={grades} onGradeClick={onOpenSheet} />
            </Section>
        </div>
    );
}
