import type { Absence } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, User, HelpCircle } from 'lucide-react';
import { usePrivacy } from '@/contexts/PrivacyContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AbsencesProps {
  absences: Absence[];
}

// Map app language codes to locale strings for date formatting
const localeMap: Record<string, string> = {
  en: 'en-US',
  pl: 'pl-PL',
  ru: 'ru-RU',
  ua: 'uk-UA',
};

export function Absences({ absences }: AbsencesProps) {
  const { anonymizeName } = usePrivacy();
  const { t, language } = useLanguage();
  const locale = localeMap[language] || 'en-US';
  const getStatusInfo = (status: Absence['status']) => {
    switch (status) {
      case 'Excused':
        return { variant: 'default' as const, icon: CheckCircle2, label: t('absences.excused') };
      case 'Unexcused':
        return { variant: 'destructive' as const, icon: XCircle, label: t('absences.unexcused') };
      case 'Pending':
        return { variant: 'secondary' as const, icon: AlertCircle, label: t('absences.pending') };
    }
  };

  return (
    <div className="px-4 md:px-0 space-y-3">
      {absences.length > 0 ? (
        absences.map(absence => {
          const statusInfo = getStatusInfo(absence.status);
          return (
            <Card key={absence.id} className="bg-card/50 cursor-pointer hover:bg-card/80">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-base">{new Date(absence.date).toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p className="text-sm text-muted-foreground">{absence.subject}</p>
                    </div>
                     <Badge variant={statusInfo.variant} className="flex items-center gap-1.5">
                          <statusInfo.icon className="h-3.5 w-3.5" />
                          <span>{statusInfo.label}</span>
                      </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 pt-2">
                   <div className='flex items-center gap-2'>
                      <HelpCircle className="h-4 w-4" />
                      <span>{t('absences.reason')}: {absence.reason}</span>
                  </div>
                   <div className='flex items-center gap-2'>
                      <User className="h-4 w-4" />
                      <span>{t('absences.teacher')}: {anonymizeName(absence.teacher)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      ) : (
        <Card className="bg-card/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>{t('absences.noRecords')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
