import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/CreateEvent.module.css";

export default function CreateEvent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    creatorEmail: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSlot = () => {
    const newSlot = {
      id: Date.now(),
      utcStart: "",
      utcEnd: "",
      maxBookings: 1
    };
    setSlots([...slots, newSlot]);
  };

  const removeSlot = (id) => {
    setSlots(slots.filter(slot => slot.id !== id));
  };

  const updateSlot = (id, field, value) => {
    setSlots(slots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create the event
      const eventResponse = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!eventResponse.ok) {
        throw new Error('Failed to create event');
      }

      const event = await eventResponse.json();

      // Add slots to the event
      for (const slot of slots) {
        if (slot.utcStart && slot.utcEnd && slot.maxBookings > 0) {
          await fetch(`/api/events/${event.id}/slots`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              utcStart: slot.utcStart,
              utcEnd: slot.utcEnd,
              maxBookings: slot.maxBookings,
            }),
          });
        }
      }

      // Redirect to the event page
      router.push(`/event/${event.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Event - BookMySlot</title>
        <meta name="description" content="Create a new event on BookMySlot" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            ← Back to Events
          </Link>
          <h1 className={styles.title}>Create New Event</h1>
        </header>

        <main className={styles.main}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={styles.input}
                placeholder="Enter event title"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className={styles.textarea}
                placeholder="Describe your event"
                rows={4}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="creatorEmail" className={styles.label}>
                Your Email *
              </label>
              <input
                type="email"
                id="creatorEmail"
                name="creatorEmail"
                value={formData.creatorEmail}
                onChange={handleInputChange}
                required
                className={styles.input}
                placeholder="your@email.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="timezone" className={styles.label}>
                Timezone *
              </label>
              <select
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Asia/Shanghai">Shanghai (CST)</option>
                <option value="Australia/Sydney">Sydney (AEDT)</option>
              </select>
            </div>

            <div className={styles.slotsSection}>
              <div className={styles.slotsHeader}>
                <h2 className={styles.slotsTitle}>Time Slots</h2>
                <button
                  type="button"
                  onClick={addSlot}
                  className={styles.addSlotButton}
                >
                  + Add Slot
                </button>
              </div>

              {slots.map((slot) => (
                <div key={slot.id} className={styles.slotCard}>
                  <div className={styles.slotHeader}>
                    <h3>Slot {slots.indexOf(slot) + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeSlot(slot.id)}
                      className={styles.removeSlotButton}
                    >
                      Remove
                    </button>
                  </div>

                  <div className={styles.slotFields}>
                    <div className={styles.slotField}>
                      <label>Start Time (UTC)</label>
                      <input
                        type="datetime-local"
                        value={slot.utcStart}
                        onChange={(e) => updateSlot(slot.id, 'utcStart', e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.slotField}>
                      <label>End Time (UTC)</label>
                      <input
                        type="datetime-local"
                        value={slot.utcEnd}
                        onChange={(e) => updateSlot(slot.id, 'utcEnd', e.target.value)}
                        className={styles.input}
                      />
                    </div>

                    <div className={styles.slotField}>
                      <label>Max Bookings</label>
                      <input
                        type="number"
                        min="1"
                        value={slot.maxBookings}
                        onChange={(e) => updateSlot(slot.id, 'maxBookings', parseInt(e.target.value))}
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {slots.length === 0 && (
                <p className={styles.noSlots}>
                  No time slots added yet. Click "Add Slot" to create available time slots for your event.
                </p>
              )}
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <div className={styles.formActions}>
              <Link href="/" className={styles.cancelButton}>
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
} 