'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Event } from '@/lib/types';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';
import CountdownTimer from '@/components/CountdownTimer';

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => {
        const found = (d.events || []).find((e: Event) => e.id === params.id);
        setEvent(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
        <div className="max-w-4xl mx-auto">
          <div className="skeleton" style={{ height: '300px', borderRadius: '20px', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: '40px', width: '60%', marginBottom: '1rem' }} />
          <div className="skeleton" style={{ height: '200px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20" style={{ minHeight: '80vh' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</p>
        <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Event Not Found</h2>
        <Link href="/events" className="btn-primary no-underline inline-block" style={{ marginTop: '1rem' }}>
          ← Back to Events
        </Link>
      </div>
    );
  }

  const categories = Object.entries(event.categories);

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div className="max-w-4xl mx-auto">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            height: '300px',
            background: event.poster_url
              ? `url(${event.poster_url}) center/cover`
              : 'var(--gradient-hero)',
            borderRadius: '24px',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '2rem',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.8))' }} />
          <div style={{ position: 'relative', zIndex: 1, color: 'white' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '0.5rem' }}>
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-4" style={{ fontSize: '0.95rem', opacity: 0.9 }}>
              <span>📅 {formatDate(event.date)}</span>
              <span>🕐 {formatTime(event.date)}</span>
              <span>📍 {event.venue}</span>
            </div>
          </div>
        </motion.div>

        {/* Countdown */}
        {new Date(event.date) > new Date() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass mb-8"
            style={{ borderRadius: '20px', padding: '2rem' }}
          >
            <CountdownTimer targetDate={event.date} label="⏱ Event starts in" />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass"
              style={{ borderRadius: '20px', padding: '2rem' }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>
                About This Event
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {event.description}
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass"
              style={{ borderRadius: '20px', padding: '2rem' }}
            >
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>
                🎁 What You Get
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {event.benefits.map((benefit, index) => (
                  <div
                    key={`${benefit}-${index}`}
                    style={{
                      background: 'var(--gradient-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    ✅ {benefit}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Route Map */}
            {event.route_map_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass"
                style={{ borderRadius: '20px', padding: '2rem' }}
              >
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>
                  🗺 Route Map
                </h2>
                <img
                  src={event.route_map_url}
                  alt="Route Map"
                  style={{ width: '100%', borderRadius: '12px' }}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar - Categories & Register */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass sticky top-24"
              style={{ borderRadius: '20px', padding: '1.5rem' }}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
                🏃 Race Categories
              </h3>
              <div className="flex flex-col gap-3 mb-6">
                {categories.map(([cat, price]) => (
                  <div
                    key={cat}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      borderRadius: '12px',
                      background: 'var(--gradient-card)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{cat}</span>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      {formatCurrency(price)}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={`/register/${event.id}`}
                className="btn-primary no-underline block text-center"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
              >
                Register Now →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
