
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
import { SettingsView } from '@/components/student-hub/views/SettingsView';


export function StudentHub() {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null);
  const [activeView, setActiveView] = useState<View>('Home');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenSheet = (item: DetailItem) => {
    setSelectedItem(item);
    setSheetOpen(true);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderView = () => {
    switch(activeView) {
      case 'Home':
        return <HomeView key={`home-${refreshKey}`} onOpenSheet={handleOpenSheet} />;
      case 'Timetable':
        return <TimetableView key={`timetable-${refreshKey}`} onOpenSheet={handleOpenSheet} />;
      case 'Grades':
        return <GradesView key={`grades-${refreshKey}`} onOpenSheet={handleOpenSheet} />;
      case 'Absences':
        return <AbsencesView key={`absences-${refreshKey}`} />;
      case 'Exams':
        return <ExamsView key={`exams-${refreshKey}`} />;
      case 'Announcements':
        return <AnnouncementsView key={`announcements-${refreshKey}`} onOpenSheet={handleOpenSheet} />;
      case 'Settings':
        return <SettingsView key={`settings-${refreshKey}`} />;
      default:
        return <HomeView key={`home-${refreshKey}`} onOpenSheet={handleOpenSheet} />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header activeView={activeView} onNavigate={setActiveView} onRefresh={handleRefresh} />
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
