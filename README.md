# DevPath AI - Frontend# DevPath AI Frontend

A Next.js-powered frontend application for DevPath AI, an intelligent career development platform that analyzes GitHub profiles, generates personalized learning paths, and provides job market insights.> AI-powered developer career analytics platform with stateful authentication, persistent reports, and intelligent career insights.

## 🚀 Features**Built with Next.js 15 · TypeScript · Tailwind CSS · Framer Motion**

### Core Functionality---

- **GitHub Profile Analysis**: Deep analysis of repositories, languages, contributions, and project complexity

- **Career Track Generation**: AI-powered personalized learning paths based on current skills and target domains## Overview

- **Market Match Analysis**: Gap analysis comparing your skills against target job profiles

- **Report Management**: Persistent analysis reports with history tracking (last 3 reports)DevPath AI analyzes your GitHub profile to provide personalized career insights, skill assessments, and growth recommendations. The platform features a refined black and white aesthetic with seamless authentication, persistent report storage, and intelligent caching.

- **Auto-Load Latest Report**: Automatically loads your most recent analysis on login

- **Re-Analyze Anytime**: Refresh your analysis with the latest GitHub data### Key Features

### User Experience- **GitHub OAuth Authentication** - Secure, token-based login with persistent sessions

- **Smart Landing Page**: Automatically redirects logged-in users to dashboard- **Automatic Report Loading** - Latest analysis loads on dashboard mount (no re-analysis needed)

- **Persistent Authentication**: JWT-based auth that survives page refreshes- **Report History Management** - View, load, and delete up to 3 saved analyses

- **GitHub Username Display**: Shows your GitHub username in the navigation bar- **Smart Landing Page** - Auto-redirects authenticated users to dashboard

- **Analysis Date Tracking**: View when your last analysis was performed- **Real-time Analysis Dates** - See when each analysis was performed

- **Report History**: View, load, and delete your analysis history- **GitHub Profile Display** - Username shown in navbar when logged in

- **Responsive Design**: Fully responsive UI built with Tailwind CSS- **Responsive Design** - Mobile-first UI that works on all devices

- **Smooth Animations**: Enhanced user experience with Framer Motion

---

## 🛠️ Tech Stack

## Core Modules

- **Framework**: Next.js 15.0.0 with App Router

- **React**: 19.0.0### 1. GitHub Profile Analysis

- **TypeScript**: 5.6.2 with strict mode

- **Styling**: Tailwind CSS 3.4.13**Comprehensive repository analysis powered by Gemini AI**

- **Animations**: Framer Motion 11.5.4

- **State Management**: Zustand 4.5.5 with persist middleware- **Developer Archetype Detection** - Builder, Refiner, or Maintainer

- **Notifications**: React Hot Toast 2.4.1- **Skill Constellation** - Auto-extracted from 60+ recognized technologies

- **Icons**: Lucide React 0.441.0- **Flagship Projects** - Top 1-3 projects identified by AI

- **Additional Libraries**:- **Code Quality Analysis** - AI-powered review of selected code samples

  - `react-markdown` 9.0.1 - Markdown rendering- **Career Path Suggestions** - 3 personalized career paths with skills to develop

  - `prism-react-renderer` 2.4.0 - Code syntax highlighting- **Project Ideas** - 3 AI-generated project recommendations

  - `recharts` 2.12.7 - Data visualization

  - `clsx` 2.1.1 & `tailwind-merge` 2.5.2 - Class name utilities**Processing:** 30-60 seconds · **Rate Limit:** 5 per hour

  - `class-variance-authority` 0.7.0 - Component variants

### 2. Career Track Generator

## 📁 Project Structure

**Personalized learning roadmap from current skills to target domain**

