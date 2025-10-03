
'use client';

import { useState } from 'react';
import type { DetailItem, View } from '@/lib/types';

import { Header } from '@/components/student-hub/Header';
import { DetailsSheet } from '@/components/student-hub/DetailsSheet';
import { BottomNav } from '@/components/student-hub/BottomNav';

import { HomeView } from '@/components/student-hub/views/HomeView';
import { TimetableView } from '@/components/student-hub/views/TimetableView';
import { GradesView } from '@/components/student-hub/views/GradesView';
import { AbsencesView } from '@/components/student-hub/views/AbsencesView';
import { ExamsView } from '@/components/student-hub/views/ExamsView';
import { AnnouncementsView } from '@/components/student-hub/views/AnnouncementsView';
import { MessagesView } from '@/components/student-hub/views/MessagesView';
import { SettingsView } from '@/components/student-hub/views/SettingsView';


export function StudentHub() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null);
  const [activeView, setActiveView] = useState<View>('Home');

  const handleOpenSheet = (item: DetailItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const renderView = () => {
    switch (activeView) {
      case 'Home':
        return <HomeView onOpenSheet={handleOpenSheet} />;
      case 'Timetable':
        return <TimetableView onOpenSheet={handleOpenSheet} />;
      case 'Grades':
        return <GradesView onOpenSheet={handleOpenSheet} />;
      case 'Absences':
        return <AbsencesView />;
      case 'Exams':
        return <ExamsView />;
      case 'Announcements':
        return <AnnouncementsView onOpenSheet={handleOpenSheet} />;
      case 'Messages':
        return <MessagesView onOpenSheet={handleOpenSheet} />;
      case 'Settings':
        return <SettingsView />;
      default:
        return <HomeView onOpenSheet={handleOpenSheet} />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header activeView={activeView} onNavigate={setActiveView} />
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto max-w-4xl pt-6">
          {renderView()}
        </div>
      </main>
      <BottomNav activeView={activeView} onNavigate={setActiveView} />
      <DetailsSheet
        isOpen={isSheetOpen}
        onOpenChange={setSheetOpen}
        item={selectedItem}
      />
    </div>
  );
}
