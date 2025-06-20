import type { NextApiRequest, NextApiResponse } from 'next';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import path from 'path';
import { events } from '../../../db/schema';

// Set up the SQLite client and Drizzle instance
const client = createClient({
  url: `file:${path.join(process.cwd(), '..', 'db', 'bookmyslot.db')}`,
});
const db = drizzle(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Create a new event
    const { title, description, creatorEmail, timezone, createdAt } = req.body;
    if (!title || !description || !creatorEmail || !timezone || !createdAt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    try {
      const id = Math.random().toString(36).substring(2, 10); // Simple unique id
      await db.insert(events as any).values({
        id,
        title,
        description,
        creatorEmail,
        timezone,
        createdAt,
      });
      return res.status(201).json({ id, title, description, creatorEmail, timezone, createdAt });
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ error: 'Failed to create event' });
    }
  } else if (req.method === 'GET') {
    // List all events
    try {
      const allEvents = await db.select().from(events as any);
      return res.status(200).json(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 