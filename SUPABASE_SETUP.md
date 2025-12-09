# Supabase Setup Guide

This guide will help you set up Supabase for your Subscription Tracker application and connect it to Cursor via MCP.

## Prerequisites

- ✅ Supabase account (you already have one)
- ✅ Supabase Personal Access Token (you mentioned you already created one)

## Step 1: Configure MCP Server in Cursor

1. Open the `.cursor/mcp.json` file in this project
2. Replace `YOUR_SUPABASE_ACCESS_TOKEN_HERE` with your actual Supabase Personal Access Token
3. Save the file
4. **Restart Cursor IDE** for the changes to take effect

## Step 2: Create Supabase Project (if not already created)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Note your project URL and anon key (you'll need these later)

## Step 3: Run Database Migrations (subscriptions + users/ownership)

Run both migrations to create the `subscriptions` table and the new `users` table + ownership foreign key:

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_create_subscriptions_table.sql` and run it
4. Copy the contents of `supabase/migrations/002_add_users_and_subscription_ownership.sql` and run it

### Option B: Using Supabase CLI

If you have Supabase CLI installed:

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 4: Verify MCP Connection

1. After restarting Cursor, go to **Settings** > **Cursor Settings** > **MCP & Integrations**
2. Verify that the Supabase MCP server is listed and shows as active
3. You should now be able to interact with your Supabase database through Cursor

## Step 5: Configure Environment Variables

The application code has been updated to use Supabase. You need to set up environment variables:

### For Local Development

1. Create a `.env` file in the `server/` directory:
   ```bash
   cd server
   cp .env.example .env  # If you have an example file
   ```

2. Add your Supabase credentials (backend):
   ```
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key-here
   ```
   - `SUPABASE_SERVICE_ROLE_KEY` is required so the server can verify JWTs and upsert user profiles. Keep it server-side only.

3. Add your Supabase credentials (frontend) in `client/.env`:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. Find these values in your Supabase dashboard:
   - Go to **Settings** > **API**
   - Copy the **Project URL** (SUPABASE_URL / REACT_APP_SUPABASE_URL)
   - Copy the **anon public** key (SUPABASE_ANON_KEY / REACT_APP_SUPABASE_ANON_KEY)
   - Copy the **service_role** key (SUPABASE_SERVICE_ROLE_KEY) — do not expose this to the client

### For Production (Render.com)

1. Go to your Render dashboard
2. Select your backend service (`subscription-tracker-backend`)
3. Navigate to **Environment** tab
4. Add these environment variables:
   - `SUPABASE_URL` = Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
   - `SUPABASE_ANON_KEY` = Your Supabase anon key
5. For the frontend, set build-time env vars:
   - `REACT_APP_SUPABASE_URL` = Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `REACT_APP_API_URL` = URL of your deployed backend (e.g., `https://your-backend.onrender.com/api`)

**Note:** The code migration is already complete! The application now uses Supabase instead of SQLite.

## Database Schema

### `users`
- `id` - UUID primary key referencing `auth.users(id)` (same as Supabase Auth user id)
- `email` - User email (unique, not null)
- `created_at` / `updated_at` - Timestamps with trigger-managed `updated_at`

### `subscriptions`
- `id` - UUID primary key
- `user_id` - UUID foreign key to `users(id)`, cascade delete
- `name` - Subscription name (TEXT, NOT NULL)
- `frequency` - Billing frequency: 'monthly', 'yearly', or 'custom' (TEXT, NOT NULL)
- `amount` - Subscription cost (DECIMAL(10, 2), NOT NULL)
- `start_date` - When the subscription started (DATE, NOT NULL)
- `created_at` / `updated_at` - Timestamps with trigger-managed `updated_at`

## Notes

- The migration includes automatic `updated_at` timestamp updates via a trigger
- Indexes are created on `frequency` and `created_at` for better query performance
- Uses PostgreSQL types optimized for cloud hosting

## Troubleshooting

### MCP Server not connecting:
- Make sure you've restarted Cursor after updating `mcp.json`
- Verify your access token is correct
- Check Cursor Settings > MCP & Integrations for error messages

### Migration errors:
- Ensure you're running the migration in the correct Supabase project
- Check that you have the necessary permissions in your Supabase project
- Verify the SQL syntax is correct

## Deployment to Render.com

Your `render.yaml` has been updated to include a backend service. Follow these steps:

1. **Run the database migration** in Supabase (Step 3 above) before deploying
2. **Set environment variables** in Render dashboard:
   - Go to your backend service in Render
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
3. **Update frontend API URL** in `render.yaml`:
   - After deploying, update `REACT_APP_API_URL` to match your backend service URL
4. **Deploy** - Push your changes to trigger a new deployment

## Next Steps

Once set up, you can:
- ✅ Query your Supabase database directly through Cursor
- ✅ Use AI assistance to write queries and manage your database
- ✅ Deploy to production with persistent data storage
- ✅ Scale your application without database file issues

