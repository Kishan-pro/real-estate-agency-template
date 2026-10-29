# Kishan Real Estate

React + Vite + Tailwind front end, Supabase for database, auth and photo storage. Hosted on Netlify.

## Run locally
```
cd frontend
cp .env.example .env     # fill in the Supabase URL (no /rest/v1) and anon key
npm install
npm run dev              # http://localhost:3000
```

## Supabase setup (SQL Editor, in order)
1. `frontend/supabase/schema.sql`
2. `frontend/supabase/02_catalog.sql`
3. `frontend/supabase/03_dashboard.sql`
4. Authentication -> Users: create the owner; turn off public sign-ups.
5. Demo data (optional, from `frontend/`, PowerShell):
   ```
   $env:OWNER_EMAIL="..."; $env:OWNER_PASSWORD="..."
   node --env-file=.env scripts/seed.mjs         # 6 properties, photos, testimonials, owner photo
   node --env-file=.env scripts/seed-leads.mjs   # ~40 sample leads (notes start with [demo]); add --clear to reset
   ```

## Deploy
Netlify reads `netlify.toml`. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the site's environment variables and redeploy.

`npm run build` also runs `scripts/prerender.mjs`, which writes a page per property with its own title, share preview (WhatsApp/Facebook), structured data, `sitemap.xml` and `robots.txt`. It uses Netlify's `URL` variable for the site address (locally set `VITE_SITE_URL`). New or edited properties appear in previews and the sitemap after the next deploy; trigger one from Netlify (Deploys -> Trigger deploy) or with a build hook.
