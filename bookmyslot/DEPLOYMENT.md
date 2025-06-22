# Deployment Guide for BookMySlot

## Database Setup for Vercel Deployment

This application uses Turso (serverless SQLite) for the database. Follow these steps to deploy to Vercel:

### 1. Create a Turso Database

1. Install Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Login to Turso:
   ```bash
   turso auth login
   ```

3. Create a new database:
   ```bash
   turso db create bookmyslot
   ```

4. Get your database URL:
   ```bash
   turso db show bookmyslot --url
   ```

5. Create an auth token:
   ```bash
   turso db tokens create bookmyslot
   ```

### 2. Set Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

- `TURSO_DATABASE_URL`: Your Turso database URL (e.g., `libsql://bookmyslot-username.turso.io`)
- `TURSO_AUTH_TOKEN`: Your Turso auth token

### 3. Run Migrations

After setting up the database, run migrations to create the tables:

```bash
npm run db:migrate
```

### 4. Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy

### Local Development

For local development, the app will automatically use a local SQLite file (`db/bookmyslot.db`) when the environment variables are not set.

### Troubleshooting

- If you get "Failed to create event" errors, check that your environment variables are set correctly in Vercel
- Make sure you've run the migrations on your Turso database
- Check the Vercel function logs for detailed error messages 