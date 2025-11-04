# DevPath AI Frontend

A professional, AI-powered developer career analytics platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### Modern UI/UX

- **Refined Black & White Design**: Professional brutalist aesthetic with soft shadows
- **Framer Motion Animations**: Smooth, professional animations throughout
- **Responsive Design**: Mobile-first design that works perfectly on all devices
- **Clean Typography**: Easy-to-read fonts with proper hierarchy
- **Accessible**: Designed for extended use without eye strain

### Core Functionality

#### 1. Full GitHub Analysis

- Comprehensive repository scanning (up to 30 repos)
- Developer Archetype Detection (Builder/Refiner/Maintainer)
- Skill Constellation Extraction
- Flagship Projects Identification
- AI Code Quality Analysis
- Suggested Career Paths
- AI-Generated Project Ideas

#### 2. Career Track Generator

- Personalized learning paths based on current skills
- Target domain selection
- Multi-step roadmap:
  - Learning Step with detailed guidance
  - Bridge Project to apply knowledge
  - Capstone Project for mastery
- Suggested tech stacks for each project

#### 3. Market Match Analysis

- Gap analysis for target job roles
- Skills comparison (matching vs missing)
- Visual match score indicator
- Industry-standard skill requirements
- Supported roles:
  - Backend Engineer
  - Frontend Engineer
  - Fullstack Engineer
  - DevOps Engineer
  - ML Engineer
  - Data Engineer
  - Mobile Developer
  - Cloud Architect

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Notifications**: React Hot Toast
- **API Client**: Custom fetch wrapper

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- DevPath AI Backend running (default: http://localhost:8000)

### Steps

1. **Clone and Navigate**

```powershell
cd c:\Users\bhide\Dev\devpath-ai\devpath-ai-frontend
```

2. **Install Dependencies**

```powershell
npm install
```

3. **Environment Setup**

```powershell
# Create .env.local file
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

4. **Run Development Server**

```powershell
npm run dev
```

5. **Open Browser**
   Navigate to `http://localhost:3000`

## Usage

### Getting Started

1. **Landing Page**: Visit home page to learn about features
2. **Authentication**: Click "Get Started" and enter your GitHub Personal Access Token
   - Generate token at: GitHub → Settings → Developer settings → Personal access tokens
   - Required scope: `repo` (for private repos) or public access
3. **Dashboard**: Access your personalized developer dashboard

### Running Full Analysis

1. Go to Dashboard → Analysis Tab
2. Click "Start Full Analysis"
3. Wait 30-60 seconds for AI processing
4. View your:
   - Developer Archetype
   - Skill Constellation
   - Flagship Projects
   - Code Quality Summary
   - Career Path Suggestions
   - Project Ideas

### Generating Career Track

1. Go to Dashboard → Career Track Tab
2. Enter target domain (e.g., "Frontend development with React")
3. Click "Generate Career Track"
4. Follow the 3-step roadmap:
   - Learning Step
   - Bridge Project
   - Capstone Project

### Market Match Analysis

1. Go to Dashboard → Market Match Tab
2. Select target job role from dropdown
3. Click "Analyze Market Fit"
4. Review:
   - Matching Skills
   - Skills to Learn
   - Overall Match Score

## Project Structure

```
devpath-ai-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   ├── auth/
│   │   │   └── page.tsx           # Authentication page
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Main dashboard
│   │   └── explore/
│   │       └── page.tsx           # Features page
│   ├── components/
│   │   └── dashboard/
│   │       ├── AnalysisSection.tsx
│   │       ├── CareerTrackSection.tsx
│   │       └── MarketMatchSection.tsx
│   ├── lib/
│   │   ├── api.ts                 # API client
│   │   └── utils.ts               # Utility functions
│   ├── store/
│   │   └── auth.ts                # Auth state (Zustand)
│   └── types/
│       └── api.ts                 # TypeScript interfaces
├── public/                        # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## Customization

### Colors

Edit `tailwind.config.ts` and `src/app/globals.css` to customize the color scheme.

### Animations

Modify animation timings in `tailwind.config.ts` under `extend.animation` and `extend.keyframes`.

### API Endpoints

Update `NEXT_PUBLIC_API_BASE` in `.env.local` to point to your backend.

## Troubleshooting

### TypeScript Errors

All TypeScript errors shown are expected before running `npm install`. They will resolve after installing dependencies.

### Backend Connection

Ensure the backend is running at `http://localhost:8000` (or your configured URL).

Test with:

```powershell
curl http://localhost:8000
```

Expected response:

```json
{ "message": "Welcome to DevPath AI v2. The oracle is ready." }
```

### CORS Issues

If you encounter CORS errors, ensure the backend has CORS middleware configured with your frontend origin.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variable: `NEXT_PUBLIC_API_BASE`
4. Deploy

### Other Platforms

```powershell
# Build for production
npm run build

# Start production server
npm start
```

## API Documentation

All API endpoints are documented in `api_documentation.md` in the root directory.

Key endpoints:

- `POST /full-analysis` - Comprehensive GitHub analysis
- `POST /generate-track` - Career track generation
- `POST /market-match` - Market fit analysis

## Contributing

This is a custom build for DevPath AI. For modifications:

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR with detailed description

## License

Proprietary - DevPath AI

## Credits

- **Framer Motion**: Animation library
- **Lucide**: Icon set
- **Tailwind CSS**: Utility-first CSS framework
- **Next.js**: React framework

---

Built for developers, by developers.

For questions or support, check the API documentation or backend repository.
