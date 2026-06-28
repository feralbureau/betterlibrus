# betterlibrus 📚
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC)](https://tailwindcss.com/)

> ⚠️ This project is still in development and has not been extensively tested due to limited access to real-world data. If you encounter any issues, please open an issue.

### 🌟 **Features**
- Timetables
- Grades 
- Attendance
- Homework
- Announcements

## Live Demo

**🔗 [Visit betterlibrus.vercel.app](https://betterlibrus.vercel.app/)**
**🌲 To install on Android, [visit this link](https://relibrus.vercel.app/) and select "Install" when prompted**


## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 15.5.9 |
| **React / React DOM** | UI library | 18.3.1 |
| **TypeScript** | Type Safety | ^5 |
| **Tailwind CSS** | Styling | 3.4.1 |
| **librus-api** | Librus Synergia client | 2.1.0 |
| **lucide-react** | Icons | 0.475.0 |
| **recharts** | Charts | 2.15.1 |
| **zod** | Validation | 3.24.2 |

## Quick Start

### Prerequisites
- Node.js 16.x or later  
- npm, bun or yarn 

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/0xhkamori/betterlibrus.git
   cd betterlibrus
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start dev server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**  
   Navigate to [http://localhost:9002](http://localhost:9002) (default dev server port)

## Project Structure
```
betterlibrus/
├── src/
│   ├── app/               # Next.js App Router pages & layouts
│   ├── components/        # Reusable UI components (ui/, student-hub/, auth/)
│   ├── lib/               # API client, utils and types
│   └── hooks/             # Custom React hooks
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Next.js with Turbopack) on port 9002 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Show your support
Give a ⭐️ if this project helped you!

## Contact
- **Telegram**: [@astredic](https://astredic.t.me/)  
- **Issues**: [GitHub Issues](https://github.com/0xhkamori/betterlibrus/issues)  

---
**❤️ Made for the student community**
