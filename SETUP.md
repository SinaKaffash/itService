# Production Deployment Guide

This guide explains how to deploy the IT Services Agency MVP on an Ubuntu VPS using PostgreSQL, Next.js standalone output, PM2, Nginx, and Certbot SSL.

Replace these examples before production:

- Domain: `example.com`
- App directory: `/var/www/it-services-agency`
- Linux user: `deploy`
- Database name: `it_services`
- Database user: `it_services_app`
- PM2 process name: `it-services-agency`

## 1. Server Requirements

Recommended minimum:

- Ubuntu 24.04 LTS
- 1-2 vCPU
- 2 GB RAM minimum, 4 GB preferred
- 20 GB SSD
- SSH access with a non-root user

Required software:

- Node.js 22 LTS
- npm 10+
- PostgreSQL 16+
- Nginx
- PM2
- Certbot

Production runtime files included in this repository:

- `next.config.js`: enables `output: "standalone"` for the production server bundle.
- `ecosystem.config.js`: starts `.next/standalone/server.js` with PM2 on `127.0.0.1:3000`.
- `.env.example`: documents all required environment variables.
- `package.json`: includes production migration, build, PM2 start, restart, and log scripts.
- Production scripts:
  - `npm run prod:migrate`: apply Prisma migrations with `prisma migrate deploy`.
  - `npm run prod:build`: generate Prisma Client and build the standalone Next.js bundle.
  - `npm run prod:start`: start the PM2 process from `ecosystem.config.js`.
  - `npm run prod:restart`: restart the PM2 process with updated environment variables.
  - `npm run prod:deploy`: run migrations, rebuild, and restart PM2 for an existing deployment.
  - `npm run prod:status`: show the PM2 process status.
  - `npm run prod:logs`: tail recent PM2 logs.
  - `npm run prod:save`: persist the PM2 process list for reboot recovery.

## 2. Initial Server Hardening

Log in as root or your provider's default user:

```bash
ssh root@YOUR_SERVER_IP
```

Create a deploy user:

```bash
adduser deploy
usermod -aG sudo deploy
```

Copy your SSH key to the deploy user:

```bash
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy
```

Enable the firewall:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

Optional but recommended: edit SSH config:

```bash
nano /etc/ssh/sshd_config
```

Use settings like:

```text
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

Restart SSH:

```bash
systemctl restart ssh
```

Open a new terminal and confirm you can log in as `deploy` before closing the root session:

```bash
ssh deploy@YOUR_SERVER_IP
```

## 3. Install System Packages

Update Ubuntu:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git build-essential nginx postgresql postgresql-contrib
```

Install Node.js 22 LTS through NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

Install PM2:

```bash
sudo npm install -g pm2
pm2 --version
```

Install Certbot:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## 4. Create PostgreSQL Database and User

Open the PostgreSQL shell:

```bash
sudo -u postgres psql
```

Create a dedicated database and least-privilege application user:

```sql
CREATE DATABASE it_services;
CREATE USER it_services_app WITH ENCRYPTED PASSWORD 'CHANGE_THIS_STRONG_DATABASE_PASSWORD';
GRANT CONNECT ON DATABASE it_services TO it_services_app;
\c it_services
GRANT USAGE, CREATE ON SCHEMA public TO it_services_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO it_services_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO it_services_app;
\q
```

The production `DATABASE_URL` will look like:

```env
DATABASE_URL="postgresql://it_services_app:CHANGE_THIS_STRONG_DATABASE_PASSWORD@localhost:5432/it_services?schema=public"
```

## 5. Upload or Clone the Project

Create the deployment directory:

```bash
sudo mkdir -p /var/www/it-services-agency
sudo chown -R deploy:deploy /var/www/it-services-agency
```

Clone the repository:

```bash
cd /var/www
git clone <repository-url> it-services-agency
cd /var/www/it-services-agency
```

Install dependencies from the lockfile:

```bash
npm ci
```

## 6. Configure Environment Variables

Create `.env`:

```bash
cp .env.example .env
nano .env
```

Production example:

```env
DATABASE_URL="postgresql://it_services_app:CHANGE_THIS_STRONG_DATABASE_PASSWORD@localhost:5432/it_services?schema=public"
NEXT_PUBLIC_APP_URL="https://example.com"
PORT="3000"
HOSTNAME="127.0.0.1"
ADMIN_JWT_SECRET="PASTE_A_LONG_RANDOM_SECRET_HERE"
ADMIN_EMAIL="admin@your-domain.com"
ADMIN_USERNAME="nexus-admin"
ADMIN_NAME="Site Administrator"
ADMIN_PASSWORD="PASTE_A_LONG_RANDOM_ADMIN_PASSWORD_HERE"
```

