# Portal Base (Next.js 15 + shadcn/ui)

Auth-first app shell: shadcn **login-01** (`/login`) and **dashboard-01** (`/`).  
UI: `src/components/ui` (shadcn), `molecules/`, `organisms/`, `common/`.  
Types: `packages/models` (`auth`, `user`, `common`).

## Quick start

```bash
pnpm install
pnpm dev
```

Default port: `3000`.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build |
| `pnpm test:unit` | Vitest |
| `pnpm test:e2e` | Playwright |
| `pnpm ui:add` | Add shadcn components |

## Auth

Routes: `/login`, `/` (protected). Cookie: `auth_token`.

**Local auth** (`NEXT_PUBLIC_USE_LOCAL_AUTH=true`, see `.env.example`): Next `/api/auth/*` — user **vutv** / `tvvu.150591@gmail.com` (password `LOCAL_AUTH_PASSWORD`, default `vutv`).

**External API**: `NEXT_PUBLIC_USE_LOCAL_AUTH=false` and set `NEXT_PUBLIC_API_URL`.
