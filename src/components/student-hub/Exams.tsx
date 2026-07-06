import type { Exam } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExamsProps {
  exams: Exam[];
}

// Map app language codes to locale strings for date formatting
const localeMap: Record<string, string> = {
  en: 'en-US',
  pl: 'pl-PL',
  ru: 'ru-RU',
  ua: 'uk-UA',
};

export function Exams({ exams }: ExamsProps) {
  const { t, language } = useLanguage();
  const locale = localeMap[language] || 'en-US';
  return (
    <div className="px-4 md:px-0 space-y-3">
      {exams.length > 0 ? (
        exams.map(exam => (
          <Card key={exam.id} className="bg-card/50 cursor-pointer hover:bg-card/80">
            <CardContent className="p-4 space-y-2">
               <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center p-3 rounded-md bg-card border w-20">
                      <span className="text-sm font-medium text-muted-foreground">{new Date(exam.date).toLocaleString(locale, { month: 'short' }).toUpperCase()}</span>
                      <span className="text-3xl font-bold">{new Date(exam.date).getDate()}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-base">{exam.subject}</p>
                    <p className="text-sm text-muted-foreground">{exam.subject.includes('Paper') ? t('exams.paperSubmission') : t('exams.inPersonExam')}</p>
                  </div>
              </div>
              <div className="flex items-center justify-end text-sm text-muted-foreground gap-4 pt-2">
                   <div className='flex items-center gap-2'>
                      <Clock className="h-4 w-4" />
                      <span>{exam.time}</span>
                  </div>
                   <div className='flex items-center gap-2'>
                      <MapPin className="h-4 w-4" />
                      <span>{exam.location}</span>
                  </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-card/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>{t('exams.noExams')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
