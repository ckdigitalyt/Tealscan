# TealScan - Mutual Fund X-Ray Tool

## Overview

TealScan is a comprehensive Fintech SaaS application for analyzing mutual fund portfolios. It parses CAMS/Karvy CAS (Consolidated Account Statement) PDF files to detect hidden commissions, calculate true XIRR returns, and provide portfolio health ratings.

**Key USP:** All PDF parsing happens client-side in the browser for complete data privacy - portfolio data never leaves the user's device.

## Project Architecture

### Frontend (Next.js 14) - Primary
- **Location:** `frontend/`
- **Port:** 5000
- **Tech Stack:**
  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - Lucide React (icons)
  - PDF.js for client-side PDF parsing
  - Recharts (charts)

### Backend (Python/FastAPI) - Support
- **Location:** `backend/main.py`
- **Port:** 8000
- **Key Features:**
  - Heavy computations (XIRR, fund comparisons)
  - Non-sensitive operations only

## Key Files

```
/
├── backend/
│   └── main.py           # FastAPI server
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Main page component with view states
│   │   │   ├── layout.tsx     # Root layout with SEO metadata
│   │   │   ├── debug/page.tsx # Debug page for PDF testing
│   │   │   └── globals.css    # Global styles + mobile optimizations
│   │   ├── components/
│   │   │   ├── Navbar.tsx            # Navigation bar
│   │   │   ├── Hero.tsx              # App hero section
│   │   │   ├── EnhancedLandingPage.tsx  # Landing page with all sections
│   │   │   ├── EnhancedUploadCard.tsx   # PDF upload with smart loading
│   │   │   ├── Dashboard.tsx         # Results dashboard with demo badge
│   │   │   ├── DashboardTabs.tsx     # Tabbed dashboard views
│   │   │   ├── FAQ.tsx               # FAQ accordion section
│   │   │   ├── SavingsComparison.tsx # Regular vs Direct comparison
│   │   │   ├── Footer.tsx            # TealScan branded footer
│   │   │   ├── ProblemSolution.tsx   # Problem/solution section
│   │   │   ├── HowItWorks.tsx        # How it works steps
│   │   │   ├── FeatureGrid.tsx       # Feature showcase
│   │   │   └── TestimonialCarousel.tsx # User testimonials
│   │   ├── lib/
│   │   │   ├── pdfParser.ts   # Client-side PDF.js parsing
│   │   │   └── sampleData.ts  # Demo portfolio data
│   │   └── types/
│   │       └── index.ts       # TypeScript interfaces
│   ├── next.config.mjs        # Next.js config
│   └── tailwind.config.ts     # Tailwind theme config
└── start.sh                   # Combined startup script
```

## Features Implemented

### Core Functionality
- Client-side PDF parsing using PDF.js with transform matrix coordinate extraction
- Support for password-protected CAS files
- Fund detection with flexible regex patterns
- Market value and cost value extraction
- Direct vs Regular plan identification

### UI/UX Features
- Smart loading messages cycling during analysis
- Demo mode with sample portfolio data and "Demo Data" badge
- FAQ accordion section with common questions
- Before/After savings comparison (Regular vs Direct plans)
- Drag-and-drop file upload with visual feedback
- File size validation (max 10MB)
- Specific error messages with "Try Again" button
- Mobile-optimized with 48px touch targets

### SEO & Branding
- Complete meta tags with OpenGraph and Twitter cards
- TealScan branded footer with privacy messaging
- Professional disclaimer and legal links

## Design System

- **Primary Color:** Neon Green (#00FF94)
- **Accent Color:** Bright Teal (#2DD4BF)
- **Background:** Dark (#121212)
- **Error Color:** Neon Orange (#FF5555)
- **Typography:** Inter font family
- **UI Style:** Dark glassmorphism cards, rounded corners, neon accents

## Running the Application

Both servers run concurrently via workflow:
- Backend API on port 8000
- Frontend on port 5000 (webview)

The frontend handles all PDF parsing locally for privacy.

## Recent Changes

- **Dec 2, 2025:** Production-ready improvements
  - Fixed PDF.js text extraction using transform matrix coordinates
  - Added demo mode with sample portfolio and badge indicator
  - Smart loading messages during analysis
  - Enhanced SEO meta tags with OpenGraph
  - FAQ accordion section
  - Before/After savings comparison visual
  - TealScan branded footer
  - Improved error handling with Try Again button
  - Mobile optimization with touch targets
  - File validation and helper text

- **Nov 28, 2025:** Initial implementation of TealScan MVP
  - FastAPI backend with CAS PDF parsing
  - Next.js frontend with landing page and dashboard
  - Commission detection and XIRR calculation
  - Portfolio health scoring system

## User Preferences

- Dark mode theme with neon green accents
- All PDF parsing must happen client-side (privacy-first)
- Professional fintech aesthetic
- Framer Motion animations for smooth transitions

## Deployment

Deployed at: https://ckdigitalyt-tealscan.vercel.app/
