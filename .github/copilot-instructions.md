# Copilot Instructions — ecommerce-admin-dashboard

Purpose: Help AI agents be immediately productive in this Next.js + Mongoose admin dashboard.

- Project type: Next.js (App Router) application with server and client components under `app/`.
- Data layer: Mongoose models in `models/` and a reusable connection helper in `lib/db.ts`.
- API surface: Route handlers are in `app/api/*/route.ts` and return `NextResponse.json(...)`.

Quick start (development):

- Run: `npm run dev` (starts Next.js on localhost:3000).
- Env: `MONGODB_URI` must be set for DB operations (used by `lib/db.ts`).

Architecture notes (what to know first):

- App Router: files in `app/` are server components by default. Client components must include `"use client"` (see `app/products/new/page.tsx`).
- API routes: Implement CRUD in `app/api/products/route.ts`. Always call `connectDB()` (from `lib/db.ts`) before any Mongoose operation to ensure a connection.
- Models: Mongoose schemas are defined in `models/Product.ts`. Product shape includes `title`, `description`, `price`, `stock`, `imageUrl`, `category`, `sold`, plus timestamps.

Common patterns and conventions:

- DB connect guard: `lib/db.ts` checks `mongoose.connection.readyState` before connecting — reuse this pattern for other models.
- API responses: Prefer `NextResponse.json(payload, { status })` for both success and error replies. Error responses include `{ error: "..." }` and appropriate status codes.
- Client → API: Frontend uses `axios` against `/api/...` (example: `app/products/new/page.tsx` posts to `/api/products`). Use relative paths.
- Client components: Any file that uses React state, effects, or browser-only APIs must have `"use client"` at the top.
- Type conversions: Parse numeric inputs on the client (e.g., `Number(price)`) before sending to the API to match the Mongoose schema.

Key integration points:

- `lib/db.ts` — central DB connection. Ensure `MONGODB_URI` exists in environment when running server-side code.
- `models/Product.ts` — canonical source of truth for product fields. When changing product fields, update front-end forms and API handlers together.
- `app/api/products/route.ts` — shows how CRUD is exposed; follow its structure when adding new API endpoints (GET, POST, PUT, DELETE exported functions).

Dependencies to be aware of:

- `mongoose` for DB models.
- `next-auth` is installed (auth flow may be present elsewhere); check `app/login` and future auth middleware.
- `cloudinary`, `react-hook-form`, `zod` — libraries available for image uploads and validation; adopt them where stricter validation is needed.

Files to inspect for examples:

- `lib/db.ts` — DB connection helper.
- `models/Product.ts` — product schema.
- `app/api/products/route.ts` — full CRUD example for products.
- `app/products/new/page.tsx` — client-side form posting to the API.

Agent guidance (how to make changes safely):

- When editing models, update API handlers and client forms in the same change to keep shape consistent.
- Preserve `connectDB()` usage in any server-side code that accesses MongoDB.
- Prefer small, focused PRs that change one area: schema, API, or UI; include example requests/responses in PR description.
- Do not assume server environment variables are present — add clear error messages and guards (see `lib/db.ts`).

If you need more context, ask for:

- missing env values for reproducing DB behavior locally (`MONGODB_URI`),
- any auth requirements or middleware expected around API routes,
- which pages should be converted to client components when adding browser-only logic.

— End
