'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import EventCard from '@/components/EventCard';
import { Event } from '@/lib/types';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => { setEvents(d.events || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              marginBottom: '0.75rem',
            }}
          >
            Our <span className="gradient-text">Events</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Choose your race and register today. Every event is a new adventure.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: '350px', borderRadius: '20px' }} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏃</p>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>No events available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
