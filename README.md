# Subscription Tracker

A simple web application to track and manage your recurring subscriptions.

## About

Subscription Tracker is a full-stack web application designed to help individuals and families monitor and manage their recurring subscription services. In an era where subscription-based services have become ubiquitous—from streaming platforms and software licenses to gym memberships and meal delivery services—it's easy to lose track of how much you're spending each month or year.

This application provides a centralized solution to:

- **Track all subscriptions** in one place with essential details like name, cost, billing frequency, and start date
- **Calculate spending insights** including total yearly costs and average monthly expenses
- **Organize subscriptions** with flexible sorting options to identify the most expensive services or review billing frequencies
- **Make informed decisions** about which subscriptions to keep, cancel, or modify based on comprehensive cost analysis

Built with modern web technologies, Subscription Tracker features a clean, responsive user interface that works seamlessly across desktop and mobile devices. The application uses a React frontend with a Node.js/Express backend connected to Supabase (PostgreSQL), providing a smooth user experience with real-time data updates and persistent cloud storage.

Whether you're trying to optimize your monthly budget, prepare for annual financial planning, or simply want visibility into your subscription spending, Subscription Tracker provides the tools you need to stay in control of your recurring expenses.

## Features

- ✅ Email/password auth via Supabase (per-user data)
- ✅ Add, edit, and delete subscriptions
- ✅ Track subscription name, frequency, amount, and start date
- ✅ Dashboard with total yearly cost and average monthly cost
- ✅ Sort subscriptions by amount or frequency
- ✅ Modern, responsive UI
- ✅ Data persistence with Supabase (PostgreSQL)
- ✅ RESTful API with Node.js/Express backend
- ✅ Real-time cost calculations

## Tech Stack

- **Frontend**: React.js with modern hooks
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL (via Supabase)
- **Styling**: CSS3 with Flexbox/Grid

## Quick Start

### Prerequisites
- Node.js and npm installed
- Supabase account and project created
- Supabase project URL and anon key

### Setup Steps

1. **Set up Supabase**:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run both migrations in `supabase/migrations/001_create_subscriptions_table.sql` and `supabase/migrations/002_add_users_and_subscription_ownership.sql` via the Supabase SQL Editor
   - Get your project URL, anon key, and service role key from the Supabase dashboard

2. **Configure environment variables**:
   - Backend (`server/.env`):
     ```
     SUPABASE_URL=https://your-project-ref.supabase.co
     SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
     SUPABASE_ANON_KEY=your-anon-key-here
     ```
   - Frontend (`client/.env`):
     ```
     REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
     REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
     REACT_APP_API_URL=http://localhost:3001/api
     ```

3. **Install dependencies**:
   ```bash
   npm run install-all
   ```

4. **Start the development servers**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

For detailed Supabase setup instructions, see `SUPABASE_SETUP.md`.

## Project Structure

```
subscription-tracker/
├── client/                 # React frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── SubscriptionList.js
│   │   │   └── SubscriptionForm.js
│   │   ├── services/       # API calls
│   │   │   └── api.js
│   │   ├── utils/          # Helper functions
│   │   │   └── helpers.js
│   │   └── App.js
│   ├── build.sh            # Client build script
│   ├── package.json
│   └── README.md
├── server/                 # Node.js backend
│   ├── controllers/        # Route handlers
│   ├── models/            # Database models (Supabase)
│   ├── routes/            # API routes
│   └── index.js           # Server entry point
├── supabase/              # Supabase configuration
│   └── migrations/        # Database migrations
│       └── 001_create_subscriptions_table.sql
├── build.sh                # Root build script
├── setup.sh               # Setup script
├── test-api.sh            # API test script
├── render.yaml            # Render.com deployment config
├── CNAME                  # Custom domain config
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

The backend provides a RESTful API (all subscription routes require a `Bearer <access_token>` from Supabase Auth):

- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create a new subscription
- `PUT /api/subscriptions/:id` - Update a subscription
- `DELETE /api/subscriptions/:id` - Delete a subscription
- `GET /api/subscriptions/stats` - Get dashboard statistics
- `GET /api/health` - Health check

The backend connects to Supabase (PostgreSQL) for data persistence.

## Data Model

```javascript
{
  id: string,        // UUID
  userId: string,    // UUID owner (Supabase Auth user id)
  name: string,
  frequency: 'monthly' | 'yearly' | 'custom',
  amount: number,
  startDate: string, // ISO date string (YYYY-MM-DD)
  createdAt: string,
  updatedAt: string
}
```

Note: The API returns camelCase field names. The database uses snake_case (`start_date`, `created_at`, `updated_at`) which is automatically transformed by the backend.

## Usage Examples

### Adding a Subscription via API
```bash
curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_ACCESS_TOKEN" \
  -d '{
    "name": "Netflix", 
    "frequency": "monthly", 
    "amount": 15.99, 
    "startDate": "2024-01-01"
  }'
```

## Testing

Run the API test suite:
```bash
./test-api.sh
```

## Development

- Frontend runs on port 3000
- Backend runs on port 3001
- Database: Supabase (PostgreSQL) - cloud-hosted
- Database migrations are in `supabase/migrations/`
- See `SUPABASE_SETUP.md` for setup instructions
- Hot reload enabled for both frontend and backend

## Available Scripts

```bash
npm run dev          # Start both frontend and backend
npm run server       # Start only backend
npm run client       # Start only frontend
npm run build        # Build for production
npm run install-all  # Install all dependencies
./setup.sh          # Run setup script
```

Note: Configure your Supabase credentials in `server/.env` file.

## Build for Production

```bash
npm run build
npm start
```

## Features Implemented (Phase 1 MVP)

✅ **CRUD Operations**
- Create new subscriptions
- Read/view all subscriptions
- Update existing subscriptions
- Delete subscriptions

✅ **Data Persistence**
- Supabase (PostgreSQL) database with cloud hosting
- Node.js/Express backend connecting to Supabase
- Persistent storage with automatic backups
- Database migrations for schema management

✅ **Dashboard Analytics**
- Total yearly cost calculation
- Average monthly cost
- Active subscription count

✅ **Sorting & Organization**
- Sort by name, amount, or frequency
- Clean, card-based layout

✅ **Modern UI/UX**
- Responsive design
- Modal forms for adding/editing
- Error handling and validation
- Loading states

✅ **Automatic Calculations**
- Real-time cost calculations based on frequency
- Annualized cost display for each subscription

## License

MIT License