```

devpath-ai-frontend/- **Input:** Current skills + Target domain (e.g., "Machine Learning")

├── src/- **Output:** 3-step learning path

│   ├── app/  1. **Learning Step** - Foundational knowledge to acquire

│   │   ├── auth/  2. **Bridge Project** - Intermediate project to apply concepts

│   │   │   └── page.tsx          # GitHub OAuth callback handler (AuthPage)  3. **Capstone Project** - Advanced project demonstrating mastery

│   │   ├── dashboard/- **Includes:** Tech stack recommendations and feature breakdowns

│   │   │   └── page.tsx          # Main application dashboard (DashboardPage)

│   │   ├── explore/**Rate Limit:** 10 per hour

│   │   │   └── page.tsx          # Features showcase (ExplorePage)

│   │   ├── page.tsx              # Landing page (HomePage)### 3. Market Match Analysis

│   │   ├── layout.tsx            # Root layout with metadata

│   │   └── globals.css           # Global styles**Gap analysis comparing your skills to job requirements**

│   ├── components/

│   │   └── dashboard/- **20 Pre-configured Job Roles:**

│   │       ├── AnalysisSection.tsx      # Profile analysis display  - Data Engineer, ML Engineer, Senior React Developer

│   │       ├── CareerTrackSection.tsx   # Career track generator  - Senior Python Backend Developer, DevOps Engineer

│   │       └── MarketMatchSection.tsx   # Job skills gap analysis  - Generative AI Specialist, Cloud Solutions Architect

│   ├── lib/  - Security Engineer, Mobile App Developer

│   │   ├── api.ts                # API client with JWT injection  - AI Product Engineer, Data Scientist

│   │   └── utils.ts              # Utility functions (cn helper)  - Full Stack Engineer, Site Reliability Engineer (SRE)

│   ├── store/  - AI Infrastructure Engineer, Data Platform Engineer

│   │   └── auth.ts               # Authentication state management (Zustand)  - Blockchain Developer, Computer Vision Engineer

│   └── types/  - AI Prompt Engineer, Automation Engineer

│       └── api.ts                # TypeScript interfaces for API v3.0.0  - Embedded Systems Engineer

├── public/                        # Static assets

├── api_documentation.md           # Backend API reference**Output:** Matching skills, missing skills, and AI-generated summary

├── tailwind.config.ts             # Tailwind configuration

├── tsconfig.json                  # TypeScript configuration (strict mode)**Rate Limit:** 20 per hour

├── next.config.mjs                # Next.js configuration

├── postcss.config.mjs             # PostCSS configuration---

├── next-env.d.ts                  # Next.js type declarations

└── package.json                   # Dependencies and scripts## Tech Stack

```

| Category | Technology |

## 🗺️ Routes| ----------------- | --------------------------------------- |

| **Framework** | Next.js 15.5.6 (App Router) |

### Public Routes| **Language** | TypeScript (strict mode) |

- **`/`** (HomePage) - Landing page with smart routing| **Styling** | Tailwind CSS 3.x |

  - Checks for JWT token in auth store| **Animations** | Framer Motion 11.x |

  - Redirects to `/dashboard` if authenticated| **State** | Zustand (with persist middleware) |

  - Redirects to `/auth` if not authenticated| **HTTP Client** | Custom fetch wrapper with JWT injection |

  - Features: Hero section with "Get Started" CTA| **Icons** | Lucide React |

| **Notifications** | React Hot Toast |

- **`/explore`** (ExplorePage) - Features showcase and platform capabilities| **Backend** | FastAPI (Python) - v3.0.0 |

  - Public information page

  - Describes platform features---

### Protected Routes## Quick Start

- **`/auth`** (AuthPage) - GitHub OAuth callback handler

  - Receives OAuth code from GitHub### Prerequisites

  - Exchanges code for JWT token via backend

  - Stores JWT in Zustand auth store- **Node.js** 18+ (with npm)

  - Redirects to `/dashboard` on success- **DevPath AI Backend** running at `http://localhost:8000`

  - Includes manual token input for advanced users- **GitHub OAuth App** configured (client ID required)

  - Uses Suspense boundary for useSearchParams()

### Installation

- **`/dashboard`** (DashboardPage) - Main application dashboard

  - **Requires JWT authentication**```powershell

  - Auto-loads latest report on mount# Clone repository

  - Displays GitHub username in navbargit clone https://github.com/ANIMANxd/devpath-ai-frontend.git

  - Shows analysis date with re-analyze buttoncd devpath-ai-frontend

  - **4 Tabs:**

    1. **Analysis**: Full GitHub profile analysis display# Install dependencies

    2. **Career Track**: Generate personalized learning pathsnpm install

    3. **Market Match**: Analyze skills gap for job titles

    4. **History**: Manage analysis reports (view/load/delete last 3 reports)# Create environment file

cp .env.local.example .env.local

## 🔌 API Integration```

The frontend communicates with the FastAPI backend (v3.0.0) using JWT authentication.### Environment Variables

### API Client ArchitectureCreate `.env.local` in project root:

