# Marilah.my - Classifieds Platform

A mobile-first classifieds platform similar to Marilah.my.

## Tech Stack
- **Frontend**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma)
- **Auth**: NextAuth.js

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file based on `.env.example`:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/marilah"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

*Note: For local development without PostgreSQL, you can use SQLite by changing the provider in `prisma/schema.prisma` to `sqlite` and the URL to `file:./dev.db`.*

### 3. Database Migration & Seed
```bash
npx prisma migrate dev
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```

## Admin Access
- **URL**: `/admin/login`
- **Default Account**:
  - Email: `admin@marilah.my`
  - Password: `admin123`

## Features
- Mobile-first responsive design.
- User registration and login.
- Multi-step post publishing with image upload.
- Admin dashboard for post moderation and content management.
- Category and tag-based browsing.
- Real-time search.
