# My Website Backend API

This is the backend API for the My Web Dev Company website.

## Features

- Authentication with JWT
- Article management (CRUD operations)
- Contact form with email sending
- reCAPTCHA verification
- Image upload with Cloudinary
- Security features (CORS, rate limiting, etc.)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- SMTP server for sending emails
- reCAPTCHA API keys

## Installation

1. Clone the repository
2. Navigate to the backend directory: `cd my-website/backend`
3. Install dependencies: `npm install`
4. Configure the required environment variables in `.env` (never commit this file)
5. For an existing database, execute `config/migrations/001_auth_sessions_and_roles.sql` **once** before deploying this version. It creates the refresh-session table and converts the legacy `user` role to `redacteur`.
6. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

Authentication uses `HttpOnly` access and refresh cookies. Browser clients must
send requests with credentials and may not expect a bearer token in the JSON
response. State-changing authentication and administration requests must come
from an allowed `Origin`.

### Dashboard authorization

- `admin`: can list, create and delete articles.
- `redacteur`: can list and create articles. The current API exposes no update
  route; if one is added, protect it with `protect`, `restrictTo("admin", "redacteur")`
  and the trusted-origin middleware.

The single dashboard account should be assigned the `admin` role if deletion is
required.

### Articles

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `GET /api/articles/:id/prev` - Get previous article
- `GET /api/articles/:id/next` - Get next article
- `POST /api/articles` - Create new article (admin only)
- `PATCH /api/articles/:id` - Update article (admin only)
- `DELETE /api/articles/:id` - Delete article (admin only)

### Contact

- `POST /api/contact` - Send contact email

### reCAPTCHA

- `POST /api/recaptcha/verify` - Verify reCAPTCHA token

## Environment Variables

The deployment must provide the following security settings in addition to the
database configuration:

- `NODE_ENV=production` for every public deployment. This makes authentication
  cookies `Secure`.
- `JWT_ACCESS_EXPIRES_IN` and `JWT_REFRESH_EXPIRES_IN` with explicit units,
  for example `15m` and `1h`.
- `JWT_ISSUER` and `JWT_AUDIENCE` (stable deployment-specific values). Defaults
  exist for local compatibility, but explicit production values are preferred.
- `FRONTEND_URL=https://…` and optionally `CORS_ALLOWED_ORIGINS` as a
  comma-separated allowlist for additional frontends.
- `TRUST_PROXY` only when its value exactly matches the reverse proxy topology;
  do not set it to an unrestricted value blindly.

### Contact email

For production, configure the SMTP mailbox with:

- `MAILBOX_PROD_HOST`
- `MAILBOX_PROD_PORT` (`465` by default; use `587` when required by the
  provider)
- `MAILBOX_PROD_ADDRESS`
- `MAILBOX_PROD_PASSWORD`

`MAILBOX_PROD_ADRESS` (the legacy misspelling) remains supported temporarily,
but should be renamed to `MAILBOX_PROD_ADDRESS` in every deployment secret.
For local development, use `MAILBOX_DEV_ADDRESS` and
`MAILBOX_DEV_PASSWORD`; `MAILBOX_DEV_ADRESS` is also accepted temporarily.
The SMTP transport is selected exclusively through `NODE_ENV=production`, not
from the request host name. Local Gmail development temporarily accepts the
certificate injected by Avast Mail Shield; production SMTP always validates
the certificate.

Run `npm test` before deployment. The suite covers the secret-redaction,
trusted-origin and role-authorization middleware.

### Article publication in production

`SITE_PUBLIC_ROOT` must be the absolute filesystem path of the frontend build
directory served by `https://helveclick.ch` (normally the deployed `dist`
directory). It must contain `fr/articles-list.html` and
`en/articles-list.html`, be writable by the API process, and persist after an
API restart. `public` is a source/build directory name; it is never part of a
public URL.

The runtime rebuilds article entries in `sitemap.xml` from the HTML files in
`fr/articles` and `en/articles` after every article creation or deletion. The
sitemap is expected in `SITE_PUBLIC_ROOT`; set `SITE_SITEMAP_PATH` only when it
is stored elsewhere.

If the API and frontend are deployed on different hosts without a shared,
persistent volume, an API process cannot write SEO pages into the frontend
deployment. In that architecture, use a shared volume or a deployment/storage
publication step before enabling runtime article publication.
