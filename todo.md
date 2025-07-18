You are working in a standalone Next.js 14 (App Router) project.

🟢 Goal of this task
Implement **user registration & login** screens and a minimal auth layer that
can talk to an external NestJS API running at http://localhost:3001.

🔹 Requirements

1. Pages
   • `/register` – form (`email`, `password`, `confirmPassword`)  
   • `/login`   – form (`email`, `password`)  
   Both pages are Client Components, styled with Tailwind + shadcn/ui.

2. API calls
   - Base URL is **process.env.NEXT_PUBLIC_API_BASE_URL**  
     (in dev this will be `http://localhost:3001/api/v1`).
   - Use **fetch** with `credentials: 'include'` so cookies sent by the API
     are stored automatically.

2.5. Types

- Create `src/types/user.ts` containing a Zod schema `userSchema`
  (fields: id, email, displayName, character) and
  `export type User = z.infer<typeof userSchema>;`.
- Re‑use `userSchema` to validate the JSON returned by `/auth/me`
  and in the Login/Register mutation responses.

3. AuthProvider
   - Create `AuthContext` that exposes `login()`, `logout()`, `user`,
     `isAuthenticated`, `loading`.
   - `login()` calls `POST /auth/login` → API sets an **Http‑Only cookie**
     named `access_token` (`SameSite=Lax; Secure=false` in dev).  
     No token is stored in localStorage.
   - On initial page load, call `/auth/me` to hydrate `user` state.
   - Add `<AuthGuard>` HOC or Route Handler middleware that redirects to
     `/login` when the user is not authenticated for protected routes
     (`/me`, `/races/new`, `/bets/**`, etc.).

4. Error handling
   - Display shadcn `Toast` on API errors (invalid creds, 409 email already
     used, etc.).

5. Env & docs
   - Add `.env.example` with `NEXT_PUBLIC_API_BASE_URL=`.
   - Update README with “Start dev”:  
     `pnpm dev` (front), `pnpm start` (back) (in their own repos).

6. Testing
   - Create one jest/vitest test that renders the Login form and asserts the
     email/password fields exist.

🛑 Do NOT change Docker files here; the API runs separately.
All new code must pass `pnpm test`.
