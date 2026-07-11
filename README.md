# IT Services Agency

A bilingual IT services agency MVP built as a lean, production-ready modular monolith. The site targets Persian and English visitors, supports RTL/LTR layouts, showcases services, portfolio items, and blog content, and includes an admin area for managing leads and content.

## What This Project Includes

- Public pages: home, about, services, portfolio, blog, contact, and smart request form.
- Admin pages: login, dashboard, lead management, service management, portfolio management, blog management, and dynamic admin user management.
- Internationalization with `next-intl`: Persian (`fa`, RTL) and English (`en`, LTR).
- PostgreSQL persistence through Prisma ORM.
- Secure admin authentication using signed JWT session cookies plus database-backed session revocation.
- SEO basics: metadata, `robots.txt`, sitemap, and structured data components.
- Production-ready Next.js standalone build for PM2 deployment.

## Technology Stack

- Next.js 15 App Router and React 19
- TypeScript strict mode
- Tailwind CSS with shadcn/ui and Radix UI conventions
- `next-intl` for locale routing and translations
- React Hook Form and Zod for forms and validation
- Prisma ORM with PostgreSQL
- `bcryptjs` for admin password hashing
- PM2 and Nginx for production hosting on Ubuntu

## Architecture

The codebase follows a layered modular-monolith structure:

```text
src/app/            Next.js routes, layouts, and pages
src/actions/        Server Actions; thin controllers for UI mutations
src/components/     Shared UI, layout, forms, admin components, sections
src/features/       Feature-specific schemas and UI state
src/core/           Framework-agnostic domain contracts and types
src/services/       Business logic; portable to a future backend service
src/repositories/   Prisma-backed data access implementations
src/lib/            Shared utilities, Prisma client, SEO, auth helpers
src/i18n/           Locale routing and request config
src/messages/       Translation dictionaries
prisma/             Prisma schema, migrations, and seed script
scripts/            Smoke tests and build helper scripts
```

The important rule is that business logic lives in `src/services`, persistence lives behind `src/repositories`, and Next.js Server Actions stay thin. This keeps the MVP simple while preserving a clean path toward a separate API service later.

## How Authentication Works

Admin authentication is intentionally hybrid:

1. The admin enters email and password on `/fa/admin/login` or `/en/admin/login`.
2. `loginAdminAction` validates input with Zod.
3. `AdminAuthService` loads the active admin by normalized username or email.
4. The password is checked with `bcryptjs.compare`.
5. On success, the server creates a signed HS256 JWT with:
   - `sub`: admin user ID
   - `email`: admin email
   - `name`: admin display name
   - `jti`: unique random session ID
   - `iss`: application issuer
   - `aud`: admin audience
   - `iat`, `nbf`, `exp`: issued, not-before, and expiry timestamps
6. The browser receives the JWT in an HttpOnly cookie named `nexus_admin_session`.
7. The database stores only a SHA-256 hash of the JWT `jti`, not the JWT itself.
8. Every server-side admin request verifies the JWT signature and expiry, then checks the hashed `jti` exists in `AdminSession`.
9. Logout deletes the session hash from the database and clears the cookie.
10. Super admins can manage administrator accounts from `/fa/admin/users` or `/en/admin/users`.
11. Running `npm run db:seed` again updates the initial super admin and revokes existing sessions for that admin.

This gives the convenience of JWT cookies while preserving server-side revocation.

## Admin User Management

The `.env` admin credentials are only for bootstrapping the first `SUPER_ADMIN`. After signing in, use the admin users page to create additional accounts, reset passwords, change roles, and deactivate access dynamically.

- `SUPER_ADMIN`: can manage leads, content, and admin users.
- `EDITOR`: can manage leads and content, but cannot create or change admin users.
- Deactivating a user revokes that user's active sessions.
- The app prevents removing the final active super admin, so the site cannot be locked out accidentally.

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/it_services?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_JWT_SECRET="replace-with-a-random-value-at-least-32-characters-long"
ADMIN_EMAIL="admin@your-domain.com"
ADMIN_USERNAME="nexus-admin"
ADMIN_NAME="Site Administrator"
ADMIN_PASSWORD="replace-with-a-long-random-password"
```

Environment validation runs during server startup and whenever the Prisma/JWT/SEO helpers are loaded. Missing or invalid required values fail fast with a server-side configuration error.

- Server-only: `DATABASE_URL`, `ADMIN_JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_USERNAME`, `ADMIN_NAME`, `ADMIN_PASSWORD`.
- Browser-safe: `NEXT_PUBLIC_APP_URL`.
- Optional runtime bind settings: `PORT`, `HOSTNAME`.

Only variables prefixed with `NEXT_PUBLIC_` are allowed to reach browser bundles. Never put database credentials, session secrets, seed passwords, storage secrets, or email credentials in a `NEXT_PUBLIC_` variable. `NEXT_PUBLIC_SITE_URL` is accepted as a legacy alias, but new environments should use `NEXT_PUBLIC_APP_URL`.

Development should use a local PostgreSQL URL and `NEXT_PUBLIC_APP_URL="http://localhost:3000"`. Production should use a least-privilege PostgreSQL user, a fresh `ADMIN_JWT_SECRET`, and the public HTTPS origin in `NEXT_PUBLIC_APP_URL`.

Generate a strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Use a unique admin password with at least 12 characters. `ADMIN_USERNAME` must be 3-32 lowercase letters, numbers, dots, underscores, or hyphens. For production, use a fresh `ADMIN_JWT_SECRET`, a real admin email on your domain, a production PostgreSQL user in `DATABASE_URL`, and a stronger password than any local development value.

## Local Setup

Prerequisites:

- Node.js 22 LTS
- npm 10+
- PostgreSQL 16+

Clone and install dependencies:

```bash
git clone <repository-url>
cd ItService
npm install
```

Create the local database. On a local PostgreSQL shell:

```sql
CREATE DATABASE it_services;
```

Create and edit `.env`:

```bash
cp .env.example .env
```

Then run:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/fa
http://localhost:3000/en
http://localhost:3000/fa/admin/login
http://localhost:3000/en/admin/login
```