Generate `ADMIN_JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Security rules:

- Keep `DATABASE_URL`, `ADMIN_JWT_SECRET`, and all `ADMIN_*` seed values server-only.
- Only `NEXT_PUBLIC_APP_URL` is browser-safe. Do not put credentials or secrets in any `NEXT_PUBLIC_` variable.
- `NEXT_PUBLIC_SITE_URL` is accepted as a legacy alias, but new deployments should use `NEXT_PUBLIC_APP_URL`.
- Use a real domain email for `ADMIN_EMAIL`.
- Use a stable `ADMIN_USERNAME` with 3-32 lowercase letters, numbers, dots, underscores, or hyphens.
- Use a unique admin password with at least 12 characters.
- Do not reuse development secrets in production.
- Do not commit `.env`.
- Rotate `ADMIN_JWT_SECRET` if it is ever exposed. Existing admin sessions will become invalid after rotation.

The app validates required environment variables during server startup. Missing or malformed values fail fast with a clear server-side configuration error before the app accepts traffic.

## 7. Prisma Database Setup

Generate Prisma Client:

```bash
npm run db:generate
```

Apply production migrations:

```bash
npm run prod:migrate
```

Seed initial data and the super admin:

```bash
npm run db:seed
```

Important: `npm run db:seed` creates or updates the first `SUPER_ADMIN`, hashes the password with bcrypt, and revokes existing sessions for that admin. After the first login, manage additional admin access dynamically from `/fa/admin/users` or `/en/admin/users`; do not use seed data for day-to-day account creation.

To inspect the database:

```bash
npx prisma studio
```

On a remote server, do not expose Prisma Studio publicly. Use SSH tunneling if you need it.

## 8. Database Schema and Tables

The schema is defined in `prisma/schema.prisma` and migrations are stored in `prisma/migrations`.

### AdminUser

Purpose: admin accounts.

Columns:

- `id`: text primary key generated by Prisma CUID
- `email`: unique email
- `username`: unique login username
- `name`: display name
- `passwordHash`: bcrypt hash
- `role`: enum, `SUPER_ADMIN` or `EDITOR`
- `isActive`: boolean account status
- `createdAt`: created timestamp
- `updatedAt`: updated timestamp

Relations:

- One admin can have many `AdminSession` records.
- One admin can author many `BlogPost` records.

Operational notes:

- Only `SUPER_ADMIN` users can create, edit, or deactivate admin accounts from the website.
- Deactivating an account revokes its active sessions.
- The app blocks deactivating or demoting the final active `SUPER_ADMIN`.

### AdminSession

Purpose: revocable admin login sessions.

Columns:

- `id`: text primary key
- `tokenHash`: unique SHA-256 hash of the JWT `jti`
- `expiresAt`: session expiration
- `userId`: foreign key to `AdminUser`
- `createdAt`: created timestamp
- `updatedAt`: updated timestamp

Indexes:

- Unique index on `tokenHash`
- Index on `userId`
- Index on `expiresAt`

Behavior:

- Deleting an admin cascades and deletes their sessions.
- Logout deletes the matching session hash.
- Expired sessions are cleaned up during successful login and validation paths.

### Service

Purpose: public service pages and selectable services for requests.

Columns:

- `id`: text primary key
- `slug`: unique public slug
- `translations`: JSON localized content
- `icon`: optional icon key
- `sortOrder`: display ordering
- `published`: public visibility
- `isActive`: soft active flag
- `createdAt`: created timestamp
- `updatedAt`: updated timestamp

### Portfolio

Purpose: public case studies.

Columns:

- `id`: text primary key
- `slug`: unique public slug
- `translations`: JSON localized content
- `coverImage`: optional image path or URL
- `gallery`: optional JSON gallery data
- `technologies`: PostgreSQL text array
- `sortOrder`: display ordering
- `published`: public visibility
- `isActive`: soft active flag
- `createdAt`: created timestamp
- `updatedAt`: updated timestamp

### BlogPost

Purpose: public blog content.

Columns:

- `id`: text primary key
- `slug`: unique public slug
- `translations`: JSON localized content
- `coverImage`: optional image path or URL
- `published`: public visibility
- `publishedAt`: publication timestamp
- `isActive`: soft active flag
- `authorId`: optional foreign key to `AdminUser`
- `createdAt`: created timestamp
- `updatedAt`: updated timestamp

### LeadRequest

Purpose: captured contact/request leads.

Columns:

- `id`: text primary key
- `fullName`: requester name
- `phone`: requester phone
- `email`: optional email
- `company`: optional company name
- `serviceType`: requested service category
- `locale`: source locale, default `fa`
- `budget`: optional budget range
- `description`: request details
- `status`: enum workflow status
- `serviceId`: optional foreign key to `Service`
- `source`: optional source tag
- `metadata`: optional JSON metadata
- `createdAt`: created timestamp
- `updatedAt`: updated timestamp

Statuses:

```text
NEW
IN_REVIEW
CONTACTED
QUALIFIED
WON
LOST
ARCHIVED
```

## 9. Build the Application

Run:

```bash
npm run prod:build
```

The project uses:

```js
output: "standalone"
```

in `next.config.js`. After the build, `.next/standalone/server.js` is the production Node entrypoint. The `postbuild` script copies `.next/static` and `public` assets into the standalone bundle using a cross-platform Node script.

## 10. Run with PM2

The root `ecosystem.config.js` runs:

```text
.next/standalone/server.js
```

with:

```text
NODE_ENV=production
PORT=3000
HOSTNAME=127.0.0.1
```

Start the app:

```bash
npm run prod:start
npm run prod:status
npm run prod:logs
```

For local production testing, `npm run start` uses
`scripts/start-standalone.mjs`. It checks whether `.next/standalone/server.js`
exists and automatically runs `npm run build` when the standalone bundle is
missing. PM2 still uses `.next/standalone/server.js` directly, so production
deployments should run `npm run build` before `pm2 restart`.

Save the PM2 process list:

```bash
npm run prod:save
```

Enable PM2 startup on reboot:

```bash
pm2 startup systemd
```

PM2 prints a command that starts with `sudo env PATH=...`. Copy and run that command, then:

```bash
npm run prod:save
```

Useful PM2 commands:

```bash
pm2 restart it-services-agency
pm2 reload it-services-agency
pm2 stop it-services-agency
pm2 delete it-services-agency
pm2 logs it-services-agency --lines 100
pm2 monit
```

## 11. Configure Nginx Reverse Proxy

Create an Nginx server block:

```bash
sudo nano /etc/nginx/sites-available/it-services-agency
```

Example config:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/it-services-agency /etc/nginx/sites-enabled/it-services-agency
sudo nginx -t
sudo systemctl reload nginx
```

