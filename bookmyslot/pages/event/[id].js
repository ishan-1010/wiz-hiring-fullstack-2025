import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { formatInTimeZone } from 'date-fns-tz';
import styles from "@/styles/EventDetails.module.css";

export default function EventDetails() {
  const router = useRouter();
  const { id } = router.query;
  
  const [event, setEvent] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    slotId: ""
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [userTimezone, setUserTimezone] = useState("");

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
    setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event details');
      }
      const data = await response.json();
      setEvent(data.event);
      setSlots(data.slots);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError("");
    setBookingSuccess(false);

    try {
      const response = await fetch(`/api/events/${id}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book slot');
      }

      setBookingSuccess(true);
      setBookingForm({ name: "", email: "", slotId: "" });
      
      // Refresh event details to update slot availability
      setTimeout(() => {
        fetchEventDetails();
      }, 1000);
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatSlotTime = (utcTime) => {
    try {
      return formatInTimeZone(new Date(utcTime), userTimezone, 'MMM dd, yyyy h:mm a');
    } catch {
      return new Date(utcTime).toLocaleString();
    }
  };

  const isSlotAvailable = (slot) => {
    return slot.bookedCount < slot.maxBookings;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Error: {error}</p>
          <Link href="/" className={styles.backButton}>
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Event not found</p>
          <Link href="/" className={styles.backButton}>
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{event.title} - BookMySlot</title>
        <meta name="description" content={event.description} />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Events
          </Link>
          <h1 className={styles.title}>{event.title}</h1>
        </header>

        <main className={styles.main}>
          <div className={styles.eventInfo}>
            <div className={styles.description}>
              <h2>Description</h2>
              <p>{event.description}</p>
            </div>
            
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <strong>Created by:</strong> {event.creatorEmail}
              </div>
              <div className={styles.metaItem}>
                <strong>Timezone:</strong> {event.timezone}
              </div>
              <div className={styles.metaItem}>
                <strong>Available slots:</strong> {slots.length}
              </div>
            </div>
          </div>

          <div className={styles.slotsSection}>
            <h2>Available Time Slots</h2>
            
            {slots.length === 0 ? (
              <div className={styles.noSlots}>
                <p>No time slots available for this event.</p>
              </div>
            ) : (
              <div className={styles.slotsGrid}>
                {slots.map((slot) => (
                  <div 
                    key={slot.id} 
                    className={`${styles.slotCard} ${!isSlotAvailable(slot) ? styles.slotFull : ''}`}
                  >
                    <div className={styles.slotTime}>
                      <div className={styles.slotStart}>
                        <strong>Start:</strong> {formatSlotTime(slot.utcStart)}
                      </div>
                      <div className={styles.slotEnd}>
                        <strong>End:</strong> {formatSlotTime(slot.utcEnd)}
                      </div>
                    </div>
                    
                    <div className={styles.slotAvailability}>
                      <span className={styles.availabilityText}>
                        {slot.bookedCount} / {slot.maxBookings} booked
                      </span>
                      {!isSlotAvailable(slot) && (
                        <span className={styles.fullBadge}>Full</span>
                      )}
                    </div>

                    {isSlotAvailable(slot) && (
                      <button
                        onClick={() => setBookingForm(prev => ({ ...prev, slotId: slot.id }))}
                        className={styles.selectSlotButton}
                      >
                        Select This Slot
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {bookingForm.slotId && (
            <div className={styles.bookingSection}>
              <h2>Book Your Slot</h2>
              
              {bookingSuccess && (
                <div className={styles.success}>
                  <p>✅ Booking successful! You will receive a confirmation shortly.</p>
                </div>
              )}

              {bookingError && (
                <div className={styles.error}>
                  <p>❌ {bookingError}</p>
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className={styles.bookingForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className={styles.input}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Your Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className={styles.input}
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={() => setBookingForm(prev => ({ ...prev, slotId: "" }))}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className={styles.bookButton}
                  >
                    {bookingLoading ? "Booking..." : "Confirm Booking"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </>
  );
} 