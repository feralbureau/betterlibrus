import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { View } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { getUser } from '@/lib/api';

interface HeaderProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

export function Header({ activeView, onNavigate }: HeaderProps) {
  const { anonymizeName } = usePrivacy();
  const { t } = useLanguage();
  const [userFirstName, setUserFirstName] = useState<string>(t('common.loading'));

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUser();
        if (userData.user?.fullName) {
          // Extract first name from full name
          const firstName = userData.user.fullName.split(' ')[0];
          setUserFirstName(firstName);
        }
      } catch (error) {
        // Keep default "Student" if loading fails
      }
    };

    loadUserData();
  }, []);

  const getTitle = () => {
    if (['Settings'].includes(activeView)) {
        return t(`nav.${activeView.toLowerCase()}`);
    }
    return activeView === 'Home' ? anonymizeName(userFirstName) : t(`nav.${activeView.toLowerCase()}`);
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 md:px-6 bg-background/80 backdrop-blur-sm border-b border-border">
      <h1 className="text-xl font-bold text-foreground">
        {getTitle()}
      </h1>
      <div className="flex items-center gap-2">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onNavigate('Settings')}
            className={cn(activeView === 'Settings' && 'bg-accent text-accent-foreground')}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
}