On Windows PowerShell, if script execution blocks `npm`, use:

```powershell
npm.cmd run db:generate
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

## Common Development Commands

Generate Prisma Client:

```bash
npm run db:generate
```

Apply migrations in development:

```bash
npm run db:migrate
```

Seed the database:

```bash
npm run db:seed
```

Start the dev server:

```bash
npm run dev
```

`npm run dev` automatically clears the Next.js webpack development cache before
starting. This prevents stale `.next/cache/webpack` pack files from causing
noisy cache-restore warnings after switching between development and production
builds.

Run quality checks:

```bash
npm run type-check
npm run lint
npm run test:env
npm run build
```

Run the production standalone server locally:

```bash
npm run start
```

If `.next/standalone/server.js` is missing, `npm run start` automatically runs a
production build first and then starts the standalone server.

Run smoke checks:

```bash
npm run test:lead
npm run test:content
npm run test:auth
npm run test:env
```

## Database Schema Overview

The Prisma schema is in `prisma/schema.prisma`.

### AdminUser

Stores admin users.

- `id`: CUID primary key
- `email`: unique admin email
- `username`: unique login username
- `name`: display name
- `passwordHash`: bcrypt password hash
- `role`: `SUPER_ADMIN` or `EDITOR`
- `isActive`: disables login and session use when false
- `blogPosts`: relation to authored posts
- `sessions`: relation to active admin sessions
- `createdAt`, `updatedAt`: audit timestamps

### AdminSession

Stores revocable admin sessions.

- `id`: CUID primary key
- `tokenHash`: unique SHA-256 hash of JWT `jti`
- `expiresAt`: session expiry timestamp
- `userId`: relation to `AdminUser`
- `createdAt`, `updatedAt`: audit timestamps

### Service

Stores service pages and options used by the request form.

- `id`: CUID primary key
- `slug`: public unique URL slug
- `translations`: JSON content for locales
- `icon`: optional icon key
- `sortOrder`: display order
- `published`: public visibility flag
- `isActive`: soft-disable flag
- `leadRequests`: relation to submitted requests
- `createdAt`, `updatedAt`: audit timestamps

### Portfolio

Stores portfolio case studies.

- `id`: CUID primary key
- `slug`: public unique URL slug
- `translations`: JSON content for locales
- `coverImage`: optional cover image path or URL
- `gallery`: optional JSON gallery metadata
- `technologies`: PostgreSQL string array
- `sortOrder`: display order
- `published`: public visibility flag
- `isActive`: soft-disable flag
- `createdAt`, `updatedAt`: audit timestamps

### BlogPost

Stores blog articles.

- `id`: CUID primary key
- `slug`: public unique URL slug
- `translations`: JSON content for locales
- `coverImage`: optional cover image path or URL
- `published`: public visibility flag
- `publishedAt`: publication date
- `isActive`: soft-disable flag
- `authorId`: optional relation to `AdminUser`
- `createdAt`, `updatedAt`: audit timestamps

### LeadRequest

Stores customer leads from the request/contact flows.

- `id`: CUID primary key
- `fullName`, `phone`, `email`, `company`: customer identity fields
- `serviceType`: selected service category
- `locale`: source locale, default `fa`
- `budget`: optional budget range
- `description`: project/request details
- `status`: `NEW`, `IN_REVIEW`, `CONTACTED`, `QUALIFIED`, `WON`, `LOST`, or `ARCHIVED`
- `serviceId`: optional relation to `Service`
- `source`: optional source tag
- `metadata`: optional JSON metadata
- `createdAt`, `updatedAt`: audit timestamps

## Production Deployment

See [SETUP.md](./SETUP.md) for the full Ubuntu deployment guide with PostgreSQL, Prisma migrations, standalone Next.js build, PM2, Nginx, SSL, backups, and operational commands.
