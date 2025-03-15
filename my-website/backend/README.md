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