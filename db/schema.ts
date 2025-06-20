import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Events table
export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  creatorEmail: text('creator_email').notNull(),
  timezone: text('timezone').notNull(),
  createdAt: text('created_at').notNull(),
});

// Slots table
export const slots = sqliteTable('slots', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull().references(() => events.id),
  utcStart: text('utc_start').notNull(),
  utcEnd: text('utc_end').notNull(),
  maxBookings: integer('max_bookings').notNull(),
  bookedCount: integer('booked_count').notNull().default(0),
});

// Bookings table
export const bookings = sqliteTable('bookings', {
  id: text('id').primaryKey(),
  slotId: text('slot_id').notNull().references(() => slots.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  bookedAt: text('booked_at').notNull(),
}); 