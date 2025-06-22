# BookMySlot - Fullstack Scheduling Application

**Built for the WizCommerce Fullstack Hiring Challenge 2025**

A modern scheduling application built with Next.js, Drizzle ORM, and SQLite. Users can create events with time slots and let others book available appointments - think of it as a mini-Calendly!

**Author:** Ishan Katoch

## 🚀 Live Demo

- **Frontend & Backend**: [https://wiz-hiring-fullstack-2025-git-ver-1dde5b-ishan-katochs-projects.vercel.app](https://wiz-hiring-fullstack-2025-git-ver-1dde5b-ishan-katochs-projects.vercel.app)
- **Repository**: [https://github.com/ishan-1010/wiz-hiring-fullstack-2025/tree/Version_Main_Deploy](https://github.com/ishan-1010/wiz-hiring-fullstack-2025/tree/Version_Main_Deploy)

## ✨ Features

- **Create Events**: Users can create events with title, description, and timezone
- **Time Slots Management**: Add multiple time slots with ISO 8601 format support
- **Public Event Listing**: Browse all available events with basic information
- **Booking Interface**: Book slots with name and email, prevent double bookings
- **Timezone Support**: Full timezone awareness using `date-fns-tz`
- **View My Bookings**: Search and view all bookings by email address

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Turso (serverless SQLite) with Drizzle ORM
- **Styling**: CSS Modules with responsive design
- **Timezone**: date-fns-tz for timezone conversions
- **Deployment**: Vercel (fullstack deployment)

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Turso CLI (for database setup)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ishan-1010/wiz-hiring-fullstack-2025.git
   cd wiz-hiring-fullstack-2025
   git checkout Version_Main_Deploy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Turso database**
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Login to Turso
   turso auth login
   
   # Create database
   turso db create bookmyslot
   
   # Get database URL
   turso db show bookmyslot --url
   
   # Create auth token
   turso db tokens create bookmyslot
   ```

4. **Set up environment variables**
   Create a `.env.local` file with your Turso credentials:
   ```env
   TURSO_DATABASE_URL=libsql://your-database-url.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   NODE_ENV=development
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the root directory:
```env
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token
NODE_ENV=development
```

## 📊 API Endpoints

- `POST /api/events` - Create new events
- `GET /api/events` - List all events
- `GET /api/events/[id]` - Get event details with slots
- `POST /api/events/[id]/slots` - Add time slots to events
- `POST /api/events/[id]/bookings` - Book a slot
- `GET /api/users/[email]/bookings` - View user bookings

## 🗄 Database Schema

```sql
-- Events table
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  creator_email TEXT NOT NULL,
  timezone TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Time slots table
CREATE TABLE slots (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  utc_start TEXT NOT NULL,
  utc_end TEXT NOT NULL,
  max_bookings INTEGER NOT NULL,
  booked_count INTEGER DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Bookings table
CREATE TABLE bookings (
  id TEXT PRIMARY KEY,
  slot_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  booked_at TEXT NOT NULL,
  FOREIGN KEY (slot_id) REFERENCES slots(id)
);
```

## 📄 Project Structure

```
BookMySlot/
├── bookmyslot/                 # Next.js application
│   ├── pages/                  # Next.js pages and API routes
│   │   ├── api/               # API endpoints
│   │   ├── _app.js           # App wrapper
│   │   ├── index.js          # Home page
│   │   ├── create-event.js   # Create event page
│   │   ├── my-bookings.js    # My bookings page
│   │   └── event/[id].js     # Event details page
│   ├── styles/               # CSS modules
│   ├── package.json          # Dependencies
│   └── tsconfig.json         # TypeScript config
├── db/                       # Database files
│   ├── schema.ts            # Drizzle ORM schema
│   ├── migrations/          # Database migrations
│   └── bookmyslot.db        # SQLite database
├── drizzle.config.js        # Drizzle configuration
└── README.md               # This file
```

## 🧪 Testing

### Manual Testing
- Create a new event with multiple time slots
- View event details and available slots
- Book a slot with valid information
- Verify booking appears in "My Bookings"
- Test timezone conversion accuracy
- Verify double booking prevention

### API Testing
```bash
# Create an event
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","description":"Test Description","creatorEmail":"test@example.com","timezone":"America/New_York","createdAt":"2025-01-01T00:00:00Z"}'

# Get all events
curl http://localhost:3000/api/events
```

## 🎯 Implementation Notes

### Design Decisions
- **Fullstack Next.js**: Chose Next.js for both frontend and backend to simplify deployment
- **SQLite**: Used SQLite for simplicity and ease of setup
- **Drizzle ORM**: Modern TypeScript-first ORM with excellent developer experience
- **CSS Modules**: Scoped styling without external dependencies
- **Timezone Handling**: Client-side conversion using `date-fns-tz` for better UX

### Future Improvements
- Add user authentication and authorization
- Implement email confirmations for bookings
- Add real-time updates with WebSocket
- Add comprehensive unit and integration tests
- Consider PostgreSQL for production

---

**Built with ❤️ by Ishan Katoch for the WizCommerce Fullstack Hiring Challenge**
