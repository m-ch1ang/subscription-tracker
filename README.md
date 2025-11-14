# Subscription Tracker

A simple web application to track and manage your recurring subscriptions.

## About

Subscription Tracker is a full-stack web application designed to help individuals and families monitor and manage their recurring subscription services. In an era where subscription-based services have become ubiquitous—from streaming platforms and software licenses to gym memberships and meal delivery services—it's easy to lose track of how much you're spending each month or year.

This application provides a centralized solution to:

- **Track all subscriptions** in one place with essential details like name, cost, billing frequency, and start date
- **Calculate spending insights** including total yearly costs and average monthly expenses
- **Organize subscriptions** with flexible sorting options to identify the most expensive services or review billing frequencies
- **Make informed decisions** about which subscriptions to keep, cancel, or modify based on comprehensive cost analysis

Built with modern web technologies, Subscription Tracker features a clean, responsive user interface that works seamlessly across desktop and mobile devices. The application uses a RESTful API architecture with a React frontend and Node.js/Express backend, ensuring a smooth user experience with real-time data updates and persistent storage.

Whether you're trying to optimize your monthly budget, prepare for annual financial planning, or simply want visibility into your subscription spending, Subscription Tracker provides the tools you need to stay in control of your recurring expenses.

## Features

- ✅ Add, edit, and delete subscriptions
- ✅ Track subscription name, frequency, amount, and start date
- ✅ Dashboard with total yearly cost and average monthly cost
- ✅ Sort subscriptions by amount or frequency
- ✅ Modern, responsive UI
- ✅ Data persistence with SQLite
- ✅ RESTful API
- ✅ Real-time cost calculations

## Tech Stack

- **Frontend**: React.js with modern hooks
- **Backend**: Node.js + Express.js
- **Database**: SQLite
- **Styling**: CSS3 with Flexbox/Grid

## Quick Start

### Option 1: Automated Setup
```bash
./setup.sh
npm run dev
```

### Option 2: Manual Setup
1. **Install all dependencies**:
   ```bash
   npm run install-all
   ```

2. **Start the development servers**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

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
│   │   └── subscriptions.js
│   ├── models/            # Database models
│   │   └── database.js
│   ├── routes/            # API routes
│   │   └── subscriptions.js
│   ├── database.db        # SQLite database (auto-generated)
│   ├── index.js           # Server entry point
│   └── package.json
├── build.sh                # Root build script
├── setup.sh               # Setup script
├── test-api.sh            # API test script
├── render.yaml            # Render.com deployment config
├── CNAME                  # Custom domain config
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create a new subscription
- `PUT /api/subscriptions/:id` - Update a subscription
- `DELETE /api/subscriptions/:id` - Delete a subscription
- `GET /api/subscriptions/stats` - Get dashboard statistics
- `GET /api/health` - Health check

## Data Model

```javascript
{
  id: number,           // Auto-generated
  name: string,         // Subscription name
  frequency: string,    // 'monthly', 'yearly', 'custom'
  amount: number,       // Cost amount
  startDate: string,    // ISO date string
  createdAt: string,    // Auto-generated
  updatedAt: string     // Auto-generated
}
```

## Usage Examples

### Adding a Subscription via API
```bash
curl -X POST http://localhost:3001/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Netflix", 
    "frequency": "monthly", 
    "amount": 15.99, 
    "startDate": "2024-01-01"
  }'
```

### Getting Statistics
```bash
curl http://localhost:3001/api/subscriptions/stats
```

## Testing

Run the API test suite:
```bash
./test-api.sh
```

## Development

- Backend runs on port 3001
- Frontend runs on port 3000
- Database automatically initializes on first run
- Hot reload enabled for both frontend and backend

## Available Scripts

```bash
npm run dev          # Start both servers
npm run server       # Start only backend
npm run client       # Start only frontend
npm run build        # Build for production
npm run install-all  # Install all dependencies
./setup.sh          # Run setup script
./test-api.sh       # Test API endpoints
```

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
- SQLite database with automatic initialization
- Persistent storage across app restarts

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
