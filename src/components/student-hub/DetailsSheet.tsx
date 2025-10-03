'use client';

import { useState, useEffect } from 'react';
import type { DetailItem, Grade, Lesson, SubjectGrade, Announcement, Message } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMessage } from '@/lib/api';

interface DetailsSheetProps {
  item: DetailItem | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function LessonDetails({ item }: { readonly item: Lesson }) {
  const { anonymizeName } = usePrivacy();
  const { t } = useLanguage();
  return (
    <>
      <SheetHeader>
        <SheetTitle>{item.subject}</SheetTitle>
        <SheetDescription>{item.time}</SheetDescription>
      </SheetHeader>
      <div className="py-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('details.teacher')}</span>
          <span>{anonymizeName(item.teacher)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('details.room')}</span>
          <span>{item.room}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('details.day')}</span>
          <span>{item.day}</span>
        </div>
      </div>
    </>
  );
}

function GradeDetails({ item }: { readonly item: SubjectGrade }) {
  const { t } = useLanguage();
  return (
    <>
      <SheetHeader>
        <SheetTitle>{item.subject}</SheetTitle>
        <SheetDescription>{t('details.average')}: {item.average}%</SheetDescription>
      </SheetHeader>
      <Separator className="my-4" />
      <div className="flex-1 flex flex-col min-h-0">
        <p className="font-medium mb-2">{t('grades.gradeHistory')}</p>
        <ScrollArea className="flex-grow">
          <div className="space-y-3 pr-4">
            {item.grades.map((grade: Grade) => (
              <div key={grade.id} className="flex justify-between items-center rounded-lg border p-3">
                <div>
                  <p className="font-medium">{grade.assignment}</p>
                  <p className="text-xs text-muted-foreground">{grade.date}</p>
                </div>
                <p className="font-bold">{`${grade.score} / ${grade.maxScore}`}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

function AnnouncementDetails({ item }: { readonly item: Announcement }) {
  const { anonymizeName } = usePrivacy();
  const { t } = useLanguage();
  return (
    <>
      <SheetHeader>
        <SheetTitle>{item.title}</SheetTitle>
        <SheetDescription>
          {t('details.by')} {anonymizeName(item.author)} {t('details.on')} {item.date}
        </SheetDescription>
      </SheetHeader>
      <Separator className="my-4" />
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-grow">
          <p className="text-sm whitespace-pre-wrap pr-4">{item.content}</p>
        </ScrollArea>
      </div>
    </>
  );
}

function MessageDetails({ item }: {
  readonly item: Message;
}) {
  const { anonymizeName } = usePrivacy();
  const { t } = useLanguage();
  const [fullMessage, setFullMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load full message content when component mounts
  useEffect(() => {
    const loadFullMessage = async () => {
      try {
        setIsLoading(true);
        const message = await getMessage(item.folderId, item.id);
        setFullMessage(message);
      } catch (error) {
        // Fallback to the partial message data
        setFullMessage(item);
      } finally {
        setIsLoading(false);
      }
    };

    loadFullMessage();
  }, [item.id, item.folderId]);

  const handleFileDownload = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(`/api/messages/files/${filePath}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
    }
  };


  const messageToShow = fullMessage || item;

  return (
    <>
      <SheetHeader>
        <SheetTitle className="flex items-center justify-between">
          <span>{messageToShow.title}</span>
          {!messageToShow.read && <Badge variant="secondary">New</Badge>}
        </SheetTitle>
        <SheetDescription>
          {t('messages.sender')}: {anonymizeName(messageToShow.user)} • {messageToShow.date}
        </SheetDescription>
      </SheetHeader>


      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-grow">
          <div className="pr-4">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <>
                {messageToShow.html ? (
                  <div
                    className="text-sm prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: messageToShow.html }}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{messageToShow.content}</p>
                )}
              </>
            )}

            {messageToShow.files && messageToShow.files.length > 0 && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="font-medium mb-2">{t('messages.attachments')}</p>
                  <div className="space-y-2">
                    {messageToShow.files.map((file) => (
                      <Button
                        key={file.path + file.name}
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileDownload(file.path, file.name)}
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {file.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

export function DetailsSheet({ item, isOpen, onOpenChange }: Readonly<DetailsSheetProps>) {

  const renderContent = () => {
    if (!item) return null;

    switch (item.type) {
      case 'lesson':
        return <LessonDetails item={item} />;
      case 'grade':
        return <GradeDetails item={item} />;
      case 'announcement':
        return <AnnouncementDetails item={item} />;
      case 'message':
        return <MessageDetails item={item} />;
      default:
        return null;
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[90svh] rounded-t-lg p-6 flex flex-col">
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}
