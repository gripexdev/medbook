# MEDBOOK

MEDBOOK is a premium appointment booking web app built with Next.js, TypeScript, Tailwind CSS, and SQLite.

It is designed as a polished portfolio-quality product for clinics, salons, wellness brands, consultants, and other service businesses that need a clean public website plus a secure booking flow.

## Overview

MEDBOOK combines a modern marketing site with an authenticated appointment system:

- Public landing page with a premium healthcare and SaaS-inspired design
- Services catalog with categorized service cards
- Secure account creation and sign-in
- Protected booking flow tied to the signed-in user
- Private dashboard for viewing and cancelling appointments
- SQLite-backed API with validation, session auth, and booking ownership checks

## Tech Stack

- `Next.js 14` with the App Router
- `TypeScript`
- `Tailwind CSS`
- `React 18`
- `better-sqlite3` for persistent local data storage
- `bcryptjs` for password hashing
- `jsonwebtoken` for signed session cookies
- `zod` for shared API and form validation

## Main Features

### Public Experience

- Premium landing page with hero, services preview, testimonials, CTA, and contact section
- Services page with filtering by category
- Responsive layout optimized for mobile, tablet, and desktop

### Authentication

- User registration
- User login
- User logout
- Session-based authentication using HTTP-only cookies
- Protected routes for booking and dashboard pages

### Booking System

- Authenticated appointment booking form
- Fields for name, email, phone, service, date, time, and notes
- Booking summary card with live details
- Server-side and client-side validation
- Conflict protection to prevent double-booking the same confirmed slot

### Dashboard

- View appointments belonging only to the signed-in user
- Cancel existing bookings
- Empty state and loading state handling
- Account-based booking history instead of public email lookup

### API

- Auth endpoints for register, login, logout, and session checks
- Bookings endpoints for create, list, fetch, and cancel
- Public services endpoint for frontend consumption

## Project Structure

```text
app/
  api/
    auth/
    bookings/
    services/
  booking/
  dashboard/
  login/
  register/
  services/
components/
config/
data/
lib/
public/
```

## Key Files

- `app/page.tsx` - landing page
- `app/services/page.tsx` - services catalog
- `app/booking/page.tsx` - protected booking page
- `app/dashboard/page.tsx` - protected user dashboard
- `app/api/auth/*` - authentication API routes
- `app/api/bookings/*` - booking API routes
- `app/api/services/route.ts` - services API endpoint
- `lib/db.ts` - SQLite database setup
- `lib/auth.ts` - session cookie handling and auth helpers
- `lib/bookings.ts` - booking queries and mutation logic
- `lib/users.ts` - user queries and creation
- `lib/validators.ts` - shared request validation
- `config/site.ts` - editable business content and services configuration

## API Endpoints

### Auth

- `POST /api/auth/register` - create a new account
- `POST /api/auth/login` - sign in with email and password
- `POST /api/auth/logout` - clear the current session
- `GET /api/auth/session` - return the current authenticated user

### Bookings

- `GET /api/bookings` - list bookings for the current user
- `POST /api/bookings` - create a booking for the current user
- `GET /api/bookings/:id` - fetch one booking owned by the current user
- `PATCH /api/bookings/:id` - cancel a booking owned by the current user
- `DELETE /api/bookings/:id` - alias for cancellation

### Services

- `GET /api/services` - return the configured list of services

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

The project includes an example file:

```bash
.env.example
```

Required variables:

```env
AUTH_SECRET=replace-with-a-long-random-secret
DATABASE_PATH=./data/medbook.db
```

For local development, a working `.env.local` can be used.

### 3. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 4. Run a production build

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - start the local development server
- `npm run build` - create the production build
- `npm run start` - start the production server
- `npm run lint` - run Next.js linting

## Database

MEDBOOK currently uses SQLite for simplicity and portability.

- Database file location is controlled by `DATABASE_PATH`
- Tables are created automatically on startup
- User passwords are stored as hashes, never plain text
- Confirmed booking slots are protected by a unique index to prevent duplicates

This makes the project easy to run locally and suitable for a portfolio/demo deployment.

## Customization

To adapt MEDBOOK for a clinic, salon, or consulting business, update:

- `config/site.ts` for business name, services, contact details, testimonials, and UI copy
- `public/images` for brand and marketing visuals
- Tailwind and global styles for theme adjustments if needed

## Production Notes

This project is structured to feel production-ready, but for a larger real-world deployment you may want to add:

- PostgreSQL or MySQL instead of SQLite for multi-instance deployments
- Rate limiting on auth and booking endpoints
- Email confirmations and reminders
- Admin roles and appointment management tools
- Audit logging and monitoring
- End-to-end tests and CI pipelines

## Why This Project Works Well as a Portfolio Piece

- Strong visual presentation with a premium UI
- Real authentication instead of static demo forms
- Persistent backend with protected API routes
- Clean separation between UI, API, validation, and data access
- Easily adaptable to different appointment-based businesses

## License

This project is intended for portfolio and educational use unless you define your own license.
