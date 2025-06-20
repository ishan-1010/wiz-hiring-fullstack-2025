import type { NextApiRequest, NextApiResponse } from 'next';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import path from 'path';
import { bookings, slots, events } from '../../../../../db/schema';
import { eq } from 'drizzle-orm';

// Set up the SQLite client and Drizzle instance
const client = createClient({
  url: `file:${path.join(process.cwd(), '..', 'db', 'bookmyslot.db')}`,
});
const db = drizzle(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (req.method === 'GET') {
    try {
      // Get all bookings for this user
      const userBookings = await db.select().from(bookings as any).where(eq(bookings.email as any, email as string));
      
      // For each booking, get the slot and event details
      const bookingsWithDetails = await Promise.all(
        userBookings.map(async (booking) => {
          const slot = await db.select().from(slots as any).where(eq(slots.id as any, booking.slotId));
          const event = slot.length > 0 ? await db.select().from(events as any).where(eq(events.id as any, slot[0].eventId)) : [];
          
          return {
            ...booking,
            slot: slot[0] || null,
            event: event[0] || null,
          };
        })
      );

      return res.status(200).json(bookingsWithDetails);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 