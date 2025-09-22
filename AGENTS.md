# BetterLibrus - Agents Documentation 🤖

This document provides a comprehensive overview of the BetterLibrus project architecture, components, and implementation details for AI agents and developers.

## 🏗️ Project Architecture

### Tech Stack
- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript 5+
- **UI Library**: React 18.3.1 with Radix UI components
- **Styling**: Tailwind CSS 3.4.1
- **API Integration**: librus-api 2.14.0
- **Mobile**: Capacitor 7.4.3 (Android support)
- **Package Manager**: Yarn 1.22.22

### Core Dependencies
```json
{
  "librus-api": "^2.14.0",      // Librus Synergia API client
  "firebase": "^11.9.1",        // Firebase integration
  "lucide-react": "^0.475.0",   // Icon library
  "recharts": "^2.15.1",        // Charts and data visualization
  "zod": "^3.24.2",             // Runtime type validation
  "date-fns": "^3.6.0",         // Date utilities
  "next-pwa": "^5.6.0"          // Progressive Web App features
}
```

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Main student hub page
│   ├── login/               # Authentication pages
│   └── signup/
├── components/              # React components
│   ├── auth/                # Authentication components
│   ├── student-hub/         # Main application components
│   │   ├── views/           # View components for each section
│   │   └── *.tsx            # Shared hub components
│   └── ui/                  # Reusable UI components (Radix-based)
├── contexts/                # React Context providers
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and API clients
└── pages/api/               # Next.js API routes
```

## 🔧 Core Components

### 1. Authentication System (`src/hooks/use-auth.tsx`)
- **Purpose**: Manages user authentication state
- **Features**:
  - Cookie-based session management
  - Librus API integration
  - Protected route handling
  - Automatic session validation

```typescript
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
}
```

### 2. Student Hub (`src/components/student-hub/StudentHub.tsx`)
- **Purpose**: Main application container
- **Features**:
  - View routing (Home, Timetable, Grades, etc.)
  - Bottom navigation
  - Detail sheet modal
  - State management for selected items

### 3. API Integration (`src/lib/api.ts`)
- **Purpose**: Data fetching and transformation
- **Endpoints**:
  - `getTimetable()` - Fetches and transforms schedule data
  - `getGrades()` - Retrieves and processes grade information
  - `getAbsences()` - Manages absence records
  - `getExams()` - Handles exam scheduling
  - `getAnnouncements()` - Fetches school announcements

### 4. Type System (`src/lib/types.ts`)
- **Core Types**:
  - `Lesson` - Timetable entries
  - `Grade` & `SubjectGrade` - Academic performance data
  - `Absence` - Attendance records
  - `Exam` - Examination scheduling
  - `Announcement` - School communications
  - `DetailItem` - Union type for sheet modal content

## 🌐 Context Providers

### 1. Language Context (`src/contexts/LanguageContext.tsx`)
- **Languages**: English, Polish, Russian, Ukrainian
- **Features**: 400+ translation keys, localStorage persistence
- **Usage**: `const { t, language, setLanguage } = useLanguage()`

### 2. Font Context (`src/contexts/FontContext.tsx`)
- **Fonts**: Inter, Manrope, Poppins, System UI, Open Sans, Source Serif Pro
- **Features**: Google Fonts integration, dynamic loading
- **Usage**: `const { selectedFont, setSelectedFont } = useFont()`

### 3. Privacy Context (`src/contexts/PrivacyContext.tsx`)
- **Purpose**: Anonymizes personal data for screen sharing
- **Features**: Name anonymization, toggle functionality
- **Usage**: `const { anonymizeName, isPrivacyMode } = usePrivacy()`

### 4. Roundness Context (`src/contexts/RoundnessContext.tsx`)
- **Purpose**: UI design customization
- **Features**: Toggle between sharp and rounded design elements

## 🔌 API Routes (`src/pages/api/`)

### Authentication
- `POST /api/login` - User authentication with Librus credentials
- `POST /api/logout` - Session termination
- `GET /api/user` - Session validation and user info

### Data Endpoints
- `GET /api/timetable` - Weekly schedule data
- `GET /api/grades` - Academic performance records
- `GET /api/absences` - Attendance tracking
- `GET /api/exams` - Examination schedule
- `GET /api/announcements` - School communications

### API Implementation Pattern
```typescript
export async function getAuthenticatedClient(req: NextApiRequest) {
  const cookie = req.cookies["auth-credentials"];
  if (!cookie) return null;
  
  const { username, password } = JSON.parse(cookie);
  const client = new Librus();
  await client.authorize(username, password);
  return client;
}
```

## 📱 Views and Navigation

### View Components (`src/components/student-hub/views/`)
1. **HomeView** - Dashboard with next lesson, new grades, today's schedule
2. **TimetableView** - Weekly schedule with day-by-day breakdown
3. **GradesView** - Academic performance with subject averages
4. **AbsencesView** - Attendance records and status tracking
5. **ExamsView** - Upcoming examinations and deadlines
6. **AnnouncementsView** - School communications and notices
7. **SettingsView** - User preferences and customization

### Navigation Structure
- **Header**: Title and navigation controls
- **BottomNav**: 7 main sections with icons
- **DetailsSheet**: Modal for detailed item information

## 🎨 UI System

### Design System
- **Base**: Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Theme**: Dark mode optimized
- **Icons**: Lucide React icon library
- **Responsive**: Mobile-first approach

### Key UI Components
- `Card`, `Button`, `Sheet`, `Dialog` - Layout and interaction
- `Skeleton` - Loading states
- `Toast` - Notifications
- `Tabs`, `Accordion` - Content organization

## 📊 Data Flow

### 1. Authentication Flow
```
Login Form → /api/login → Librus API → Cookie Storage → Protected Routes
```

### 2. Data Fetching Flow
```
Component Mount → API Call → Librus Client → Data Transform → State Update → UI Render
```

### 3. Navigation Flow
```
User Action → View State Change → Component Re-render → New Data Fetch (if needed)
```

## 🔒 Security Considerations

### Authentication
- HTTP-only cookies for credential storage
- Secure cookie flags in production
- Session validation on protected routes
- Automatic logout on authentication failures

### Data Protection
- Privacy mode for sensitive information
- Client-side data anonymization
- Secure API endpoint access

## 📱 Mobile Support

### Capacitor Integration
- Android build support
- Native mobile features
- PWA capabilities
- Offline functionality preparation

### Build Commands
```bash
yarn build:android    # Build for Android
yarn cap:sync         # Sync with Capacitor
yarn cap:open:android # Open in Android Studio
```

## 🧪 Development Workflow

### Key Scripts
```bash
yarn dev              # Development server (port 9002)
yarn build            # Production build
yarn typecheck        # TypeScript validation
yarn lint             # ESLint checking
```

### Development Patterns
- **Component Structure**: Functional components with hooks
- **State Management**: React Context + useState/useEffect
- **Error Handling**: Try-catch with user-friendly messages
- **Loading States**: Skeleton components for better UX
- **Type Safety**: Strict TypeScript configuration

## 🚀 Deployment Considerations

### Environment Variables
- `NODE_ENV` - Environment detection
- Firebase configuration (if used)
- API endpoints and secrets

### Build Optimization
- Next.js automatic optimization
- Turbopack for faster development
- Tree shaking and code splitting
- PWA manifest and service worker

## 🔧 Customization Points

### For AI Agents
1. **API Extension**: Add new endpoints in `src/pages/api/`
2. **Component Creation**: Extend views in `src/components/student-hub/views/`
3. **Type Definitions**: Extend types in `src/lib/types.ts`
4. **Context Providers**: Add new contexts for global state
5. **UI Components**: Create custom components in `src/components/ui/`

### Configuration Files
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Styling configuration
- `next.config.ts` - Next.js build configuration
- `components.json` - UI component configuration

## 📈 Performance Optimizations

### Implemented
- React 18 features (Suspense, Concurrent features)
- Next.js automatic optimizations
- Lazy loading for components
- Efficient re-rendering with proper dependencies
- Image optimization for icons and assets

### Monitoring
- Client-side error handling
- Loading state management
- Network request optimization
- Memory leak prevention

---

## 🤝 Contributing Guidelines

### Code Style
- TypeScript strict mode
- Functional components with hooks
- Consistent naming conventions
- Comprehensive type annotations

### Testing Strategy
- Component testing (recommended)
- API endpoint testing
- User flow testing
- Accessibility testing

### Documentation
- JSDoc for complex functions
- README updates for new features
- Type documentation for public APIs
- Architecture decision records

---

*This document serves as a comprehensive guide for AI agents and developers working with the BetterLibrus codebase. For specific implementation details, refer to the individual component files and their inline documentation.*
