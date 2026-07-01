import type { SubjectGrade } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getGradeColorClasses } from '@/lib/utils';

interface GradesProps {
  grades: SubjectGrade[];
  onGradeClick: (grade: SubjectGrade) => void;
}

export function Grades({ grades, onGradeClick }: GradesProps) {
  const { t } = useLanguage();
  return (
    <div className="w-full px-4 md:px-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grades.map(subjectGrade => (
          <Card
            key={subjectGrade.id}
            className={`transition-transform ${
              subjectGrade.grades.length > 0 
                ? 'cursor-pointer hover:-translate-y-1' 
                : 'cursor-default'
            }`}
            onClick={() => subjectGrade.grades.length > 0 && onGradeClick(subjectGrade)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <subjectGrade.icon className="w-6 h-6 text-secondary-foreground" />
                </div>
                <p className="font-semibold text-base truncate">{subjectGrade.subject}</p>
              </div>
              {subjectGrade.grades.length > 0 ? (
                <div className="flex space-x-2 flex-wrap gap-2">
                  {subjectGrade.grades.slice(0, 3).map(g => {
                    const colors = getGradeColorClasses(g.score, g.maxScore);
                    return (
                      <Button key={g.id} variant="outline" size="sm" className={`rounded-md font-semibold ${colors.bg} ${colors.text} ${colors.border}`}>
                        {Math.round(g.score / g.maxScore * 100)}
                      </Button>
                    );
                  })}
                  {subjectGrade.grades.length > 3 && (
                    <Button variant="ghost" size="sm" className="rounded-md">
                      +{subjectGrade.grades.length - 3}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  {t('grades.noGrades')}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
