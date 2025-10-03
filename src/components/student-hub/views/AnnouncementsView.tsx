
'use client';
import { useState, useEffect } from 'react';
import { Section } from '@/components/student-hub/Section';
import { Announcements } from '@/components/student-hub/Announcements';
import { getAnnouncements } from '@/lib/api';
import type { DetailItem, Announcement } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnnouncementsViewProps {
    onOpenSheet: (item: DetailItem) => void;
}

export function AnnouncementsView({ onOpenSheet }: AnnouncementsViewProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getAnnouncements();
                setAnnouncements(data);
            } catch (error) {
                console.error("Failed to fetch announcements", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    if (isLoading) {
        return (
            <Section title={t('announcements.schoolAnnouncements')}>
                <div className="px-4 md:px-0 space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-4 space-y-3 rounded-lg border bg-card text-card-foreground">
                            <Skeleton className="h-5 w-3/4" />
                            <div className="space-y-1.5">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-3.5 w-3.5 rounded-full" />
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
        <Section title={t('announcements.schoolAnnouncements')}>
            <Announcements announcements={announcements} onAnnouncementClick={onOpenSheet} />
        </Section>
    );
}
