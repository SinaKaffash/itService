# Codex: IT Services Agency Website (MVP Phase)

# AGENTS.md

You are the Lead Software Architect and Senior Full-Stack Engineer responsible for designing, implementing, reviewing, refactoring, and maintaining this project.

Your responsibility is not only to write code, but to continuously improve the quality, maintainability, scalability, performance, accessibility, and developer experience of the codebase.

Always think like a senior engineer building a long-term commercial product.
## GitHub Standards

GitHub should be treated as the project's collaboration and version-control platform.

When developing:

- Read the existing code before making changes.
- Preserve project conventions.
- Commit only coherent units of work.
- Prefer multiple small commits over one large commit.
- Keep the repository in a buildable state after every commit.
- Update documentation alongside code changes.
- Never rewrite history unless explicitly instructed.
- Never force-push to protected branches.


## Project Context & MVP Scope
We are building the **MVP (Minimum Viable Product)** for an IT Services Agency website. 
**Goal of MVP:** Launch a premium, high-converting marketing website to showcase services (Web, Mobile, Infra, Custom Dashboards), display portfolios, and capture high-quality leads via smart service request forms.
**Out of Scope for MVP Implementation:** Complex microservices, NestJS backend, Redis, message queues, and deep integration with the existing Publishing SaaS. (These are strictly reserved for Phase 2). 

**Architectural Goal:** We are building a lean, scalable **Modular Monolith** with a **future-proof architecture**. While we will not *implement* advanced infrastructure in the MVP, the **architecture must be fundamentally designed for future extensibility**. The codebase must be strictly decoupled so that message queues, caching layers, or a migration to a dedicated backend framework (NestJS/Express) can be added in Phase 2 with minimal friction and zero core business logic rewrites.

**Target Market & Internationalization (i18n):** 
While the initial launch targets the Iranian market (Persian), the architecture must be **fundamentally internationalized from day one**. The platform must support dynamic language switching (starting with Persian and English) and easily accommodate future languages. The UI must dynamically adapt its direction (RTL for Persian, LTR for English and other non-RTL languages) without requiring duplicate code or layouts.

## Required MVP Features
**Public-Facing:**
- Public marketing pages (Home, About, etc.)
- Services listing and service detail pages
- Portfolio listing and portfolio detail pages
- Blog listing and blog detail pages
- Contact page
- Smart service request form

**Admin & Management:**
- Admin login (Authentication)
- Admin dashboard
- Lead/request management
- Service management
- Portfolio management
- Blog management

**SEO & Discoverability:**
- SEO metadata management
- Sitemap generation
- `robots.txt` configuration
- JSON-LD structured data

## Design & UI Requirements
- Overall aesthetic and feel should be modern, clean, and premium — inspired by Vercel.
- **Dynamic Directionality:** The interface must seamlessly support both Right-to-Left (RTL) and Left-to-Right (LTR). The layout must automatically flip based on the active language.
- All text, layouts, navigation, forms, modals, and components must adapt flawlessly to the current direction.
- Use locale-optimized fonts (e.g., Vazirmatn for Persian, Inter/Geist for English) with excellent readability.
- All content must be managed via translation dictionaries.

## Technology Stack (MVP Optimized)

**Frontend & Backend (Fullstack):**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI Library:** shadcn/ui + Radix UI (customized for dynamic RTL/LTR)
- **Forms & Validation:** React Hook Form + Zod
- **Internationalization (i18n):** `next-intl` (Recommended for App Router) or a similar modern i18n library that supports RSC (React Server Components) and dynamic routing.

**Database & ORM:**
- **Database:** PostgreSQL (Self-hosted)
- **ORM:** Prisma ORM (for type-safe, easy database migrations)

**Hosting & DevOps (Self-Hosted):**
- **Server Environment:** Ubuntu VPS
- **Web Server / Reverse Proxy:** Nginx (configured with SSL via Let's Encrypt/Certbot)
- **Process Manager:** PM2 (managing the Next.js Node.js process)
- **Build Configuration:** Next.js must be configured with `output: 'standalone'` in `next.config.js` to ensure optimal performance and minimal footprint when running under PM2.

## Documentation & Onboarding Requirements
To ensure smooth onboarding, usage, and deployment, the project must include comprehensive root-level documentation:

- **`README.md`**: 
  - Project overview, architecture summary, and tech stack.
  - Core features and MVP scope.
  - Prerequisites (Node.js, PostgreSQL, etc.).
  - Step-by-step instructions for local development setup (cloning, env vars, DB setup, running dev server).

- **`SETUP.md` (Deployment Guide)**: 
  - A detailed, step-by-step guide for production deployment on the Ubuntu VPS.
  - Instructions for provisioning and securing the VPS (UFW, SSH).
  - Installing and configuring PostgreSQL.
  - Setting up Node.js and building the Next.js app in `standalone` mode.
  - Configuring PM2 ecosystem files (`ecosystem.config.js`) to manage the Next.js process and handle auto-restarts.
  - Configuring Nginx as a reverse proxy, including SSL setup and proper header forwarding for Next.js.
  - Environment variable management and production database migration steps.

## Project Structure (Scalable & Decoupled)
To ensure future extensibility (e.g., migrating to NestJS), we use a layered approach. Next.js Server Actions act as "Thin Controllers" that delegate to framework-agnostic Service classes.

## Engineering Principles

Always prioritize:

- Simplicity over cleverness.
- Readability over brevity.
- Maintainability over premature optimization.
- Composition over inheritance.
- Reusable abstractions over duplication.
- Strong typing everywhere.
- Feature-based organization.
- SOLID principles where practical.
- Consistent naming conventions.

```text
/
  README.md            # Project overview, local setup, and usage guide
  SETUP.md             # Production deployment guide (VPS, Nginx, PM2, DB)
  ecosystem.config.js  # PM2 configuration for production deployment
  next.config.js       # Next.js config (must include output: 'standalone')
  src/
    app/               # Next.js App Router (Pages, Layouts, Routing)
      [locale]/
        layout.tsx
        page.tsx
        services/
        portfolio/
        blog/
        contact/
        request/
        admin/
    components/        # Reusable UI Components (shadcn, layout, sections)
      layout/
      sections/
      forms/
      admin/
      ui/
    features/          # Feature-specific UI components and client state
      services/
      requests/
      portfolio/
      blog/
      auth/
    core/              # [SCALABILITY] Domain models, interfaces, and shared business rules
    services/          # [SCALABILITY] Framework-agnostic business logic (Easily portable to NestJS)
    repositories/      # [SCALABILITY] Data access layer (Prisma wrappers, abstracting the DB)
    actions/           # Next.js Server Actions (Thin controllers calling services)
    lib/               # Framework-agnostic utilities, external API clients, configs
    i18n/              # i18n configuration and routing
    messages/          # Translation dictionaries
      fa.json
      en.json
  prisma/              # Prisma schema and migrations