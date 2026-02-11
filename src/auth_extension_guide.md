# Authentication Extension Guide (Astro + Astro DB + Arctic)

This document provides **clear, specific, professional instructions** to extend your current authentication system so users can:

1. Create an account with **email + password** (no social provider required)
2. **Link OAuth providers** (Google/Twitch/etc.) later to the same user

---

## 1) Goal and Design Principle

Your current architecture is already correct:

- **User** = internal identity
- **Account** = login methods (OAuth, password)
- **Session** = active login session

To support email/password accounts, you will add a new provider type:

- `provider = "password"` (recommended)

This keeps the system scalable and consistent.

---

## 2) Database Changes (Astro DB)

### 2.1 Update the `Account` table

Your `Account` table currently supports OAuth with:

- `provider`
- `providerAccountId`
- `userId`

To support email/password login, add:

- `email` *(nullable string)*
- `passwordHash` *(nullable string)*

#### Recommended provider values
Use consistent provider names across your system:

- `"google"`
- `"twitch"`
- `"facebook"`
- `"twitter"`
- `"password"`

### 2.2 Required constraints

You must enforce these uniqueness rules:

1. `UNIQUE(provider, providerAccountId)`  
   - Prevents the same OAuth identity from being linked twice.

2. `UNIQUE(email)` **only for local/password accounts** *(recommended)*  
   - Prevents duplicate local accounts using the same email.

> Note: If Astro DB cannot enforce a partial unique index, you can enforce it at the application level:
> - Only check uniqueness for `provider="password"`.

---

## 3) Add Password Hashing Utilities

### 3.1 Choose a secure hashing algorithm
Use one of:

- **Argon2** (preferred)
- **bcrypt** (acceptable)

### 3.2 Create a password utility module

Create:

- `src/lib/password.ts`

It must expose:

- `hashPassword(password: string): Promise<string>`
- `verifyPassword(password: string, hash: string): Promise<boolean>`

### 3.3 Security rules
- Never store raw passwords.
- Never store passwords in the `User` table.
- Never log passwords.
- Store only `passwordHash` in `Account`.

---

## 4) Implement Local Registration (Email + Password)

### 4.1 Create a register page
Create:

- `src/pages/[lang]/register.astro`

This page must include a form that submits via `POST` to:

- `/api/auth/register`

### 4.2 Create the registration endpoint
Create:

- `src/pages/api/auth/register.ts`

### 4.3 Registration steps (required order)

1. Read `email`, `password`, and optionally `username`.
2. Validate input:
   - email format
   - password minimum length (recommend **8+**, ideally **10+**)
3. Check if a local account already exists:
   - `Account.provider = "password"`
   - `Account.email = email`
4. If it exists → return `409 Conflict`
5. Create a new `User` row
6. Hash the password using `hashPassword(password)`
7. Create a new `Account` row:
   - `provider = "password"`
   - `providerAccountId = email` *(or a random ID; email is simplest)*
   - `email = email`
   - `passwordHash = <hashed password>`
   - `userId = user.id`
8. Create a session:
   - call your existing `createSession(user.id)`
9. Set the `session_id` cookie
10. Redirect to dashboard/home

---

## 5) Implement Local Login (Email + Password)

### 5.1 Create a login page
Create:

- `src/pages/[lang]/login.astro`

This page must submit via `POST` to:

- `/api/auth/login`

### 5.2 Create the login endpoint
Create:

- `src/pages/api/auth/login.ts`

### 5.3 Login steps

1. Read `email` and `password`
2. Find an `Account` where:
   - `provider = "password"`
   - `email = email`
3. If not found → return `401 Unauthorized`
4. Verify password:
   - `verifyPassword(password, account.passwordHash)`
5. If invalid → return `401 Unauthorized`
6. Create a session:
   - `createSession(account.userId)`
7. Set the `session_id` cookie
8. Redirect user

---

## 6) Ensure OAuth Linking Works With Local Accounts

You already have account-linking logic:

> If the user is already logged in and starts OAuth with another provider, link the provider to the current user.

This must work the same whether the user logged in using:

- a password account, or
- an OAuth account

### 6.1 Required behavior in OAuth callback

In your OAuth callback handler:

- If `context.locals.user` exists:
  - Create a new `Account` row for the OAuth provider
  - Set `userId = context.locals.user.id`
  - Do **not** create a new `User`
  - Optionally keep the current session or rotate session

---

## 7) Prevent Duplicate Provider Linking

When linking providers, you must prevent this:

- The same Google account being linked to two different users.

### Required behavior
If `(provider, providerAccountId)` already exists for another user:

- Return `409 Conflict`  
  OR  
- Show a friendly message:
  - “This Google account is already linked to another user.”

---

## 8) Optional (Recommended): Auto-Link by Email

### Problem
A user registers locally using:

- `user@gmail.com`

Later they click “Login with Google” while logged out, and Google returns:

- the same email

Without auto-linking, your system may create a duplicate user.

### Strategy A (Simple, recommended initially)
Only link accounts when the user is already logged in.

Pros:
- Easy
- Safe

Cons:
- Can create duplicate accounts

### Strategy B (More professional)
If OAuth returns a **verified email** and it matches an existing local account:

- automatically link the OAuth account to the existing user
- log them into that same user

Requirements:
- The provider email must be verified (Google provides this)
- You must trust the provider email as identity

---

## 9) Add a “Linked Accounts” Settings Page (Recommended)

Create:

- `/dashboard/settings/accounts`

This page should display:

- Which providers are linked (Google, Twitch, etc.)
- Whether a password login exists
- Buttons:
  - “Link Google”
  - “Link Twitch”
  - “Add password”
  - “Change password”
  - “Unlink provider” *(optional)*

---

## 10) Password Management (Recommended)

### 10.1 Add a password to an OAuth-only user
If a user signed up with Google, they may later want password login.

Support this by allowing:

- setting a password from settings
- creating an `Account` row:
  - `provider="password"`
  - `email=<user email>`
  - `passwordHash=<hash>`

### 10.2 Change password
Create:

- `/api/auth/change-password`

Requirements:
- Must require an active session
- Must verify old password first (if a password exists)
- Must replace `passwordHash`

---

## 11) Security Checklist (Required)

### 11.1 Cookies (`session_id`)
Ensure:

- `httpOnly: true`
- `secure: true` in production
- `sameSite: "lax"` (recommended)
- `path: "/"`

### 11.2 Password rules
- Minimum 8 characters (recommend 10+)
- Never return password hashes in API responses
- Never log passwords

### 11.3 Sessions
- Keep your 30-day session expiration
- On logout:
  - delete session from DB
  - clear cookie

---

## 12) Summary: What You Need to Build

### Database
- Add `email` and `passwordHash` to `Account`

### Pages
- `/register`
- `/login`
- `/dashboard/settings/accounts` *(recommended)*

### API routes
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/change-password` *(recommended)*

### Reuse existing logic
- `createSession()`
- `validateSession()`
- OAuth callback flow
- account linking flow

---

**End of document**
