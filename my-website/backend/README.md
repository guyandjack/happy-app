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
4. Create a `.env` file based on the `.env.example` file
5. Start the server:
   - Development mode: `npm run dev`
   - Production mode: `npm start`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

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

See the `.env.example` file for required environment variables.

### Article publication in production

`SITE_PUBLIC_ROOT` must be the absolute filesystem path of the frontend build
directory served by `https://helveclick.ch` (normally the deployed `dist`
directory). It must contain `fr/articles-list.html` and
`en/articles-list.html`, be writable by the API process, and persist after an
API restart. `public` is a source/build directory name; it is never part of a
public URL.

If the API and frontend are deployed on different hosts without a shared,
persistent volume, an API process cannot write SEO pages into the frontend
deployment. In that architecture, use a shared volume or a deployment/storage
publication step before enabling runtime article publication.
