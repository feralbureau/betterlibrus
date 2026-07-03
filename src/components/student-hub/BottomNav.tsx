'use client';

import { Home, Calendar, Star, ListChecks, FileText, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { View } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

export function BottomNav({ activeView, onNavigate }: BottomNavProps) {
  const { t } = useLanguage();

  const navItems: { view: View; icon: typeof Home; label: string }[] = [
    { view: 'Home', icon: Home, label: t('nav.homeShort') },
    { view: 'Timetable', icon: Calendar, label: t('nav.timetableShort') },
    { view: 'Grades', icon: Star, label: t('nav.gradesShort') },
    { view: 'Absences', icon: ListChecks, label: t('nav.absencesShort') },
    { view: 'Exams', icon: FileText, label: t('nav.examsShort') },
    { view: 'Announcements', icon: Bell, label: t('nav.announcementsShort') },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 h-16 bg-background/80 backdrop-blur-sm border-t border-border">
      <div className="container mx-auto h-full max-w-4xl">
        <div className="flex h-full items-center justify-around overflow-x-auto">
          {navItems.map(item => {
            const isActive = activeView === item.view;
            return (
              <div key={item.view} className="relative flex flex-col items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-lg transition-colors"
                    onClick={() => onNavigate(item.view)}
                    aria-label={item.label}
                  >
                    <item.icon className={cn("h-6 w-6", isActive ? "text-primary" : "text-muted-foreground")} />
                  </Button>
                  {isActive && <div className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary" />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