All API calls go through the `ApiClient` class defined in `src/lib/api.ts`:```env

NEXT_PUBLIC_API_BASE=http://localhost:8000

````typescriptNEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here

class ApiClient {```

  private baseUrl: string = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

  **Getting GitHub Client ID:**

  // Automatically injects JWT from Zustand auth store

  // Handles 401 responses with auto-logout1. Go to GitHub → Settings → Developer settings → OAuth Apps

  // Handles 204 No Content responses2. Create new OAuth App

}3. Set Authorization callback URL: `http://localhost:3000/auth`

```4. Copy Client ID



### Available API Methods### Run Development Server



```typescript```powershell

// Health checknpm run dev

apiClient.healthCheck()```

→ GET /

→ Returns: { message: string }Open [http://localhost:3000](http://localhost:3000)



// Full GitHub profile analysis### Build for Production

apiClient.analyze()

→ POST /analyze```powershell

→ Requires: JWT authenticationnpm run build

→ Returns: FullReportnpm start

→ Processing: 30-60 seconds```



// Get report history---

apiClient.getReportHistory()

→ GET /reports/## Usage Guide

→ Requires: JWT authentication

→ Returns: ReportHistoryItem[] (up to 3 most recent)### First-Time Login



// Get specific report1. **Click "Get Started"** on landing page

apiClient.getReport(reportId: number)2. **Authorize with GitHub OAuth** (redirects to GitHub)

→ GET /reports/{id}3. **Return to dashboard** - JWT token stored automatically

→ Requires: JWT authentication4. **No saved reports** - Click "Start Full Analysis"

→ Returns: FullReport5. **Wait 30-60 seconds** - AI analyzes your GitHub profile

6. **Report auto-saved** - Now available in History tab

// Delete report

apiClient.deleteReport(reportId: number)### Returning User Experience

→ DELETE /reports/{id}

→ Requires: JWT authentication1. **Click "Get Started"** on landing page

→ Returns: void (204 No Content)2. **Auto-redirect to dashboard** - Already authenticated (JWT persisted)

3. **Latest report auto-loads** - No re-analysis needed

// Generate career track4. **See analysis date** - Shows when report was created

apiClient.generateTrack(request: CareerTrackRequest)5. **Optional: Re-analyze** - Click "Re-analyze" button for fresh data

→ POST /generate-track

→ Requires: JWT authentication### Managing Report History

→ Returns: CareerTrack

**View History:**

// Market match analysis

apiClient.marketMatch(request: MarketMatchRequest)- Go to **History** tab in dashboard

→ POST /market-match- See up to 3 most recent analyses

→ Requires: JWT authentication- Each shows: Report ID, creation date, current status

→ Returns: GapAnalysis

```**Load Past Report:**



### Authentication Flow- Click **Load** button on any report

- Report opens in Analysis tab

1. User clicks "Get Started" on landing page (`/`)- Date updates to show report age

2. Smart routing checks for JWT in Zustand auth store

3. If no JWT, redirect to `/auth`**Delete Report:**

4. User clicks "Login with GitHub" → redirects to GitHub OAuth

5. GitHub redirects back to `/auth?code=xxx`- Click **Delete** button (with confirmation)

6. Frontend calls backend: `POST /auth/github/callback` with OAuth code- Report removed from history

7. Backend returns JWT access token- If current report deleted, clears dashboard

8. Frontend stores JWT in Zustand with localStorage persistence

9. Redirects to `/dashboard`**Re-analyze:**

10. All subsequent API calls automatically include `Authorization: Bearer {token}` header

- Click **Re-analyze** button in Analysis tab

### JWT Auto-Injection- New report generated and auto-saved

- Old reports remain accessible in history

The `ApiClient` automatically:

- Reads JWT from `useAuthStore().jwtToken`### Generating Career Track

- Adds `Authorization: Bearer {token}` header to all authenticated requests

- Handles 401 responses by calling `clearJwtToken()` and redirecting to `/`1. Navigate to **Career Track** tab

- Handles 204 No Content responses by returning `undefined`2. Select current skills (multi-select)

- Throws typed `ApiError` for error responses3. Enter target domain (e.g., "Frontend with React")

4. Click **Generate Career Track**

### Username Extraction5. Review 3-step roadmap:

   - Learning Step

GitHub username is extracted from repository names in the analysis data:   - Bridge Project

1. Checks `project_hubs` array for repos in format `username/repo-name`   - Capstone Project

2. Falls back to `flagship_projects` array if no username found

3. Extracts username before the `/` character### Market Match Analysis

4. Stores in Zustand: `setGithubUsername(username)`

5. Persists across page refreshes via localStorage1. Navigate to **Market Match** tab

2. Select your skills (multi-select)

## ⚙️ Environment Variables3. Choose target job title (dropdown with 20 roles)

4. Click **Analyze Market Fit**

Create a `.env.local` file in the root directory:5. View results:

   - Matching skills (green badges)

```env   - Missing skills (red badges)

# Backend API URL (default: http://localhost:8000)   - AI-generated summary

NEXT_PUBLIC_API_BASE=http://localhost:8000

---

# GitHub OAuth Configuration

NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id## Project Structure

````

````

### Getting GitHub Client IDdevpath-ai-frontend/

├── src/

1. Go to GitHub → Settings → Developer settings → OAuth Apps│   ├── app/                          # Next.js 15 App Router

2. Create new OAuth App│   │   ├── page.tsx                  # Landing page (smart CTA routing)

3. Set Authorization callback URL: `http://localhost:8000/auth/github/callback` (backend URL)│   │   ├── layout.tsx                # Root layout with Toaster

4. Copy Client ID and paste in `.env.local`│   │   ├── globals.css               # Global styles + utilities

│   │   ├── auth/

## 🚀 Getting Started│   │   │   └── page.tsx             # OAuth callback handler

│   │   ├── dashboard/

### Prerequisites│   │   │   └── page.tsx             # Main dashboard (4 tabs)

- Node.js 18+ or 20+│   │   └── explore/

- npm, yarn, or pnpm│   │       └── page.tsx             # Features showcase

- Backend API running on `http://localhost:8000` (or configured URL)│   ├── components/

- GitHub OAuth App configured│   │   └── dashboard/

│   │       ├── AnalysisSection.tsx   # GitHub profile analysis

### Installation│   │       ├── CareerTrackSection.tsx # Learning roadmap generator

│   │       └── MarketMatchSection.tsx # Job skills gap analysis

1. **Clone the repository**│   ├── lib/

   ```powershell│   │   ├── api.ts                    # API client with JWT injection

   git clone <repository-url>│   │   └── utils.ts                  # cn() utility for Tailwind

   cd devpath-ai-frontend│   ├── store/

   ```│   │   └── auth.ts                   # Zustand store (JWT + username)

│   └── types/

2. **Install dependencies**│       └── api.ts                    # TypeScript interfaces (v3.0.0)

   ```powershell├── public/                           # Static assets

   npm install├── api_documentation.md              # Backend API reference

   ```├── package.json

├── tsconfig.json

3. **Set up environment variables**├── tailwind.config.ts

   ```powershell├── next.config.mjs

   # Create .env.local file├── postcss.config.mjs

   echo "NEXT_PUBLIC_API_BASE=http://localhost:8000" > .env.local└── README.md

   echo "NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id" >> .env.local```

````

---

4. **Run the development server**

   ```````powershell## Authentication Flow

   npm run dev

   ``````mermaid
   ```````

sequenceDiagram

5. **Open in browser** participant User

   Navigate to [http://localhost:3000](http://localhost:3000) participant Frontend

   participant GitHub

### Available Scripts participant Backend

    participant Database

````powershell

npm run dev          # Start development server (port 3000)    User->>Frontend: Click "Get Started"

npm run build        # Build production bundle    Frontend->>Frontend: Check JWT token

npm start            # Start production server    alt Token exists

npm run lint         # Run ESLint        Frontend->>User: Redirect to /dashboard

```    else No token

        Frontend->>User: Redirect to /auth

## 🏗️ Build for Production        User->>Frontend: Click "Login with GitHub"

        Frontend->>GitHub: OAuth authorize request

```powershell        GitHub->>User: Authorization prompt

npm run build        User->>GitHub: Approve

npm start        GitHub->>Frontend: Redirect with code

```        Frontend->>Backend: POST /auth/github/callback?code=xxx

        Backend->>GitHub: Exchange code for token

The application will be optimized for production with:        GitHub->>Backend: GitHub access token

- Static page generation where possible        Backend->>Database: Store encrypted token + user

- Optimized JavaScript bundles        Backend->>Frontend: Return JWT token

- Automatic code splitting        Frontend->>Frontend: Store JWT in Zustand

- Image optimization        Frontend->>User: Redirect to /dashboard

    end

## 🔒 Authentication```



### JWT Token Management---

- Tokens stored in localStorage via Zustand persist middleware

- Storage key: `auth-storage`## API Integration

- Automatic token injection in API requests via `ApiClient` class

- Auto-logout on 401 responses### Endpoints Used

- Manual token input available in `/auth` page for advanced users

| Endpoint                | Method | Auth | Purpose                       |

### Username Display| ----------------------- | ------ | ---- | ----------------------------- |

- Extracted from GitHub repository names in format `username/repo-name`| `/auth/github/callback` | GET    | No   | Exchange OAuth code for JWT   |

- Extraction logic:| `/analyze`              | POST   | Yes  | Full GitHub profile analysis  |

  1. Loops through `project_hubs` array in analysis data| `/generate-track`       | POST   | Yes  | Generate career roadmap       |

  2. Falls back to `flagship_projects` array| `/market-match`         | POST   | Yes  | Job skills gap analysis       |

  3. Splits on `/` and takes first part| `/reports/`             | GET    | Yes  | List analysis history (max 3) |

- Stored in Zustand: `githubUsername` field| `/reports/{id}`         | GET    | Yes  | Retrieve specific report      |

- Displayed in navigation bar across all pages| `/reports/{id}`         | DELETE | Yes  | Delete report                 |

- Persists across page refreshes via localStorage

### Rate Limits

## 🎨 Dashboard Components

- **Analysis**: 5 per hour per user

### Analysis Section (`src/components/dashboard/AnalysisSection.tsx`)- **Career Track**: 10 per hour per user

Displays comprehensive GitHub profile analysis:- **Market Match**: 20 per hour per user

- Project hubs and flagship projects

- Languages and technologies used### Error Handling

- Total contributions and active months

- Skill proficiency mapping| Status | Meaning      | Frontend Action                             |

- Re-analyze button with date tracking| ------ | ------------ | ------------------------------------------- |

| 200    | Success      | Display result                              |

### Career Track Section (`src/components/dashboard/CareerTrackSection.tsx`)| 204    | No Content   | Return undefined (delete success)           |

Personalized learning path generator:| 401    | Unauthorized | Clear JWT, redirect to /auth                |

- Input current skills (multi-select)| 404    | Not Found    | Show "No repos found" or "Report not found" |

- Enter target domain| 429    | Rate Limited | Show "Try again in X minutes"               |

- AI-generated step-by-step learning path| 500    | Server Error | Show "Something went wrong"                 |

- Suggested projects and resources

---

### Market Match Section (`src/components/dashboard/MarketMatchSection.tsx`)

Job market gap analysis:## Customization

- Input current skills (multi-select)

- Select target job title (dropdown)### Design System

- Skills gap identification

- Recommendations for improvement**Colors** (edit `src/app/globals.css`):



## 🐛 Troubleshooting```css

/* Current: Black & White with opacity */

### Token not persisting across refreshesborder-white/20  /* Subtle borders */

**Cause**: Browser localStorage not accessible or Zustand persist middleware not configuredbg-white/5       /* Light backgrounds */

text-white/60    /* Muted text */

**Solution**:```

- Check browser localStorage for `auth-storage` key

- Open DevTools → Application → Local Storage → `http://localhost:3000`**Animations** (edit `tailwind.config.ts`):

- Verify `auth-storage` key exists with `jwtToken` value

- Check that `src/store/auth.ts` has `persist` middleware configured```typescript

animation: {

### API calls failing  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',

**Cause**: Backend not running or misconfigured API base URL}

````

**Solution**:

- Verify backend is running: `curl http://localhost:8000/` (should return health check)**Typography**:

- Check `.env.local` has correct `NEXT_PUBLIC_API_BASE`

- Open DevTools → Network tab → Check API request URLs- Primary: System font stack

- Look for CORS errors in console- Monospace: `mono` class (SF Mono, Consolas, etc.)

### Username not displaying### Backend URL

**Cause**: No analysis performed yet or username extraction failed

Update `.env.local`:

**Solution**:

- Ensure at least one analysis has been completed```env

- Check that repositories have format `username/repo-name`NEXT_PUBLIC_API_BASE=https://your-api-domain.com

- Open DevTools → Console → Look for "Extracted username from..." logs```

- Verify `githubUsername` in localStorage: `localStorage.getItem('auth-storage')`

---

### 401 Unauthorized errors

**Cause**: JWT token expired or invalid## Troubleshooting

**Solution**:### Issue: "Please authenticate first" on dashboard

- JWT auto-logout should clear token and redirect to `/`

- Re-login via GitHub OAuth**Cause:** JWT token expired or cleared

- Check backend logs for token validation errors**Solution:**

### Dashboard not loading latest report1. Check localStorage: `localStorage.getItem('devpath-auth')`

**Cause**: No reports in history or backend error2. If null, re-login via OAuth

3. JWT tokens expire after 7 days

**Solution**:

- Check Network tab for `/reports/` request### Issue: Username not showing in navbar

- Verify response contains array of reports

- Check console for errors in `loadReportHistory()` function**Cause:** No analysis reports yet

- Ensure backend has report persistence enabled**Solution:**

## 📝 Development Notes1. Run your first analysis

2. Username extracted from repo names (format: `username/repo-name`)

- Built with **Next.js App Router** (not Pages Router)3. Should appear after first successful analysis

- Uses **React 19** features

- Client components marked with `'use client'` directive### Issue: "Failed to load report history"

- Server Components used where possible for performance

- Path aliases configured: `@/*` → `src/*` (in `tsconfig.json`)**Cause:** Backend not running or network error

- TypeScript **strict mode** enabled**Solution:**

- Target: **ES2020** with modern JavaScript features

- ESLint configured for Next.js best practices```powershell

# Test backend connection

## 🔗 Related Documentationcurl http://localhost:8000/health

````

- **API Documentation**: See `api_documentation.md` for detailed backend API specs (v3.0.0)

- **Backend Repository**: [Link to backend repo]Expected response:



## 📄 License```json

{

[Your License Here]  "status": "healthy",

  "version": "3.0.0"

## 🤝 Contributing}

````

[Your Contributing Guidelines Here]

### Issue: OAuth callback fails

---

**Cause:** GitHub Client ID misconfigured

**Frontend Version**: 2.4.0 **Solution:**

**Backend API Version**: 3.0.0

**Next.js**: 15.0.0 1. Verify `NEXT_PUBLIC_GITHUB_CLIENT_ID` in `.env.local`

**React**: 19.0.0 2. Check OAuth app callback URL: `http://localhost:3000/auth`

**TypeScript**: 5.6.23. Ensure backend has correct GitHub client secret

### Issue: CORS errors

**Cause:** Backend not allowing frontend origin  
**Solution:**
Backend should allow: `http://localhost:3000`

Set in backend `.env`:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
```

---

## Deployment

### Vercel (Recommended)

1. **Push to GitHub:**

   ```powershell
   git add .
   git commit -m "feat: production ready"
   git push origin main
   ```

2. **Import to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables:**

   ```
   NEXT_PUBLIC_API_BASE=https://your-backend-url.com
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
   ```

4. **Deploy:**

   - Vercel auto-deploys on every push to `main`
   - Production URL: `https://your-app.vercel.app`

5. **Update GitHub OAuth:**
   - Add production callback: `https://your-app.vercel.app/auth`

### Manual Deployment

```powershell
# Build
npm run build

# Test production build locally
npm start

# Deploy build folder (.next/) to your hosting
```

---

## Development Scripts

```powershell
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # Run ESLint
```

---

## Backend Requirements

**DevPath AI Backend v3.0.0 or higher**

Required backend features:

- JWT-based authentication
- Report persistence (PostgreSQL/SQLite)
- GitHub token encryption
- Report history endpoint (GET /reports/)
- Report management (GET/DELETE /reports/{id})

See `api_documentation.md` for complete backend API reference.

---

## Contributing

This project is actively maintained. To contribute:

1. **Fork repository**
2. **Create feature branch:** `git checkout -b feature/your-feature`
3. **Make changes** and test thoroughly
4. **Commit:** `git commit -m "feat: add your feature"`
5. **Push:** `git push origin feature/your-feature`
6. **Open Pull Request** with detailed description

### Code Style

- **TypeScript:** Strict mode enabled
- **Formatting:** Prettier (auto-format on save)
- **Linting:** ESLint with Next.js rules
- **Components:** Functional components with hooks
- **State:** Zustand for global, useState for local

---

## License

**Proprietary** - DevPath AI © 2025

All rights reserved. This software is provided for use with DevPath AI services only.

---

## Credits & Technologies

Built with:

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Lucide](https://lucide.dev/) - Icon library
- [React Hot Toast](https://react-hot-toast.com/) - Notifications

---

## Support

**Documentation:** `api_documentation.md`  
**Backend Repo:** [devpath-ai-backend](https://github.com/ANIMANxd/devpath-ai-backend)  
**Issues:** [GitHub Issues](https://github.com/ANIMANxd/devpath-ai-frontend/issues)

---

**Built for developers, by developers.** 🚀
