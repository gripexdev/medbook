# MEDBOOK

MEDBOOK is a modern appointment booking platform built with Next.js, TypeScript, Tailwind CSS, and SQLite. It combines a premium marketing website with a secure, account-based booking experience for service businesses such as clinics, salons, wellness brands, and consulting teams.

## Product Summary

MEDBOOK is structured like a real client-ready web application:

- polished landing page and service presentation
- authenticated user flows
- protected booking and dashboard experience
- persistent backend with validation and access control
- adaptable business configuration for different appointment-based brands

The project is intentionally lightweight in scope, but it is implemented with production-minded structure and clear separation between UI, API, validation, authentication, and data access.

## Core Functionality

### Public Website

- premium landing page with hero, services preview, testimonials, contact block, and call-to-action sections
- responsive services page with category filtering
- reusable design system for buttons, cards, layout shells, and section headers

### Authentication

- user registration
- user login
- user logout
- session-based authentication with HTTP-only cookies
- protected booking, dashboard, and admin routes

### Booking Flow

- create appointments from a guided form
- collect full name, email, phone, service, date, time, and notes
- live booking summary alongside the form
- shared client/server validation
- dynamic slot generation from real availability rules
- slot conflict protection for confirmed bookings

### Dashboard

- view appointments for the current user only
- cancel bookings securely
- loading, empty, and success/error states
- account-scoped history instead of public email lookup

### Admin Operations

- admin-only scheduling workspace
- weekly availability window management
- blackout date management
- full appointment list across all users
- status management for confirmed, cancelled, and completed bookings

### Notifications

- confirmation emails
- cancellation emails
- reminder email workflow through a protected cron endpoint
- graceful fallback when email delivery credentials are not configured

### API Layer

- authentication endpoints
- booking CRUD-style endpoints for the signed-in user
- admin endpoints for availability and appointment operations
- availability slot endpoint for dynamic booking times
- health check and reminder cron endpoints
- public services endpoint
- validation and ownership checks at the route level

## Tech Stack

- `Next.js 14`
- `React 18`
- `TypeScript`
- `Tailwind CSS`
- `better-sqlite3`
- `bcryptjs`
- `jsonwebtoken`
- `zod`

## Architecture

```text
app/
  api/
    admin/
    auth/
    availability/
    bookings/
    cron/
    health/
    services/
  admin/
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

- `app/page.tsx` - marketing landing page
- `app/services/page.tsx` - service catalog
- `app/booking/page.tsx` - protected booking page
- `app/dashboard/page.tsx` - protected user dashboard
- `app/api/auth/*` - auth routes for register, login, logout, and session
- `app/api/bookings/*` - booking routes with ownership checks
- `app/api/admin/*` - admin routes for appointment and availability management
- `app/api/availability/slots/route.ts` - generated booking slots endpoint
- `app/api/cron/reminders/route.ts` - protected reminder trigger endpoint
- `app/api/health/route.ts` - health check endpoint
- `app/api/services/route.ts` - public service data endpoint
- `lib/db.ts` - SQLite initialization and schema setup
- `lib/auth.ts` - session creation, cookie handling, and auth helpers
- `lib/availability.ts` - scheduling rules, blackout dates, and slot generation
- `lib/users.ts` - user queries and persistence
- `lib/bookings.ts` - booking queries, creation, and cancellation logic
- `lib/notifications.ts` - confirmation, cancellation, and reminder workflows
- `lib/validators.ts` - shared validation schemas
- `config/site.ts` - editable business content and service configuration

## API Endpoints

### Authentication

- `POST /api/auth/register` - create an account
- `POST /api/auth/login` - authenticate a user
- `POST /api/auth/logout` - clear the active session
- `GET /api/auth/session` - return the current authenticated user

### Bookings

- `GET /api/bookings` - return bookings for the current user
- `POST /api/bookings` - create a booking for the current user
- `GET /api/bookings/:id` - return a single owned booking
- `PATCH /api/bookings/:id` - cancel an owned booking
- `DELETE /api/bookings/:id` - alias for cancellation

### Availability

- `GET /api/availability/slots` - return available slots for a service and date

### Admin

- `GET /api/admin/bookings` - return all bookings for admins
- `PATCH /api/admin/bookings/:id` - update booking status as an admin
- `GET /api/admin/availability/windows` - list weekly availability windows
- `POST /api/admin/availability/windows` - create a weekly availability window
- `DELETE /api/admin/availability/windows/:id` - remove a weekly availability window
- `GET /api/admin/availability/blackouts` - list blackout dates
- `POST /api/admin/availability/blackouts` - create a blackout date
- `DELETE /api/admin/availability/blackouts/:id` - remove a blackout date

### Operations

- `GET /api/health` - return application health status
- `POST /api/cron/reminders` - send reminder emails through a secured cron hook

### Services

- `GET /api/services` - return configured service data

## Local Development

### Install dependencies

```bash
npm install
```

### Environment variables

Example configuration:

```env
AUTH_SECRET=replace-with-a-long-random-secret
DATABASE_PATH=./data/medbook.db
ADMIN_NAME=MEDBOOK Admin
ADMIN_EMAIL=admin@medbook.local
ADMIN_PASSWORD=ChangeMe123
APP_URL=http://localhost:3000
CRON_SECRET=replace-with-a-long-random-cron-secret
EMAIL_FROM=MEDBOOK <notifications@example.com>
RESEND_API_KEY=
```

The repository includes [`.env.example`](./.env.example) as a template.

### Start the development server

```bash
npm run dev
```

Application URL:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - run the development server
- `npm run build` - create the production build
- `npm run start` - run the standalone production server
- `npm run lint` - run Next.js linting
- `npm run test:integration` - run end-to-end API integration checks against the built app
- `npm run verify` - build the app and run the integration verification suite

## Data and Security

- SQLite is used for simple local persistence
- passwords are hashed with `bcryptjs`
- sessions are stored in signed HTTP-only cookies
- booking routes require authentication
- admin routes require an authenticated admin account
- users can access only their own appointments
- availability windows and blackout dates control slot generation
- confirmed booking slots are protected against duplicate reservations
- login and registration routes are rate limited
- deployment headers are configured in Next.js for baseline hardening

## Customization

MEDBOOK is easy to adapt for different businesses. The main configuration surface is:

- `config/site.ts` for brand name, services, content, testimonials, and contact details
- `public/images` for local brand and marketing assets
- `app/globals.css` and `tailwind.config.js` for visual theme adjustments
- `.env` values for auth, admin seeding, email delivery, and cron security

## Production Considerations

The current implementation is strong for a portfolio project, demo environment, or single-instance deployment. For a larger real-world rollout, typical next steps would be:

- move from SQLite to PostgreSQL or MySQL
- add provider or staff-level scheduling
- connect a production email provider account
- add monitoring, audit logging, and automated tests

## Project Value

MEDBOOK works well as a portfolio project because it demonstrates:

- premium frontend execution
- practical UX design for booking flows
- real authentication and protected APIs
- clean TypeScript and component structure
- a business-ready foundation that can be extended for client work
