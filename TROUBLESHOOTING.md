# Troubleshooting: CORS Error / Server Not Running

## Problem
You're seeing CORS errors with status (null), which means the backend server isn't running or isn't responding.

## Quick Fix Steps

### 1. Add Supabase Credentials to .env

Your `.env` file exists but is missing the Supabase credentials. Add these lines to `server/.env`:

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**To find these values:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** > **API**
4. Copy the **Project URL** → This is your `SUPABASE_URL`
5. Copy the **anon public** key → This is your `SUPABASE_ANON_KEY`

### 2. Run Database Migration

Before starting the server, make sure you've created the table in Supabase:

1. Go to Supabase Dashboard → Your Project
2. Click **SQL Editor**
3. Copy the contents of `supabase/migrations/001_create_subscriptions_table.sql`
4. Paste and click **Run**

### 3. Install Dependencies (if not done)

```bash
cd server
npm install
```

### 4. Start the Server

```bash
# From the root directory
npm run server

# OR from the server directory
cd server
npm run dev
```

### 5. Verify Server is Running

You should see:
```
🚀 Server running on port 3001
📊 API available at http://localhost:3001/api
🔗 CORS enabled for all origins
✅ Connected to Supabase successfully
```

If you see a warning about database connection, check your `.env` file and Supabase setup.

## Common Issues

### "Missing Supabase environment variables"
- Make sure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are in `server/.env`
- No quotes needed around the values
- No spaces around the `=` sign

### "Error connecting to Supabase"
- Verify your Supabase project is active
- Check that you've run the migration SQL
- Ensure the credentials are correct

### "Table does not exist"
- Run the migration SQL in Supabase SQL Editor
- Check that the table name is `subscriptions` (lowercase)

### Server still not starting
- Check the terminal for error messages
- Make sure port 3001 is not already in use
- Try: `lsof -ti:3001` to see if something is using the port
