# Mushroom Bet App

A Next.js 14 application with user authentication that connects to an external NestJS API.

## Features

- **User Registration & Login** with email/password
- **Client-side authentication** using React Context
- **HTTP-Only cookies** for secure token storage
- **Protected routes** with middleware
- **Form validation** with Zod schemas
- **Error handling** with toast notifications
- **Responsive UI** with Tailwind CSS and shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A NestJS API running on `http://localhost:3001/api/v1`

### Environment Setup

1. Copy the environment example file:

```bash
cp .env.example .env.local
```

2. Update the environment variables:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

### Development

1. Install dependencies:

```bash
bun install
# or
npm install
```

2. Start the development server:

```bash
bun dev
# or
npm run dev
```

3. Start your NestJS backend (in a separate terminal/repo):

```bash
# In your backend repository
npm start
# or
bun start
```

4. Open [http://localhost:3000](http://localhost:3000) to see the application.

### Available Routes

- `/` - Home page
- `/login` - User login form
- `/register` - User registration form
- `/me`, `/races/*`, `/bets/*` - Protected routes (require authentication)

### Testing

Run the test suite:

```bash
bun test
# or
npm test
```

Run tests with UI:

```bash
bun test:ui
# or
npm run test:ui
```

### API Integration

This frontend expects your NestJS backend to provide the following endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user profile

The backend should:

- Set HTTP-Only cookies named `access_token`
- Use `SameSite=Lax; Secure=false` in development
- Return user objects with: `id`, `email`, `displayName`, `character`

### Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Context
- **Validation:** Zod
- **Testing:** Vitest + React Testing Library
- **Notifications:** Sonner (toast)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/auth/       # API routes (proxy to backend)
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   └── layout.tsx      # Root layout with providers
├── components/ui/      # shadcn/ui components
├── lib/
│   ├── auth.ts         # Authentication context & logic
│   └── utils.ts        # Utility functions
├── types/
│   └── user.ts         # User type definitions with Zod
└── middleware.ts       # Route protection middleware
```
