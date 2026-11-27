# SalesPilot AI

English-language lead management MVP for service businesses. AI automation is not implemented yet.

## Setup
Use Node.js 22. Install dependencies with npm install.
Copy .env.example to .env.local and supply your Supabase project URL and publishable key. Never commit credentials.
Apply the database migrations to a new Supabase project before registering users. Existing projects that already ran the migrations should not repeat them.
Run npm run dev for local development.

## Deployment
Import this private repository into a Next.js-compatible host. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in its environment settings. Configure the deployed URL as the Supabase Auth Site URL and allow its /auth/callback redirect.
Verify registration, email confirmation, sign-in, lead creation, status updates, sign-out and isolation between two independent accounts before inviting customers.
CI checks TypeScript and the production build, not live database behavior.
