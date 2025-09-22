'use client';

import { useState, useEffect } from 'react';
import { Mail, MailOpen, Paperclip, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { getMessageFolders, getMessages } from '@/lib/api';
import type { Message, MessageFolder, DetailItem } from '@/lib/types';

interface MessagesViewProps {
  onOpenSheet: (item: DetailItem) => void;
}

export function MessagesView({ onOpenSheet }: MessagesViewProps) {
  const { t } = useLanguage();
  const { anonymizeName } = usePrivacy();
  const [folders, setFolders] = useState<MessageFolder[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>('5'); // Default to Inbox (folder 5)
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load folders on component mount
  useEffect(() => {
    const loadFolders = async () => {
      try {
        const foldersData = await getMessageFolders();
        setFolders(foldersData);
      } catch (error) {
      }
    };

    loadFolders();
  }, []);

  // Load messages when active folder or page changes
  useEffect(() => {
    const loadMessages = async () => {
      if (!activeFolder) return;

      setIsLoading(true);
      try {
        const response = await getMessages(activeFolder, currentPage, 10);
        setMessages(response.messages);
        setPagination(response.pagination);
      } catch (error) {
        setMessages([]);
        setPagination({
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          hasNext: false,
          hasPrev: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [activeFolder, currentPage]);

  // Reset page when folder changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFolder]);

  // Note: Message deletion is handled in the DetailsSheet component

  const handleMessageClick = (message: Message) => {
    onOpenSheet(message);
  };

  const getFolderName = (folderId: string) => {
    switch (folderId) {
      case '5':
        return t('messages.inbox');
      case '6':
        return t('messages.sent');
      case '7':
        return t('messages.trash');
      default:
        return folders.find(f => f.id === folderId)?.name || t('messages.unknown');
    }
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t('nav.messages')}</h2>
        {unreadCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {unreadCount} {t('messages.unreadMessages').toLowerCase()}
          </p>
        )}
      </div>

      <Tabs value={activeFolder} onValueChange={setActiveFolder}>
        <TabsList className="grid w-full grid-cols-3">
          {folders.map((folder) => (
            <TabsTrigger key={folder.id} value={folder.id} className="flex items-center gap-2">
              {getFolderName(folder.id)}
              {folder.count > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {folder.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {folders.map((folder) => (
          <TabsContent key={folder.id} value={folder.id} className="mt-6">
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <>
                  {messages.length === 0 ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">{t('messages.noMessagesInFolder')}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    messages.map((message) => (
                      <Card
                        key={message.id}
                        className={`cursor-pointer transition-all hover:bg-card/80 hover:shadow-md ${!message.read ? 'border-primary/50 bg-accent/20' : ''
                          }`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                {message.read ? (
                                  <MailOpen className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <Mail className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className={`text-sm truncate ${!message.read ? 'font-semibold' : 'text-muted-foreground'}`}>
                                    {anonymizeName(message.user)}
                                  </p>
                                  <p className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                    {message.date}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className={`text-sm truncate ${!message.read ? 'font-medium' : 'text-muted-foreground'}`}>
                                    {message.title}
                                  </p>
                                  <div className="flex items-center gap-2 ml-2">
                                    {message.files && message.files.length > 0 && (
                                      <Paperclip className="h-3 w-3 text-muted-foreground" />
                                    )}
                                    {!message.read && (
                                      <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </>
              )}

              {/* Pagination Controls */}
              {!isLoading && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {t('common.showing')} {messages.length} {t('common.of')} {pagination.totalItems} {t('common.messages')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!pagination.hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {t('common.previous')}
                    </Button>
                    <span className="px-3 py-1 text-sm">
                      {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                      disabled={!pagination.hasNext}
                    >
                      {t('common.next')}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

    </div>
  );
}
