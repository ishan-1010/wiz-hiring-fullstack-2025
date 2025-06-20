import type { NextApiRequest, NextApiResponse } from 'next';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import path from 'path';
import { slots, bookings } from '../../../../db/schema';
import { eq, and } from 'drizzle-orm';

// Set up the SQLite client and Drizzle instance
const client = createClient({
  url: `file:${path.join(process.cwd(), 'db', 'bookmyslot.db')}`,
});
const db = drizzle(client);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id: eventId } = req.query;

  if (req.method === 'POST') {
    const { slotId, name, email } = req.body;
    
    if (!slotId || !name || !email) {
      return res.status(400).json({ error: 'Missing required fields: slotId, name, email' });
    }

    try {
      // Check if slot exists and belongs to this event
      const slot = await db.select().from(slots as any).where(eq(slots.id as any, slotId));
      
      if (slot.length === 0) {
        return res.status(404).json({ error: 'Slot not found' });
      }

      if (slot[0].eventId !== eventId) {
        return res.status(400).json({ error: 'Slot does not belong to this event' });
      }

      // Check if slot is full
      if (slot[0].bookedCount >= slot[0].maxBookings) {
        return res.status(400).json({ error: 'Slot is full' });
      }

      // Check if user already booked this slot
      const existingBooking = await db.select().from(bookings as any).where(
        and(
          eq(bookings.slotId as any, slotId),
          eq(bookings.email as any, email)
        )
      );

      if (existingBooking.length > 0) {
        return res.status(400).json({ error: 'You have already booked this slot' });
      }

      // Create the booking
      const bookingId = Math.random().toString(36).substring(2, 10);
      const bookedAt = new Date().toISOString();

      await db.insert(bookings as any).values({
        id: bookingId,
        slotId,
        name,
        email,
        bookedAt,
      });

      // Update slot booked count
      await db.update(slots as any)
        .set({ bookedCount: slot[0].bookedCount + 1 })
        .where(eq(slots.id as any, slotId));

      return res.status(201).json({
        id: bookingId,
        slotId,
        name,
        email,
        bookedAt,
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({ error: 'Failed to create booking' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 