import type { NextApiRequest, NextApiResponse } from 'next';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import path from 'path';
import { slots } from '../../../../../db/schema';

// Set up the SQLite client and Drizzle instance
const client = createClient({
  url: `file:${path.join(process.cwd(), '..', 'db', 'bookmyslot.db')}`,
});
const db = drizzle(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: eventId } = req.query;

  if (req.method === 'POST') {
    const { utcStart, utcEnd, maxBookings } = req.body;
    
    if (!utcStart || !utcEnd || !maxBookings) {
      return res.status(400).json({ error: 'Missing required fields: utcStart, utcEnd, maxBookings' });
    }

    if (maxBookings <= 0) {
      return res.status(400).json({ error: 'maxBookings must be greater than 0' });
    }

    try {
      const slotId = Math.random().toString(36).substring(2, 10);

      await db.insert(slots as any).values({
        id: slotId,
        eventId: eventId as string,
        utcStart,
        utcEnd,
        maxBookings,
        bookedCount: 0,
      });

      return res.status(201).json({
        id: slotId,
        eventId,
        utcStart,
        utcEnd,
        maxBookings,
        bookedCount: 0,
      });
    } catch (error) {
      console.error('Error creating slot:', error);
      return res.status(500).json({ error: 'Failed to create slot' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 