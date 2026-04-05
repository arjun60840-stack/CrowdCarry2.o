# CrowdCarry 🚂📦

**Turn Your Next Trip Into Extra Income.**

CrowdCarry is a peer-to-peer delivery platform where travelers deliver packages along their travel route (Indian inter-city trips like Delhi-Jaipur-Agra). 

Built with the modern 2026 stack (Next.js 15, React 19, Prisma, Tailwind CSS, shadcn/ui).

## 🚀 Tech Stack
- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion (Animations)
- **Icons**: Lucide React
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js / Auth.js with Phone OTP logic (Simulated)
- **State/Data**: TanStack Query + Zustand

## ✨ Core Features
1. **Premium Landing Page**: Glassmorphism cards, vibrant Indian context, 4-step guide.
2. **Multi-Role Auth**: Phone OTP login simulator + Google OAuth.
3. **Traveler Dashboard**: Post trips (Delhi-Jaipur-Agra), browse packages, manage earnings.
4. **Sender Mode**: Post package requests with weight/urgency tracking.
5. **Smart Matching**: Route-based algorithm (Match Score %) to pair travelers and senders.
6. **Live Tracking**: Simulated map tracking, status updates (Picked Up → In Transit → Delivered).
7. **Secure Handover**: OTP-based verification for handover at train stations.
8. **Earnings & Payouts**: UPI payout simulation & instant earnings overview.
9. **AI Trust Score**: Aadhaar verified badges & 1-100 trust scoring system.

## 🛠️ Setup Instructions

### 1. Prerequisite
- Node.js 20+
- PostgreSQL (or any DB supported by Prisma)

### 2. Clone & Install
```bash
git clone <this-repo>
cd crowdcarry
npm install
```

### 3. Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Fill in your `DATABASE_URL`, `NEXTAUTH_SECRET`, etc.

### 4. Database Setup
```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

## 🚃 Sample Routes for Demo
- **Delhi ↔ Jaipur** (Rajdhani / Shatabdi Express)
- **Delhi ↔ Agra** (Gatimaan Express)

## 📦 Project Structure
- `/app`: Pages, Layouts, and API routes.
- `/components`: Reusable UI components (shadcn/ui + custom).
- `/lib`: Database client, Auth config, Utils, and Match scoring logic.
- `/prisma`: Schema and seed data.
- `/types`: TypeScript definitions.

## 🎨 Design System
- **Primary**: Deep Teal (`#0F766E`)
- **Accent**: Bright Orange (`#FF6B00`)
- **Theme**: Light/Dark Mode support with Glassmorphism effects.

---
*Created for Hackathon Demo / Investor Pitch 🚀*