If the default site conflicts, disable it:

```bash
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 12. Enable SSL with Certbot

Make sure your DNS `A` record points to the VPS IP. Then run:

```bash
sudo certbot --nginx -d example.com -d www.example.com
```

Test renewal:

```bash
sudo certbot renew --dry-run
```

After SSL is active, update `.env`:

```env
NEXT_PUBLIC_APP_URL="https://example.com"
```

Rebuild and restart:

```bash
npm run build
pm2 restart it-services-agency
```

## 13. Deployment Update Workflow

For future releases:

```bash
cd /var/www/it-services-agency
git pull
npm ci
npm run prod:deploy
npm run prod:logs
```

Run a quick health check:

```bash
curl -I https://example.com
curl -I https://example.com/fa
curl -I https://example.com/en
```

## 14. Local Bring-Up Commands

For a clean local setup:

```bash
git clone <repository-url>
cd ItService
npm install
cp .env.example .env
```

Create the database:

```bash
createdb it_services
```

If `createdb` is not available, use PostgreSQL shell:

```bash
psql -U postgres
```

Then:

```sql
CREATE DATABASE it_services;
\q
```

Run setup:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/fa/admin/login
http://localhost:3000/en/admin/login
```

Windows PowerShell alternative:

```powershell
npm.cmd install
npm.cmd run db:generate
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

## 15. Verification Commands

Run before deployment:

```bash
npm run type-check
npm run lint
npm run test:env
npm run prod:build
```

Optional smoke tests:

```bash
npm run test:lead
npm run test:content
npm run test:auth
```

Production process checks:

```bash
pm2 status
pm2 logs it-services-agency --lines 100
sudo systemctl status nginx
sudo nginx -t
```

Database checks:

```bash
sudo -u postgres psql -d it_services -c '\dt'
sudo -u postgres psql -d it_services -c 'SELECT COUNT(*) FROM "LeadRequest";'
```

## 16. Backups

Create a manual database backup:

```bash
mkdir -p ~/backups
pg_dump "$DATABASE_URL" > ~/backups/it_services_$(date +%F_%H-%M).sql
```

Restore a backup:

```bash
psql "$DATABASE_URL" < ~/backups/backup_file.sql
```

For production, automate backups with cron and store encrypted copies off-server.

## 17. Troubleshooting

If the app does not start:

```bash
pm2 logs it-services-agency --lines 200
```

If migrations fail:

```bash
npx prisma migrate status
npx prisma migrate deploy
```

If Nginx returns 502:

```bash
pm2 status
curl http://127.0.0.1:3000
sudo nginx -t
sudo systemctl reload nginx
```

If admin login fails:

```bash
npm run db:seed
```

Then confirm `.env` contains the expected:

```text
ADMIN_EMAIL
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_JWT_SECRET
DATABASE_URL
NEXT_PUBLIC_APP_URL
```

If all users are redirected from admin pages, confirm `ADMIN_JWT_SECRET` is set and unchanged since login. Changing the JWT secret invalidates existing cookies.
