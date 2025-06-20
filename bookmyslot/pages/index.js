import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/Home.module.css";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>BookMySlot - Schedule Your Events</title>
        <meta name="description" content="Create and book events easily with BookMySlot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>BookMySlot</h1>
          <p className={styles.subtitle}>Schedule and book events with ease</p>
          <div className={styles.headerActions}>
            <Link href="/create-event" className={styles.createButton}>
              Create New Event
            </Link>
            <Link href="/my-bookings" className={styles.bookingsButton}>
              My Bookings
            </Link>
          </div>
        </header>

        <main className={styles.main}>
          {loading && (
            <div className={styles.loading}>
              <p>Loading events...</p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <p>Error: {error}</p>
              <button onClick={fetchEvents} className={styles.retryButton}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <h2 className={styles.sectionTitle}>Available Events</h2>
              
              {events.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No events available yet.</p>
                  <p>Be the first to create an event!</p>
                </div>
              ) : (
                <div className={styles.eventsGrid}>
                  {events.map((event) => (
                    <div key={event.id} className={styles.eventCard}>
                      <h3 className={styles.eventTitle}>{event.title}</h3>
                      <p className={styles.eventDescription}>{event.description}</p>
                      <div className={styles.eventMeta}>
                        <span className={styles.eventCreator}>
                          By: {event.creatorEmail}
                        </span>
                        <span className={styles.eventTimezone}>
                          {event.timezone}
                        </span>
                      </div>
                      <Link 
                        href={`/event/${event.id}`} 
                        className={styles.viewButton}
                      >
                        View Details & Book
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <footer className={styles.footer}>
          <p>&copy; 2025 BookMySlot. Built with Next.js and Drizzle ORM.</p>
        </footer>
      </div>
    </>
  );
}
