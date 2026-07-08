'use client';

import { useState, useEffect } from 'react';
import { Section } from '@/components/student-hub/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUser } from '@/lib/api';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useFont } from '@/contexts/FontContext';
import { useRoundness } from '@/contexts/RoundnessContext';
import { User, Mail, Phone, MapPin, GraduationCap, Calendar, Settings, Palette, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  class: string;
  studentId: string;
  enrollmentDate: string;
  educator?: string;
  status: 'Active' | 'Inactive';
}

export function SettingsView() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { privacyMode, setPrivacyMode, anonymizeName, anonymizeEmail } = usePrivacy();
  const { language, setLanguage, t } = useLanguage();
  const { selectedFont, setSelectedFont, fontOptions } = useFont();
  const { roundedMode, setRoundedMode } = useRoundness();

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        // Redirect to login page
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userData = await getUser();

        // Transform the real API data into our profile format
        const profileData: UserProfile = {
          name: userData.user?.fullName || userData.user?.name || 'Student',
          email: userData.user?.email || 'Not provided',
          phone: userData.user?.phone || 'Not provided', 
          address: userData.user?.address || 'Not provided',
          class: userData.user?.class || 'Not assigned',
          studentId: userData.user?.studentId || userData.user?.id || 'N/A',
          enrollmentDate: userData.user?.enrollmentDate || 'Not provided',
          educator: userData.user?.educator || 'Not assigned',
          status: (userData.success ? 'Active' : 'Inactive') as 'Active' | 'Inactive'
        };

        setProfile(profileData);
      } catch (error: any) {
        console.error('Failed to load profile:', error);
        
        // Fallback data if API fails
        const fallbackProfile: UserProfile = {
          name: 'Student',
          email: 'student@example.com',
          phone: 'Not provided',
          address: 'Not provided',
          class: 'Not assigned',
          studentId: 'N/A',
          enrollmentDate: '2024-09-01',
          status: 'Active' as 'Active'
        };
        setProfile(fallbackProfile);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Profile Section Loading */}
        <Section title={t('section.profile')}>
          <div className="px-4 md:px-0">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* Preferences Loading */}
        <Section title={t('section.preferences')}>
          <div className="px-4 md:px-0 space-y-3">
            {[...Array(2)].map((_, i) => (
              <Card key={i} className="cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <Section title={t('section.profile')}>
        <div className="px-4 md:px-0">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                  {anonymizeName(profile?.name || '').split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <CardTitle className="text-xl">{anonymizeName(profile?.name || '')}</CardTitle>
                  {profile?.studentId && profile?.studentId !== 'N/A' && (
                    <span className="text-sm text-muted-foreground">ID: {profile?.studentId}</span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.email && profile.email !== 'Not provided' && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('profile.login')}</p>
                      <p className="font-medium">{anonymizeEmail(profile?.email)}</p>
                    </div>
                  </div>
                )}
                
                {profile?.phone && profile.phone !== 'Not provided' && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('profile.phone')}</p>
                      <p className="font-medium">{profile?.phone}</p>
                    </div>
                  </div>
                )}
                
                {profile?.class && profile.class !== 'Not assigned' && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('profile.class')}</p>
                      <p className="font-medium">{profile?.class}</p>
                    </div>
                  </div>
                )}
                
                {profile?.educator && profile.educator !== 'Not assigned' && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('profile.educator')}</p>
                      <p className="font-medium">{anonymizeName(profile?.educator)}</p>
                    </div>
                  </div>
                )}
                
                {profile?.enrollmentDate && profile.enrollmentDate !== 'Not provided' && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('profile.enrollmentDate')}</p>
                      <p className="font-medium">{profile?.enrollmentDate}</p>
                    </div>
                  </div>
                )}
                
                {profile?.address && profile.address !== 'Not provided' && (
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('profile.address')}</p>
                      <p className="font-medium">{profile?.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Preferences */}
      <Section title={t('section.preferences')}>
        <div className="px-4 md:px-0 space-y-3">
          <Sheet>
            <SheetTrigger asChild>
              <Card className="cursor-pointer hover:bg-card/80 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('settings.appearance')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.appearanceDesc')}</p>
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-fit max-h-[80vh]">
              <SheetHeader>
                <SheetTitle>{t('settings.appearanceSettings')}</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{t('settings.privacyMode')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.privacyModeDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={privacyMode}
                    onCheckedChange={setPrivacyMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-medium">{t('settings.roundness')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.roundnessDesc')}
                    </p>
                  </div>
                  <Switch
                    checked={roundedMode}
                    onCheckedChange={setRoundedMode}
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-medium">{t('settings.font')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.fontDesc')}
                    </p>
                  </div>
                  
                  <Select 
                    value={selectedFont.id} 
                    onValueChange={(value) => {
                      const font = fontOptions.find(f => f.id === value);
                      if (font) setSelectedFont(font);
                    }}
                  >
                    <SelectTrigger className="w-full py-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.id} value={font.id} className="py-3">
                          <div className="flex flex-col items-start">
                            <span style={{ fontFamily: font.family }}>{font.name}</span>
                            <span className="text-xs text-muted-foreground">{font.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <Card className="cursor-pointer hover:bg-card/80 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('settings.general')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.generalDesc')}</p>
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-fit max-h-[80vh]">
              <SheetHeader>
                <SheetTitle>{t('settings.general')}</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="font-medium">{t('settings.language')}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.languageDesc')}
                    </p>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="pl">Polski</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="ua">Українська</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logout Option */}
          <Sheet open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
            <SheetTrigger asChild>
              <Card className="cursor-pointer hover:bg-card/80 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{t('settings.logout')}</p>
                    <p className="text-sm text-muted-foreground">{t('settings.logoutDesc')}</p>
                  </div>
                </CardContent>
              </Card>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-fit max-h-[80vh]">
              <SheetHeader>
                <SheetTitle>{t('logout.confirmTitle')}</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-4">
                <p className="text-center text-muted-foreground">
                  {t('logout.confirmText')}
                </p>
                <Button 
                  onClick={handleLogout}
                  variant="destructive" 
                  className="w-full"
                  size="lg"
                >
                  {t('logout.button')}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Section>
    </div>
  );
}
