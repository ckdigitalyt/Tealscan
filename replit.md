# TealScan - Mutual Fund X-Ray Tool

## Overview

TealScan is a comprehensive Fintech SaaS application for analyzing mutual fund portfolios. It parses CAMS/Karvy CAS (Consolidated Account Statement) PDF files to detect hidden commissions, calculate true XIRR returns, and provide portfolio health ratings.

## Project Architecture

### Backend (Python/FastAPI)
- **Location:** `backend/main.py`
- **Port:** 8000
- **Key Features:**
  - PDF parsing using `casparser` with `force_pdfminer=True`
  - Commission detection (Direct vs Regular plans)
  - XIRR calculation using `pyxirr`
  - Asset classification (Equity/Debt/Gold)
  - Portfolio health scoring

### Frontend (Next.js 14)
- **Location:** `frontend/`
- **Port:** 5000
- **Tech Stack:**
  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - Lucide React (icons)
  - Recharts (charts)

## Key Files

```
/
├── backend/
│   └── main.py           # FastAPI server with /api/scan endpoint
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx       # Main page component
│   │   │   ├── layout.tsx     # Root layout
│   │   │   └── globals.css    # Global styles
│   │   ├── components/
│   │   │   ├── Navbar.tsx     # Navigation bar
│   │   │   ├── Hero.tsx       # Landing hero section
│   │   │   ├── UploadCard.tsx # PDF upload component
│   │   │   ├── Features.tsx   # Feature showcase grid
│   │   │   ├── Dashboard.tsx  # Results dashboard
│   │   │   ├── AssetChart.tsx # Asset allocation chart
│   │   │   └── FundTable.tsx  # Fund health table
│   │   └── types/
│   │       └── index.ts       # TypeScript interfaces
│   ├── next.config.mjs        # Next.js config with API proxy
│   └── tailwind.config.ts     # Tailwind theme config
└── start.sh                   # Combined startup script
```

## API Endpoints

### POST /api/scan
Scans a CAS PDF file and returns portfolio analysis.

**Request:**
- Form data with `file` (PDF) and `password` (string)

**Response:**
```json
{
  "net_worth": 500000.00,
  "total_invested": 400000.00,
  "total_gain": 100000.00,
  "total_gain_percent": 25.00,
  "total_commission_loss": 5000.00,
  "portfolio_health_score": 75,
  "funds_count": 5,
  "direct_funds_count": 3,
  "regular_funds_count": 2,
  "asset_allocation": {"Equity": 70.0, "Debt": 20.0, "Gold": 10.0},
  "funds": [...]
}
```

## Design System

- **Primary Color:** Deep Teal (#0F766E)
- **Accent Color:** Bright Teal (#2DD4BF)
- **Background:** Slate White (#F8FAFC)
- **Typography:** Inter / Manrope fonts
- **UI Style:** Glassmorphism cards, rounded corners, subtle shadows

## Running the Application

Both servers run concurrently:
- Backend API on port 8000
- Frontend on port 5000 (webview)

The frontend proxies API requests to the backend via Next.js rewrites.

## Recent Changes

- **Nov 28, 2025:** Initial implementation of TealScan MVP
  - FastAPI backend with CAS PDF parsing
  - Next.js frontend with landing page and dashboard
  - Commission detection and XIRR calculation
  - Portfolio health scoring system

## User Preferences

- Professional light mode theme
- Teal color scheme matching PowerUp Money aesthetic
- Framer Motion animations for smooth transitions
