import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatInTimeZone } from 'date-fns-tz';
import styles from "@/styles/MyBookings.module.css";

export default function MyBookings() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userTimezone, setUserTimezone] = useState("");

  useEffect(() => {
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const searchBookings = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/users/${encodeURIComponent(email)}/bookings`);
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatSlotTime = (utcTime) => {
    try {
      return formatInTimeZone(new Date(utcTime), userTimezone, 'MMM dd, yyyy h:mm a');
    } catch {
      return new Date(utcTime).toLocaleString();
    }
  };

  const formatBookingDate = (utcTime) => {
    try {
      return formatInTimeZone(new Date(utcTime), userTimezone, 'MMM dd, yyyy h:mm a');
    } catch {
      return new Date(utcTime).toLocaleString();
    }
  };

  return (
    <>
      <Head>
        <title>My Bookings - BookMySlot</title>
        <meta name="description" content="View your event bookings on BookMySlot" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Events
          </Link>
          <h1 className={styles.title}>My Bookings</h1>
          <p className={styles.subtitle}>Search for your bookings by email address</p>
        </header>

        <main className={styles.main}>
          <div className={styles.searchSection}>
            <form onSubmit={searchBookings} className={styles.searchForm}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Your Email Address
                </label>
                <div className={styles.searchInput}>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={styles.input}
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className={styles.searchButton}
                  >
                    {loading ? "Searching..." : "Search Bookings"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {error && (
            <div className={styles.error}>
              <p>{error}</p>
            </div>
          )}

          {bookings.length > 0 && (
            <div className={styles.bookingsSection}>
              <h2 className={styles.sectionTitle}>
                Your Bookings ({bookings.length})
              </h2>
              
              <div className={styles.bookingsGrid}>
                {bookings.map((booking) => (
                  <div key={booking.id} className={styles.bookingCard}>
                    {booking.event && (
                      <div className={styles.eventInfo}>
                        <h3 className={styles.eventTitle}>{booking.event.title}</h3>
                        <p className={styles.eventDescription}>
                          {booking.event.description}
                        </p>
                      </div>
                    )}

                    {booking.slot && (
                      <div className={styles.slotInfo}>
                        <div className={styles.slotTime}>
                          <div className={styles.timeItem}>
                            <strong>Start:</strong> {formatSlotTime(booking.slot.utcStart)}
                          </div>
                          <div className={styles.timeItem}>
                            <strong>End:</strong> {formatSlotTime(booking.slot.utcEnd)}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={styles.bookingDetails}>
                      <div className={styles.bookingMeta}>
                        <div className={styles.metaItem}>
                          <strong>Booked by:</strong> {booking.name}
                        </div>
                        <div className={styles.metaItem}>
                          <strong>Email:</strong> {booking.email}
                        </div>
                        <div className={styles.metaItem}>
                          <strong>Booked on:</strong> {formatBookingDate(booking.bookedAt)}
                        </div>
                      </div>
                    </div>

                    {booking.event && (
                      <Link 
                        href={`/event/${booking.event.id}`}
                        className={styles.viewEventButton}
                      >
                        View Event
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && email && bookings.length === 0 && !error && (
            <div className={styles.noBookings}>
              <p>No bookings found for this email address.</p>
              <p>Make sure you've booked some events first!</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 