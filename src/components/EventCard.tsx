'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Event } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function EventCard({ event, index = 0 }: { event: Event; index?: number }) {
  const minPrice = Math.min(...Object.values(event.categories));
  const categoryKeys = Object.keys(event.categories);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      style={{
        background: 'var(--surface-elevated)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s',
      }}
      className="group"
    >
      {/* Poster / Gradient Header */}
      <div
        style={{
          height: '180px',
          background: event.poster_url
            ? `url(${event.poster_url}) center/cover`
            : 'var(--gradient-hero)',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '1rem',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.7))',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex gap-1.5 flex-wrap mb-2">
            {categoryKeys.map(cat => (
              <span
                key={cat}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'white',
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.25rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.15rem',
            marginBottom: '0.5rem',
            color: 'var(--foreground)',
          }}
        >
          {event.name}
        </h3>

        <div className="flex flex-col gap-1.5" style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1rem' }}>
          <span>📅 {formatDate(event.date)}</span>
          <span>📍 {event.venue}</span>
          <span>💰 Starting from {formatCurrency(minPrice)}</span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/events/${event.id}`}
            className="btn-primary flex-1 text-center no-underline"
            style={{ padding: '10px 16px', fontSize: '0.85rem', display: 'block' }}
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
