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
- protected booking and dashboard routes

### Booking Flow

- create appointments from a guided form
- collect full name, email, phone, service, date, time, and notes
- live booking summary alongside the form
- shared client/server validation
- slot conflict protection for confirmed bookings

### Dashboard

- view appointments for the current user only
- cancel bookings securely
- loading, empty, and success/error states
- account-scoped history instead of public email lookup

### API Layer

- authentication endpoints
- booking CRUD-style endpoints for the signed-in user
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

- `app/page.tsx` - marketing landing page
- `app/services/page.tsx` - service catalog
- `app/booking/page.tsx` - protected booking page
- `app/dashboard/page.tsx` - protected user dashboard
- `app/api/auth/*` - auth routes for register, login, logout, and session
- `app/api/bookings/*` - booking routes with ownership checks
- `app/api/services/route.ts` - public service data endpoint
- `lib/db.ts` - SQLite initialization and schema setup
- `lib/auth.ts` - session creation, cookie handling, and auth helpers
- `lib/users.ts` - user queries and persistence
- `lib/bookings.ts` - booking queries, creation, and cancellation logic
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
- `npm run start` - run the production server
- `npm run lint` - run Next.js linting

## Data and Security

- SQLite is used for simple local persistence
- passwords are hashed with `bcryptjs`
- sessions are stored in signed HTTP-only cookies
- booking routes require authentication
- users can access only their own appointments
- confirmed booking slots are protected against duplicate reservations

## Customization

MEDBOOK is easy to adapt for different businesses. The main configuration surface is:

- `config/site.ts` for brand name, services, content, testimonials, and contact details
- `public/images` for local brand and marketing assets
- `app/globals.css` and `tailwind.config.js` for visual theme adjustments

## Production Considerations

The current implementation is strong for a portfolio project, demo environment, or single-instance deployment. For a larger real-world rollout, typical next steps would be:

- move from SQLite to PostgreSQL or MySQL
- add rate limiting for auth and booking routes
- add email confirmations and reminders
- add admin roles and operational tools
- add monitoring, audit logging, and automated tests

## Project Value

MEDBOOK works well as a portfolio project because it demonstrates:

- premium frontend execution
- practical UX design for booking flows
- real authentication and protected APIs
- clean TypeScript and component structure
- a business-ready foundation that can be extended for client work
