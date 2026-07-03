'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'pl' | 'ru' | 'ua';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys and values
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.timetable': 'Timetable',
    'nav.grades': 'Grades',
    'nav.absences': 'Absences',
    'nav.exams': 'Exams',
    'nav.announcements': 'Announcements',
    'nav.settings': 'Settings',
    'nav.homeShort': 'Home',
    'nav.timetableShort': 'Plan',
    'nav.gradesShort': 'Grades',
    'nav.absencesShort': 'Absences',
    'nav.examsShort': 'Exams',
    'nav.announcementsShort': 'News',
    
    // Home page
    'home.nextLesson': 'Next Lesson',
    'home.todaysLessons': "Today's Lessons",
    'home.newGrades': 'New Grades',
    'home.overallAverage': 'Overall Average',
    'home.inProgress': 'Now!',
    'home.nextClass': 'Next Class',
    'home.noLessonsToday': 'No lessons scheduled for today',
    'home.noNewGrades': 'No new grades',
    
    // Profile
    'profile.login': 'Login',
    'profile.phone': 'Phone',
    'profile.address': 'Address',
    'profile.class': 'Class',
    'profile.studentId': 'Student ID',
    'profile.enrollmentDate': 'Enrollment Date',
    'profile.educator': 'Educator',
    
    // Settings
    'settings.appearance': 'Appearance',
    'settings.appearanceDesc': "Customize the app's look and feel",
    'settings.general': 'General Settings',
    'settings.generalDesc': 'Language, time zone, and other preferences',
    'settings.privacyMode': 'Privacy Mode',
    'settings.privacyModeDesc': 'Replace all names with "John Doe" for privacy when sharing screen',
    'settings.appearanceSettings': 'Appearance Settings',
    'settings.language': 'Language',
    'settings.languageDesc': 'Choose your preferred language',
    'settings.font': 'Font',
    'settings.fontDesc': 'Choose your preferred font family',
    'settings.fontPreview': 'The quick brown fox jumps over the lazy dog',
    'settings.roundness': 'Rounded Design',
    'settings.roundnessDesc': 'Make all elements more rounded and circular',
    
    // Common
    'common.loading': 'Loading...',
    'common.noData': 'No data available',
    'common.teacher': 'Teacher',
    'common.room': 'Room',
    'common.day': 'Day',
    'common.time': 'Time',
    'common.date': 'Date',
    'common.reason': 'Reason',
    'common.status': 'Status',
    'common.subject': 'Subject',
    'common.grade': 'Grade',
    'common.by': 'By',
    'common.on': 'on',
    
    // Grades
    'grades.noGrades': 'No grades available',
    'grades.gradeHistory': 'Grade History',
    
    // Absences
    'absences.noAbsences': 'No absences recorded',
    'absences.noRecords': 'No absences recorded.',
    'absences.excused': 'Excused',
    'absences.unexcused': 'Unexcused',
    'absences.pending': 'Pending',
    'absences.reason': 'Reason',
    'absences.teacher': 'Teacher',
    
    // Exams
    'exams.noExams': 'No exams scheduled.',
    'exams.paperSubmission': 'Paper Submission',
    'exams.inPersonExam': 'In-person Exam',
    
    // Announcements
    'announcements.noAnnouncements': 'No announcements available.',
    
    // Timetable
    'timetable.monday': 'Monday',
    'timetable.tuesday': 'Tuesday',
    'timetable.wednesday': 'Wednesday',
    'timetable.thursday': 'Thursday',
    'timetable.friday': 'Friday',
    'timetable.mon': 'Mon',
    'timetable.tue': 'Tue',
    'timetable.wed': 'Wed',
    'timetable.thu': 'Thu',
    'timetable.fri': 'Fri',
    'timetable.noLessons': 'No lessons scheduled for this day.',
    
    // Details
    'details.teacher': 'Teacher',
    'details.room': 'Room',
    'details.day': 'Day',
    'details.average': 'Average',
    'details.by': 'By',
    'details.on': 'on',
    
    // Logout
    'settings.logout': 'Logout',
    'settings.logoutDesc': 'Sign out of your account',
    'logout.confirmTitle': 'Are you sure?',
    'logout.confirmText': 'Logout from your account? You will need to enter your credentials again to access the app.',
    'logout.button': 'Logout',

    // Section titles
    'section.weeklyTimetable': 'Weekly Timetable',
    'section.examSchedule': 'Exam Schedule',
    'section.absenceRecord': 'Absence Record',
    'section.announcements': 'School Announcements',
    'section.averages': 'Averages',
    'section.gradesBySubject': 'Grades by Subject',
    'section.semester1': '1st Semester',
    'section.semester2': '2nd Semester',
    'section.fullYearAverage': 'Full Year Average',
    'section.profile': 'Profile',
    'section.preferences': 'Preferences',
  },

  pl: {
    // Navigation
    'nav.home': 'Dom',
    'nav.timetable': 'Plan lekcji',
    'nav.grades': 'Oceny',
    'nav.absences': 'Nieobecności',
    'nav.exams': 'Egzaminy',
    'nav.announcements': 'Ogłoszenia',
    'nav.settings': 'Ustawienia',
    'nav.homeShort': 'Dom',
    'nav.timetableShort': 'Plan',
    'nav.gradesShort': 'Oceny',
    'nav.absencesShort': 'Nieob.',
    'nav.examsShort': 'Egz.',
    'nav.announcementsShort': 'Ogłosz.',
    
    // Home page
    'home.nextLesson': 'Następna lekcja',
    'home.todaysLessons': 'Dzisiejsze lekcje',
    'home.newGrades': 'Nowe oceny',
    'home.overallAverage': 'Średnia ogólna',
    'home.inProgress': 'Teraz!',
    'home.nextClass': 'Następna',
    'home.noLessonsToday': 'Brak lekcji na dziś',
    'home.noNewGrades': 'Brak nowych ocen',
    
    // Profile
    'profile.login': 'Login',
    'profile.phone': 'Telefon',
    'profile.address': 'Adres',
    'profile.class': 'Klasa',
    'profile.studentId': 'ID ucznia',
    'profile.enrollmentDate': 'Data zapisania',
    'profile.educator': 'Wychowawca',
    
    // Settings
    'settings.appearance': 'Wygląd',
    'settings.appearanceDesc': 'Dostosuj wygląd aplikacji',
    'settings.general': 'Ustawienia ogólne',
    'settings.generalDesc': 'Język, strefa czasowa i inne preferencje',
    'settings.privacyMode': 'Tryb prywatności',
    'settings.privacyModeDesc': 'Zamień wszystkie nazwy na "John Doe" dla prywatności podczas udostępniania ekranu',
    'settings.appearanceSettings': 'Ustawienia wyglądu',
    'settings.language': 'Język',
    'settings.languageDesc': 'Wybierz preferowany język',
    'settings.font': 'Czcionka',
    'settings.fontDesc': 'Wybierz preferowaną rodzinę czcionek',
    'settings.fontPreview': 'Zażółć gęślą jaźń',
    'settings.roundness': 'Zaokrąglony Design',
    'settings.roundnessDesc': 'Uczyń wszystkie elementy bardziej zaokrąglonymi',
    
    // Common
    'common.loading': 'Ładowanie...',
    'common.noData': 'Brak danych',
    'common.teacher': 'Nauczyciel',
    'common.room': 'Sala',
    'common.day': 'Dzień',
    'common.time': 'Czas',
    'common.date': 'Data',
    'common.reason': 'Powód',
    'common.status': 'Status',
    'common.subject': 'Przedmiot',
    'common.grade': 'Ocena',
    'common.by': 'Przez',
    'common.on': 'dnia',
    
    // Grades
    'grades.noGrades': 'Brak dostępnych ocen',
    'grades.gradeHistory': 'Historia ocen',
    
    // Absences
    'absences.noAbsences': 'Brak zarejestrowanych nieobecności',
    'absences.noRecords': 'Brak zarejestrowanych nieobecności.',
    'absences.excused': 'Usprawiedliwiona',
    'absences.unexcused': 'Nieusprawiedliwiona',
    'absences.pending': 'Oczekująca',
    'absences.reason': 'Powód',
    'absences.teacher': 'Nauczyciel',
    
    // Exams
    'exams.noExams': 'Brak zaplanowanych egzaminów.',
    'exams.paperSubmission': 'Złożenie pracy',
    'exams.inPersonExam': 'Egzamin osobisty',
    
    // Announcements
    'announcements.noAnnouncements': 'Brak dostępnych ogłoszeń.',
    
    // Timetable
    'timetable.monday': 'Poniedziałek',
    'timetable.tuesday': 'Wtorek',
    'timetable.wednesday': 'Środa',
    'timetable.thursday': 'Czwartek',
    'timetable.friday': 'Piątek',
    'timetable.mon': 'Pon',
    'timetable.tue': 'Wt',
    'timetable.wed': 'Śr',
    'timetable.thu': 'Czw',
    'timetable.fri': 'Pt',
    'timetable.noLessons': 'Brak lekcji zaplanowanych na ten dzień.',
    
    // Details
    'details.teacher': 'Nauczyciel',
    'details.room': 'Sala',
    'details.day': 'Dzień',
    'details.average': 'Średnia',
    'details.by': 'Przez',
    'details.on': 'dnia',
    
    // Logout
    'settings.logout': 'Wyloguj',
    'settings.logoutDesc': 'Wyloguj się ze swojego konta',
    'logout.confirmTitle': 'Czy na pewno chcesz się wylogować ze swojego konta?',
    'logout.confirmText': 'Wyloguj się ze swojego konta? Będziesz musiał ponownie wprowadzić swoje dane logowania, aby uzyskać dostęp do aplikacji.',
    'logout.button': 'Wyloguj',

    // Section titles
    'section.weeklyTimetable': 'Tygodniowy plan lekcji',
    'section.examSchedule': 'Terminarz egzaminów',
    'section.absenceRecord': 'Rejestr nieobecności',
    'section.announcements': 'Ogłoszenia szkolne',
    'section.averages': 'Średnie',
    'section.gradesBySubject': 'Oceny według przedmiotów',
    'section.semester1': 'I semestr',
    'section.semester2': 'II semestr',
    'section.fullYearAverage': 'Średnia roczna',
    'section.profile': 'Profil',
    'section.preferences': 'Preferencje',
  },

  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.timetable': 'Расписание',
    'nav.grades': 'Оценки',
    'nav.absences': 'Пропуски',
    'nav.exams': 'Экзамены',
    'nav.announcements': 'Объявления',
    'nav.settings': 'Настройки',
    'nav.homeShort': 'Главная',
    'nav.timetableShort': 'Распис.',
    'nav.gradesShort': 'Оценки',
    'nav.absencesShort': 'Проп.',
    'nav.examsShort': 'Экз.',
    'nav.announcementsShort': 'Объявл.',
    
    // Home page
    'home.nextLesson': 'Следующий урок',
    'home.todaysLessons': 'Сегодняшние уроки',
    'home.newGrades': 'Новые оценки',
    'home.overallAverage': 'Средний балл',
    'home.inProgress': 'Сейчас!',
    'home.nextClass': 'Следующий',
    'home.noLessonsToday': 'На сегодня уроков нет',
    'home.noNewGrades': 'Новых оценок нет',
    
    // Profile
    'profile.login': 'Логин',
    'profile.phone': 'Телефон',
    'profile.address': 'Адрес',
    'profile.class': 'Класс',
    'profile.studentId': 'ID студента',
    'profile.enrollmentDate': 'Дата поступления',
    'profile.educator': 'Классный руководитель',
    
    // Settings
    'settings.appearance': 'Внешний вид',
    'settings.appearanceDesc': 'Настройте внешний вид приложения',
    'settings.general': 'Общие настройки',
    'settings.generalDesc': 'Язык, часовой пояс и другие предпочтения',
    'settings.privacyMode': 'Режим конфиденциальности',
    'settings.privacyModeDesc': 'Заменить все имена на "John Doe" для конфиденциальности при демонстрации экрана',
    'settings.appearanceSettings': 'Настройки внешнего вида',
    'settings.language': 'Язык',
    'settings.languageDesc': 'Выберите предпочитаемый язык',
    'settings.font': 'Шрифт',
    'settings.fontDesc': 'Выберите предпочитаемое семейство шрифтов',
    'settings.fontPreview': 'Съешь же ещё этих мягких французских булок',
    'settings.roundness': 'Округлый дизайн',
    'settings.roundnessDesc': 'Сделать все элементы более округлыми и круглыми',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.noData': 'Нет данных',
    'common.teacher': 'Учитель',
    'common.room': 'Кабинет',
    'common.day': 'День',
    'common.time': 'Время',
    'common.date': 'Дата',
    'common.reason': 'Причина',
    'common.status': 'Статус',
    'common.subject': 'Предмет',
    'common.grade': 'Оценка',
    'common.by': 'От',
    'common.on': '',
    
    // Grades
    'grades.noGrades': 'Нет доступных оценок',
    'grades.gradeHistory': 'История оценок',
    
    // Absences
    'absences.noAbsences': 'Пропусков не зарегистрировано',
    'absences.noRecords': 'Пропусков не зарегистрировано.',
    'absences.excused': 'Оправданный',
    'absences.unexcused': 'Неоправданный',
    'absences.pending': 'В ожидании',
    'absences.reason': 'Причина',
    'absences.teacher': 'Учитель',
    
    // Exams
    'exams.noExams': 'Экзамены не запланированы.',
    'exams.paperSubmission': 'Сдача работы',
    'exams.inPersonExam': 'Очный экзамен',
    
    // Announcements
    'announcements.noAnnouncements': 'Нет доступных объявлений.',
    
    // Timetable
    'timetable.monday': 'Понедельник',
    'timetable.tuesday': 'Вторник',
    'timetable.wednesday': 'Среда',
    'timetable.thursday': 'Четверг',
    'timetable.friday': 'Пятница',
    'timetable.mon': 'Пн',
    'timetable.tue': 'Вт',
    'timetable.wed': 'Ср',
    'timetable.thu': 'Чт',
    'timetable.fri': 'Пт',
    'timetable.noLessons': 'На этот день уроков не запланировано.',
    
    // Details
    'details.teacher': 'Учитель',
    'details.room': 'Кабинет',
    'details.day': 'День',
    'details.average': 'Средний',
    'details.by': 'От',
    'details.on': '',
    
    // Logout
    'settings.logout': 'Выйти',
    'settings.logoutDesc': 'Выйти из своего аккаунта',
    'logout.confirmTitle': 'Вы уверены?',
    'logout.confirmText': 'Выйти из своего аккаунта? Вам потребуется снова ввести свои учетные данные для доступа к приложению.',
    'logout.button': 'Выйти',

    // Section titles
    'section.weeklyTimetable': 'Еженедельное расписание',
    'section.examSchedule': 'Расписание экзаменов',
    'section.absenceRecord': 'Запись пропусков',
    'section.announcements': 'Школьные объявления',
    'section.averages': 'Средние баллы',
    'section.gradesBySubject': 'Оценки по предметам',
    'section.semester1': '1 семестр',
    'section.semester2': '2 семестр',
    'section.fullYearAverage': 'Средний годовой',
    'section.profile': 'Профиль',
    'section.preferences': 'Предпочтения',
  },

  ua: {
    // Navigation
    'nav.home': 'Головна',
    'nav.timetable': 'Розклад',
    'nav.grades': 'Оцінки',
    'nav.absences': 'Пропуски',
    'nav.exams': 'Іспити',
    'nav.announcements': 'Оголошення',
    'nav.settings': 'Налаштування',
    'nav.homeShort': 'Головна',
    'nav.timetableShort': 'Розклад',
    'nav.gradesShort': 'Оцінки',
    'nav.absencesShort': 'Проп.',
    'nav.examsShort': 'Ісп.',
    'nav.announcementsShort': 'Оголош.',
    
    // Home page
    'home.nextLesson': 'Наступний урок',
    'home.todaysLessons': 'Сьогоднішні уроки',
    'home.newGrades': 'Нові оцінки',
    'home.overallAverage': 'Середній бал',
    'home.inProgress': 'Зараз!',
    'home.nextClass': 'Наступний',
    'home.noLessonsToday': 'На сьогодні уроків немає',
    'home.noNewGrades': 'Нових оцінок немає',
    
    // Profile
    'profile.login': 'Логін',
    'profile.phone': 'Телефон',
    'profile.address': 'Адреса',
    'profile.class': 'Клас',
    'profile.studentId': 'ID студента',
    'profile.enrollmentDate': 'Дата вступу',
    'profile.educator': 'Класний керівник',
    
    // Settings
    'settings.appearance': 'Зовнішній вигляд',
    'settings.appearanceDesc': 'Налаштуйте зовнішній вигляд додатку',
    'settings.general': 'Загальні налаштування',
    'settings.generalDesc': 'Мова, часовий пояс та інші переваги',
    'settings.privacyMode': 'Режим конфіденційності',
    'settings.privacyModeDesc': 'Замінити всі імена на "John Doe" для конфіденційності під час демонстрації екрана',
    'settings.appearanceSettings': 'Налаштування зовнішнього вигляду',
    'settings.language': 'Мова',
    'settings.languageDesc': 'Оберіть бажану мову',
    'settings.font': 'Шрифт',
    'settings.fontDesc': 'Оберіть бажане сімейство шрифтів',
    'settings.fontPreview': 'Зїж же ще цих мягких французьких булок та випий чаю',
    'settings.roundness': 'Округлий дизайн',
    'settings.roundnessDesc': 'Зробити всі елементи більш округлими та круглими',
    
    // Common
    'common.loading': 'Завантаження...',
    'common.noData': 'Немає даних',
    'common.teacher': 'Вчитель',
    'common.room': 'Кабінет',
    'common.day': 'День',
    'common.time': 'Час',
    'common.date': 'Дата',
    'common.reason': 'Причина',
    'common.status': 'Статус',
    'common.subject': 'Предмет',
    'common.grade': 'Оцінка',
    'common.by': 'Від',
    'common.on': '',
    
    // Grades
    'grades.noGrades': 'Немає доступних оцінок',
    'grades.gradeHistory': 'Історія оцінок',
    
    // Absences
    'absences.noAbsences': 'Пропусків не зареєстровано',
    'absences.noRecords': 'Пропусків не зареєстровано.',
    'absences.excused': 'Поважний',
    'absences.unexcused': 'Неповажний',
    'absences.pending': 'В очікуванні',
    'absences.reason': 'Причина',
    'absences.teacher': 'Вчитель',
    
    // Exams
    'exams.noExams': 'Іспити не заплановані.',
    'exams.paperSubmission': 'Здача роботи',
    'exams.inPersonExam': 'Очний іспит',
    
    // Announcements
    'announcements.noAnnouncements': 'Немає доступних оголошень.',
    
    // Timetable
    'timetable.monday': 'Понеділок',
    'timetable.tuesday': 'Вівторок',
    'timetable.wednesday': 'Середа',
    'timetable.thursday': 'Четвер',
    'timetable.friday': "П'ятниця",
    'timetable.mon': 'Пн',
    'timetable.tue': 'Вт',
    'timetable.wed': 'Ср',
    'timetable.thu': 'Чт',
    'timetable.fri': 'Пт',
    'timetable.noLessons': 'На цей день уроків не заплановано.',
    
    // Details
    'details.teacher': 'Вчитель',
    'details.room': 'Кімната',
    'details.day': 'День',
    'details.average': 'Середній',
    'details.by': 'Від',
    'details.on': '',
    
    // Logout
    'settings.logout': 'Вийти',
    'settings.logoutDesc': 'Вийти зі свого облікового запису',
    'logout.confirmTitle': 'Вихід',
    'logout.confirmText': 'Ви дійсно хочете вийти зі свого облікового запису? Вам потрібно буде знову ввести свої облікові дані для доступу до додатку.',
    'logout.button': 'Вийти',

    // Section titles
    'section.weeklyTimetable': 'Тижневий розклад',
    'section.examSchedule': 'Розклад іспитів',
    'section.absenceRecord': 'Запис пропусків',
    'section.announcements': 'Шкільні оголошення',
    'section.averages': 'Середні бали',
    'section.gradesBySubject': 'Оцінки з предметів',
    'section.semester1': '1 семестр',
    'section.semester2': '2 семестр',
    'section.fullYearAverage': 'Середній річний',
    'section.profile': 'Профіль',
    'section.preferences': 'Уподобання',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language') as Language;
    if (savedLanguage && ['en', 'pl', 'ru', 'ua'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
