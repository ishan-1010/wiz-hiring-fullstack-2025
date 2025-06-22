import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../../db';
import { events, slots } from '../../../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const db = await getDatabase();

  if (req.method === 'GET') {
    try {
      // Get event details
      const event = await db.select().from(events as any).where(eq(events.id as any, id as string));
      
      if (event.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }

      // Get slots for this event
      const eventSlots = await db.select().from(slots as any).where(eq(slots.eventId as any, id as string));

      return res.status(200).json({
        event: event[0],
        slots: eventSlots
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      return res.status(500).json({ error: 'Failed to fetch event' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 