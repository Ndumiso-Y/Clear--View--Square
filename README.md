# Clearview Square Shopping Centre Website

Convenience shopping centre website for Clearview Square in Rustenburg, South Africa.

## Requirements
- **Node.js**: `>=22.12.0` (as defined in `package.json` engines)

## Setup & Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```

## Data Management
The website uses flat JSON files located in the `public/data/` directory to manage dynamic tenant catalog and promotions data.
- **Stores Database**: `public/data/stores.json`
- **Promotions Feed**: `public/data/promotions.json`

### Data Validation
Before building or committing changes to the data schemas, run the automated validation suite to ensure integrity:
```bash
npm run validate:data
```

## Production Builds (Multi-Host Deployment)
To support different hosting environments and base paths, use the following build scripts:

- **Standard Build** (Builds to `/`):
  ```bash
  npm run build
  ```
- **GitHub Pages** (Builds to `/Clear--View--Square/` base path):
  ```bash
  npm run build:gh
  ```
- **Vercel**:
  ```bash
  npm run build:vercel
  ```
- **Netlify**:
  ```bash
  npm run build:netlify
  ```
- **cPanel**:
  ```bash
  npm run build:cpanel
  ```

Outputs are compiled into the `dist/` directory.

## Supabase Integration (Phase 4B)

Public pages (Stores, Store detail, Promotions) read live data from Supabase when environment variables are configured. If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are absent, the site falls back to the local JSON files automatically — no code change required.

### Required frontend environment variables
Add to `.env` (gitignored — never commit real values):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Seeding Supabase from JSON
Run once after applying `supabase/schema.sql` and `supabase/rls-policies.sql` to a new project:
```bash
npm run seed:supabase
```
Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env`. The service role key must **never** be prefixed with `VITE_` and must **never** appear in any `src/` file.

### Verifying the seed
```bash
npm run verify:supabase
```
Checks public store count (29), hidden store exclusion, promotion count, and that anonymous writes are rejected.

### Supabase SQL files
SQL foundation files are in `/supabase/`:
- `schema.sql` — table definitions
- `rls-policies.sql` — row level security policies
- `storage-policies.sql` — storage bucket policies
- `seed-notes.md` — migration strategy and field mapping reference

**Preferred production host for CMS/admin:** Vercel.
**GitHub Pages** remains supported for public/static builds only.

## Features
- Reusable, standardized components with dynamic data utilities.
- Fully keyboard and screen-reader accessible forms with POPIA compliance.
- Interactive Weather Widget and AI Assistant.
