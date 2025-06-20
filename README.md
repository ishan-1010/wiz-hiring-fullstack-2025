# BookMySlot - Fullstack Scheduling Application

A modern scheduling application built with Next.js, Drizzle ORM, and SQLite. Users can create events with time slots and let others book available appointments - think of it as a mini-Calendly!

## 🚀 Live Demo

- **Frontend**: [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/your-username/bookmyslot)
- **Backend**: API routes are included in the Next.js app (fullstack approach)

## ✨ Features Implemented

### ✅ Core Requirements
- **Create Events**: Users can create events with title, description, and timezone
- **Time Slots Management**: Add multiple time slots with ISO 8601 format support
- **Public Event Listing**: Browse all available events with basic information
- **Booking Interface**: Book slots with name and email, prevent double bookings
- **Timezone Support**: Full timezone awareness using `date-fns-tz`
- **View My Bookings**: Search and view all bookings by email address

### 🎨 Frontend Screens
1. **Home Page** - Event listing with navigation
2. **Event Details Page** - View event info and book slots
3. **Create Event Page** - Form to create events with dynamic slot management
4. **My Bookings Page** - Search and view user bookings

### 📊 API Endpoints
- `POST /api/events` - Create new events
- `GET /api/events` - List all events
- `GET /api/events/[id]` - Get event details with slots
- `POST /api/events/[id]/slots` - Add time slots to events
- `POST /api/events/[id]/bookings` - Book a slot
- `GET /api/users/[email]/bookings` - View user bookings

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, CSS Modules
- **Backend**: Next.js API Routes
- **Database**: SQLite with Drizzle ORM
- **Timezone**: date-fns-tz for timezone conversions
- **Styling**: Custom CSS with responsive design
- **Deployment**: Vercel (frontend + backend)

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bookmyslot.git
   cd bookmyslot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Generate database migrations
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the root directory:
```env
# Database (SQLite file path)
DATABASE_URL=file:./db/bookmyslot.db

# Optional: Add any additional environment variables
NODE_ENV=development
```

## 🗄 Database Schema

The application uses three main tables:

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

## 🌍 Timezone Support

The application handles timezones comprehensively:

- **Storage**: All times are stored in UTC format
- **Display**: Times are converted to user's local timezone using `date-fns-tz`
- **Input**: Event creators can select their timezone when creating events
- **Conversion**: Automatic client-side conversion for all time displays

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js and deploy
   - Database file will be included in the deployment

### Alternative Deployment Options

- **Netlify**: Works well with Next.js static export
- **Railway**: Good for fullstack apps with database
- **Render**: Supports Node.js applications

## 📱 Usage Guide

### Creating an Event
1. Click "Create New Event" on the home page
2. Fill in event details (title, description, email, timezone)
3. Add time slots with start/end times and max bookings
4. Submit to create the event

### Booking a Slot
1. Browse events on the home page
2. Click "View Details & Book" on any event
3. Select an available time slot
4. Enter your name and email
5. Confirm booking

### Viewing Your Bookings
1. Click "My Bookings" on the home page
2. Enter your email address
3. View all your past and upcoming bookings

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create a new event with multiple time slots
- [ ] View event details and available slots
- [ ] Book a slot with valid information
- [ ] Verify booking appears in "My Bookings"
- [ ] Test timezone conversion accuracy
- [ ] Verify double booking prevention
- [ ] Test responsive design on mobile

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Create an event
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","description":"Test Description","creatorEmail":"test@example.com","timezone":"America/New_York","createdAt":"2025-01-01T00:00:00Z"}'

# Get all events
curl http://localhost:3000/api/events
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

## 🎯 Implementation Notes

### Design Decisions
- **Fullstack Next.js**: Chose Next.js for both frontend and backend to simplify deployment and development
- **SQLite**: Used SQLite for simplicity and ease of setup
- **Drizzle ORM**: Modern TypeScript-first ORM with excellent developer experience
- **CSS Modules**: Scoped styling without external dependencies
- **Timezone Handling**: Client-side conversion using `date-fns-tz` for better UX

### Areas for Improvement
- **Database**: For production, consider using PostgreSQL or a cloud database
- **Authentication**: Add user authentication and authorization
- **Email Notifications**: Implement email confirmations for bookings
- **Real-time Updates**: Add WebSocket support for live booking updates
- **Testing**: Add comprehensive unit and integration tests
- **Performance**: Implement caching and optimization strategies

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for the WizCommerce Fullstack Hiring Challenge**
