'use client';

import { useState } from 'react';
import type { Lesson, Day } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCurrentDay, getSubjectColor } from '@/lib/utils';

interface TimetableProps {
  lessons: Lesson[];
  onLessonClick: (lesson: Lesson) => void;
  initialDay?: Day;
}

export function Timetable({ lessons, onLessonClick, initialDay }: TimetableProps) {
  const [selectedDay, setSelectedDay] = useState<Day>(initialDay || getCurrentDay());
  const { anonymizeName } = usePrivacy();
  const { t } = useLanguage();

  const days: { key: Day; name: string }[] = [
    { key: 'MON', name: t('timetable.mon') },
    { key: 'TUE', name: t('timetable.tue') },
    { key: 'WED', name: t('timetable.wed') },
    { key: 'THU', name: t('timetable.thu') },
    { key: 'FRI', name: t('timetable.fri') },
  ];


  const filteredLessons = lessons.filter(lesson => lesson.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2 px-4 md:px-0">
        <div className="flex-grow grid grid-cols-5 gap-2 rounded-lg bg-card p-1">
          {days.map(day => (
            <Button
              key={day.key}
              variant={selectedDay === day.key ? 'secondary' : 'ghost'}
              className="w-full h-auto py-2 text-sm font-medium"
              onClick={() => setSelectedDay(day.key)}
            >
              {day.name}
            </Button>
          ))}
        </div>
      </div>
      <div className="px-4 md:px-0 space-y-3">
        {filteredLessons.length > 0 ? (
          filteredLessons.map(lesson => (
            <Card
              key={lesson.id}
              className="cursor-pointer transition-all hover:bg-card/80 hover:shadow-md overflow-hidden"
              onClick={() => onLessonClick(lesson)}
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
                    <p>{t('timetable.noLessons')}</p>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
