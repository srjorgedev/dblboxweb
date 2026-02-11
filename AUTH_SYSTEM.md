# Authentication System Documentation

This document explains the authentication architecture and flow of the **dblboxweb** project. The system uses **Astro DB** for data persistence and **Arctic** for OAuth2 integration.

## 1. Database Schema (Astro DB)

The authentication system relies on three main tables defined in `db/config.ts`:

### `User`
Stores the core profile information for users.
- `id`: Unique identifier (UUID/NanoID).
- `username`: The display name of the user.
- `avatar`: URL to the user's profile picture (optional).
- `role`: User permissions (default: `"user"`).

### `Account`
Links external OAuth providers to a specific `User`. This allows a single user to link multiple login methods (Google, Twitch, etc.).
- `provider`: The name of the OAuth provider (e.g., `"google"`).
- `providerAccountId`: The unique ID provided by the external service.
- `userId`: Reference to the `User` table.
- **Index**: Unique combination of `provider` and `providerAccountId`.

### `Session`
Manages active user sessions.
- `id`: Randomly generated session ID (stored in client cookies).
- `userId`: Reference to the `User` table.
- `expiresAt`: Expiration timestamp (set to 30 days by default).

---

## 2. Authentication Flow

### A. Initiation (Login Start)
Located in `src/pages/login/[provider]/index.ts`.
1. Generates a `state` and `codeVerifier` (for PKCE).
2. Stores these values in secure, `httpOnly` cookies (`google_oauth_state`, `google_code_verifier`).
3. Redirects the user to the provider's authorization URL.

### B. Callback (Handling the return)
Located in `src/pages/login/[provider]/callback.ts`.
1. Retrieves `code` and `state` from the URL parameters.
2. Validates the `state` against the stored cookie to prevent CSRF.
3. Uses the `codeVerifier` and `code` to exchange them for an Access Token via the provider.
4. Fetches the user's profile (name, email, avatar) using the Access Token.
5. Calls `loginOrRegister()` to finalize the process.

### C. Internal Logic (`loginOrRegister`)
Defined in `src/lib/auth-actions.ts`, this function handles three scenarios:
1. **Returning User**: Finds an existing `Account`. Creates a new session for the associated `User`.
2. **Account Linking**: If the user is already logged in (checked via middleware) and logs in with a new provider, it links the new `Account` to the `currentUserId`.
3. **New User**: Creates a new `User` entry and a corresponding `Account` entry, then creates a session.

---

## 3. Session Management

### Creation
- When a user logs in, `createSession(userId)` generates a `nanoid()`.
- The session is saved in the DB with a 30-day expiration.
- The `session_id` is sent to the browser as an `httpOnly`, `secure` cookie.

### Validation
- On every request, the `middleware.ts` retrieves the `session_id`.
- `validateSession(sessionId)` checks the DB:
    - If the session exists and is NOT expired: returns the `user` and `session` objects.
    - If expired: deletes the session from the DB and returns `null`.

---

## 4. Middleware and Access Control

The file `src/middleware.ts` manages access and populates request context:

- **Locals**: Injected into `Astro.locals` so they are available in all `.astro` files and API routes:
    - `context.locals.user`: The current user object (or `null`).
    - `context.locals.session`: The current session object (or `null`).

### Route Protection
The middleware currently protects the `/dashboard` routes:
- If no user is present, it redirects to `/[lang]/login`.
- **Note**: There is a current check `user.role !== "user"` which seems intended to restrict access to Admins, but based on the error message "Admin role required", it might need review if the default role is "user".

---

## 5. Logout
Handled by `src/pages/api/logout.ts`:
1. Deletes the session entry from the `Session` table in the DB.
2. Deletes the `session_id` cookie from the browser.
3. Redirects the user to the homepage.
