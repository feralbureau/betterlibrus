'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

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
    'nav.messages': 'Messages',
    'nav.settings': 'Settings',

    // Home page
    'home.nextLesson': 'Next Lesson',
    'home.newGrades': 'New Grades',
    'home.noLessonsToday': 'No lessons scheduled for today',
    'home.noNewGrades': 'No new grades',
    'home.noMoreLessonsToday': 'No more lessons today',
    'home.today': 'Today',

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
    'settings.roundness': 'Rounded Design',
    'settings.roundnessDesc': 'Make all elements more rounded and circular',
    'settings.profile': 'Profile',
    'settings.preferences': 'Preferences',

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
    'common.showing': 'Showing',
    'common.of': 'of',
    'common.messages': 'messages',
    'common.previous': 'Previous',
    'common.next': 'Next',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning',
    'common.errorOccurred': 'An error occurred',
    'common.unknown': 'Unknown',
    'common.notProvided': 'Not provided',
    'common.notAssigned': 'Not assigned',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.unknownSubject': 'Unknown Subject',
    'common.unknownTeacher': 'Unknown Teacher',
    'common.unknownAuthor': 'Unknown Author',
    'common.unknownSender': 'Unknown Sender',
    'common.unknownFolder': 'Unknown Folder',
    'common.assignment': 'Assignment',
    'common.notSpecified': 'Not specified',
    'common.untitled': 'Untitled',
    'common.noSubject': 'No Subject',

    // Grades
    'grades.noGrades': 'No grades available',
    'grades.gradeHistory': 'Grade History',
    'grades.averages': 'Averages',
    'grades.gradesBySubject': 'Grades by Subject',

    // Absences
    'absences.noAbsences': 'No absences recorded',
    'absences.noRecords': 'No absences recorded.',
    'absences.absenceRecord': 'Absence Record',
    'absences.excused': 'Excused',
    'absences.unexcused': 'Unexcused',
    'absences.pending': 'Pending',
    'absences.reason': 'Reason',
    'absences.teacher': 'Teacher',

    // Exams
    'exams.noExams': 'No exams scheduled.',
    'exams.examSchedule': 'Exam Schedule',
    'exams.paperSubmission': 'Paper Submission',
    'exams.inPersonExam': 'In-person Exam',

    // Announcements
    'announcements.noAnnouncements': 'No announcements available.',
    'announcements.schoolAnnouncements': 'School Announcements',

    // Messages
    'messages.inbox': 'Inbox',
    'messages.sent': 'Sent',
    'messages.trash': 'Trash',
    'messages.delete': 'Delete',
    'messages.markRead': 'Mark as Read',
    'messages.markUnread': 'Mark as Unread',
    'messages.attachments': 'Attachments',
    'messages.noMessages': 'No messages',
    'messages.noMessagesInFolder': 'No messages in this folder',
    'messages.deleteSuccess': 'Message deleted successfully',
    'messages.sender': 'Sender',
    'messages.recipient': 'Recipient',
    'messages.subject': 'Subject',
    'messages.message': 'Message',
    'messages.cancel': 'Cancel',
    'messages.selectRecipient': 'Select recipient',
    'messages.recipientGroup': 'Recipient Group',
    'messages.selectGroup': 'Select group',
    'messages.selectGroupFirst': 'Select a group first',
    'messages.noGroups': 'No groups available',
    'messages.noRecipients': 'No recipients available',
    'messages.failedToLoadRecipients': 'Failed to load recipients',
    'messages.fillAllFields': 'Please fill in all fields',
    'messages.enterSubject': 'Enter subject',
    'messages.enterMessage': 'Enter your message',
    'messages.unreadMessages': 'Unread Messages',
    'messages.newMessage': 'New Message',
    'messages.download': 'Download',
    'messages.unknown': 'Unknown',

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
    'timetable.weeklyTimetable': 'Weekly Timetable',

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
  },

  pl: {
    // Navigation
    'nav.home': 'Dom',
    'nav.timetable': 'Plan lekcji',
    'nav.grades': 'Oceny',
    'nav.absences': 'Nieobecności',
    'nav.exams': 'Egzaminy',
    'nav.announcements': 'Ogłoszenia',
    'nav.messages': 'Wiadomości',
    'nav.settings': 'Ustawienia',

    // Home page
    'home.nextLesson': 'Następna lekcja',
    'home.newGrades': 'Nowe oceny',
    'home.noLessonsToday': 'Brak lekcji na dziś',
    'home.noNewGrades': 'Brak nowych ocen',
    'home.noMoreLessonsToday': 'Brak więcej lekcji na dziś',
    'home.today': 'Dziś',

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
    'settings.roundness': 'Zaokrąglony Design',
    'settings.roundnessDesc': 'Uczyń wszystkie elementy bardziej zaokrąglonymi',
    'settings.profile': 'Profil',
    'settings.preferences': 'Preferencje',

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
    'common.showing': 'Pokazano',
    'common.of': 'z',
    'common.messages': 'wiadomości',
    'common.previous': 'Poprzednia',
    'common.next': 'Następna',
    'common.success': 'Sukces',
    'common.error': 'Błąd',
    'common.warning': 'Ostrzeżenie',
    'common.errorOccurred': 'Wystąpił błąd',
    'common.unknown': 'Nieznany',
    'common.notProvided': 'Nie podano',
    'common.notAssigned': 'Nie przypisano',
    'common.active': 'Aktywny',
    'common.inactive': 'Nieaktywny',
    'common.unknownSubject': 'Nieznany przedmiot',
    'common.unknownTeacher': 'Nieznany nauczyciel',
    'common.unknownAuthor': 'Nieznany autor',
    'common.unknownSender': 'Nieznany nadawca',
    'common.unknownFolder': 'Nieznany folder',
    'common.assignment': 'Zadanie',
    'common.notSpecified': 'Nie określono',
    'common.untitled': 'Bez tytułu',
    'common.noSubject': 'Brak tematu',

    // Grades
    'grades.noGrades': 'Brak dostępnych ocen',
    'grades.gradeHistory': 'Historia ocen',
    'grades.averages': 'Średnie',
    'grades.gradesBySubject': 'Oceny według przedmiotów',

    // Absences
    'absences.noAbsences': 'Brak zarejestrowanych nieobecności',
    'absences.noRecords': 'Brak zarejestrowanych nieobecności.',
    'absences.absenceRecord': 'Rejestr nieobecności',
    'absences.excused': 'Usprawiedliwiona',
    'absences.unexcused': 'Nieusprawiedliwiona',
    'absences.pending': 'Oczekująca',
    'absences.reason': 'Powód',
    'absences.teacher': 'Nauczyciel',

    // Exams
    'exams.noExams': 'Brak zaplanowanych egzaminów.',
    'exams.examSchedule': 'Harmonogram egzaminów',
    'exams.paperSubmission': 'Złożenie pracy',
    'exams.inPersonExam': 'Egzamin osobisty',

    // Announcements
    'announcements.noAnnouncements': 'Brak dostępnych ogłoszeń.',
    'announcements.schoolAnnouncements': 'Ogłoszenia szkolne',

    // Messages
    'messages.inbox': 'Odebrane',
    'messages.sent': 'Wysłane',
    'messages.trash': 'Kosz',
    'messages.delete': 'Usuń',
    'messages.markRead': 'Oznacz jako przeczytane',
    'messages.markUnread': 'Oznacz jako nieprzeczytane',
    'messages.attachments': 'Załączniki',
    'messages.noMessages': 'Brak wiadomości',
    'messages.noMessagesInFolder': 'Brak wiadomości w tym folderze',
    'messages.deleteSuccess': 'Wiadomość została usunięta',
    'messages.sender': 'Nadawca',
    'messages.recipient': 'Odbiorca',
    'messages.subject': 'Temat',
    'messages.message': 'Wiadomość',
    'messages.cancel': 'Anuluj',
    'messages.selectRecipient': 'Wybierz odbiorcę',
    'messages.recipientGroup': 'Grupa odbiorców',
    'messages.selectGroup': 'Wybierz grupę',
    'messages.selectGroupFirst': 'Najpierw wybierz grupę',
    'messages.noGroups': 'Brak dostępnych grup',
    'messages.noRecipients': 'Brak dostępnych odbiorców',
    'messages.failedToLoadRecipients': 'Nie udało się załadować odbiorców',
    'messages.fillAllFields': 'Proszę wypełnić wszystkie pola',
    'messages.enterSubject': 'Wprowadź temat',
    'messages.enterMessage': 'Wprowadź wiadomość',
    'messages.unreadMessages': 'Nieprzeczytane wiadomości',
    'messages.newMessage': 'Nowa wiadomość',
    'messages.download': 'Pobierz',
    'messages.unknown': 'Nieznany',

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
    'timetable.weeklyTimetable': 'Tygodniowy plan lekcji',

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
  },

  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.timetable': 'Расписание',
    'nav.grades': 'Оценки',
    'nav.absences': 'Пропуски',
    'nav.exams': 'Экзамены',
    'nav.announcements': 'Объявления',
    'nav.messages': 'Сообщения',
    'nav.settings': 'Настройки',

    // Home page
    'home.nextLesson': 'Следующий урок',
    'home.newGrades': 'Новые оценки',
    'home.noLessonsToday': 'На сегодня уроков нет',
    'home.noNewGrades': 'Новых оценок нет',
    'home.noMoreLessonsToday': 'Больше уроков на сегодня нет',
    'home.today': 'Сегодня',

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
    'settings.roundness': 'Округлый дизайн',
    'settings.roundnessDesc': 'Сделать все элементы более округлыми и круглыми',
    'settings.profile': 'Профиль',
    'settings.preferences': 'Настройки',

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
    'common.showing': 'Показано',
    'common.of': 'из',
    'common.messages': 'сообщений',
    'common.previous': 'Предыдущая',
    'common.next': 'Следующая',
    'common.success': 'Успех',
    'common.error': 'Ошибка',
    'common.warning': 'Предупреждение',
    'common.errorOccurred': 'Произошла ошибка',
    'common.unknown': 'Неизвестно',
    'common.notProvided': 'Не указано',
    'common.notAssigned': 'Не назначено',
    'common.active': 'Активный',
    'common.inactive': 'Неактивный',
    'common.unknownSubject': 'Неизвестный предмет',
    'common.unknownTeacher': 'Неизвестный учитель',
    'common.unknownAuthor': 'Неизвестный автор',
    'common.unknownSender': 'Неизвестный отправитель',
    'common.unknownFolder': 'Неизвестная папка',
    'common.assignment': 'Задание',
    'common.notSpecified': 'Не указано',
    'common.untitled': 'Без названия',
    'common.noSubject': 'Без темы',

    // Grades
    'grades.noGrades': 'Нет доступных оценок',
    'grades.gradeHistory': 'История оценок',
    'grades.averages': 'Средние',
    'grades.gradesBySubject': 'Оценки по предметам',

    // Absences
    'absences.noAbsences': 'Пропусков не зарегистрировано',
    'absences.noRecords': 'Пропусков не зарегистрировано.',
    'absences.absenceRecord': 'Учет пропусков',
    'absences.excused': 'Оправданный',
    'absences.unexcused': 'Неоправданный',
    'absences.pending': 'В ожидании',
    'absences.reason': 'Причина',
    'absences.teacher': 'Учитель',

    // Exams
    'exams.noExams': 'Экзамены не запланированы.',
    'exams.examSchedule': 'Расписание экзаменов',
    'exams.paperSubmission': 'Сдача работы',
    'exams.inPersonExam': 'Очный экзамен',

    // Announcements
    'announcements.noAnnouncements': 'Нет доступных объявлений.',
    'announcements.schoolAnnouncements': 'Школьные объявления',

    // Messages
    'messages.inbox': 'Входящие',
    'messages.sent': 'Отправленные',
    'messages.trash': 'Корзина',
    'messages.delete': 'Удалить',
    'messages.markRead': 'Отметить как прочитанное',
    'messages.markUnread': 'Отметить как непрочитанное',
    'messages.attachments': 'Вложения',
    'messages.noMessages': 'Нет сообщений',
    'messages.noMessagesInFolder': 'Нет сообщений в этой папке',
    'messages.deleteSuccess': 'Сообщение удалено',
    'messages.sender': 'Отправитель',
    'messages.recipient': 'Получатель',
    'messages.subject': 'Тема',
    'messages.message': 'Сообщение',
    'messages.cancel': 'Отменить',
    'messages.selectRecipient': 'Выберите получателя',
    'messages.recipientGroup': 'Группа получателей',
    'messages.selectGroup': 'Выберите группу',
    'messages.selectGroupFirst': 'Сначала выберите группу',
    'messages.noGroups': 'Нет доступных групп',
    'messages.noRecipients': 'Нет доступных получателей',
    'messages.failedToLoadRecipients': 'Не удалось загрузить получателей',
    'messages.fillAllFields': 'Пожалуйста, заполните все поля',
    'messages.enterSubject': 'Введите тему',
    'messages.enterMessage': 'Введите сообщение',
    'messages.unreadMessages': 'Непрочитанные сообщения',
    'messages.newMessage': 'Новое сообщение',
    'messages.download': 'Скачать',
    'messages.unknown': 'Неизвестно',

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
    'timetable.weeklyTimetable': 'Недельное расписание',

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
  },

  ua: {
    // Navigation
    'nav.home': 'Головна',
    'nav.timetable': 'Розклад',
    'nav.grades': 'Оцінки',
    'nav.absences': 'Пропуски',
    'nav.exams': 'Іспити',
    'nav.announcements': 'Оголошення',
    'nav.messages': 'Повідомлення',
    'nav.settings': 'Налаштування',

    // Home page
    'home.nextLesson': 'Наступний урок',
    'home.newGrades': 'Нові оцінки',
    'home.noLessonsToday': 'На сьогодні уроків немає',
    'home.noNewGrades': 'Нових оцінок немає',
    'home.noMoreLessonsToday': 'Більше уроків на сьогодні немає',
    'home.today': 'Сьогодні',

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
    'settings.roundness': 'Округлий дизайн',
    'settings.roundnessDesc': 'Зробити всі елементи більш округлими та круглими',
    'settings.profile': 'Профіль',
    'settings.preferences': 'Налаштування',

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
    'common.showing': 'Показано',
    'common.of': 'з',
    'common.messages': 'повідомлень',
    'common.previous': 'Попередня',
    'common.next': 'Наступна',
    'common.success': 'Успіх',
    'common.error': 'Помилка',
    'common.warning': 'Попередження',
    'common.errorOccurred': 'Сталася помилка',
    'common.unknown': 'Невідомо',
    'common.notProvided': 'Не вказано',
    'common.notAssigned': 'Не призначено',
    'common.active': 'Активний',
    'common.inactive': 'Неактивний',
    'common.unknownSubject': 'Невідомий предмет',
    'common.unknownTeacher': 'Невідомий вчитель',
    'common.unknownAuthor': 'Невідомий автор',
    'common.unknownSender': 'Невідомий відправник',
    'common.unknownFolder': 'Невідома папка',
    'common.assignment': 'Завдання',
    'common.notSpecified': 'Не вказано',
    'common.untitled': 'Без назви',
    'common.noSubject': 'Без теми',

    // Grades
    'grades.noGrades': 'Немає доступних оцінок',
    'grades.gradeHistory': 'Історія оцінок',
    'grades.averages': 'Середні',
    'grades.gradesBySubject': 'Оцінки за предметами',

    // Absences
    'absences.noAbsences': 'Пропусків не зареєстровано',
    'absences.noRecords': 'Пропусків не зареєстровано.',
    'absences.absenceRecord': 'Облік пропусків',
    'absences.excused': 'Поважний',
    'absences.unexcused': 'Неpoважний',
    'absences.pending': 'В очікуванні',
    'absences.reason': 'Причина',
    'absences.teacher': 'Вчитель',

    // Exams
    'exams.noExams': 'Іспити не заплановані.',
    'exams.examSchedule': 'Розклад іспитів',
    'exams.paperSubmission': 'Здача роботи',
    'exams.inPersonExam': 'Очний іспит',

    // Announcements
    'announcements.noAnnouncements': 'Немає доступних оголошень.',
    'announcements.schoolAnnouncements': 'Шкільні оголошення',

    // Messages
    'messages.inbox': 'Вхідні',
    'messages.sent': 'Надіслані',
    'messages.trash': 'Кошик',
    'messages.delete': 'Видалити',
    'messages.markRead': 'Позначити як прочитане',
    'messages.markUnread': 'Позначити як непрочитане',
    'messages.attachments': 'Прикріплення',
    'messages.noMessages': 'Немає повідомлень',
    'messages.noMessagesInFolder': 'Немає повідомлень у цій папці',
    'messages.deleteSuccess': 'Повідомлення видалено',
    'messages.sender': 'Відправник',
    'messages.recipient': 'Одержувач',
    'messages.subject': 'Тема',
    'messages.message': 'Повідомлення',
    'messages.cancel': 'Скасувати',
    'messages.selectRecipient': 'Оберіть одержувача',
    'messages.recipientGroup': 'Група одержувачів',
    'messages.selectGroup': 'Оберіть групу',
    'messages.selectGroupFirst': 'Спочатку оберіть групу',
    'messages.noGroups': 'Немає доступних груп',
    'messages.noRecipients': 'Немає доступних одержувачів',
    'messages.failedToLoadRecipients': 'Не вдалося завантажити одержувачів',
    'messages.fillAllFields': 'Будь ласка, заповніть усі поля',
    'messages.enterSubject': 'Введіть тему',
    'messages.enterMessage': 'Введіть повідомлення',
    'messages.unreadMessages': 'Непрочитані повідомлення',
    'messages.newMessage': 'Нове повідомлення',
    'messages.download': 'Завантажити',
    'messages.unknown': 'Невідомо',

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
    'timetable.weeklyTimetable': 'Тижневий розклад',

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
  },
};

export function LanguageProvider({ children }: Readonly<{ children: React.ReactNode }>) {
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

  const contextValue = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={contextValue}>
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
