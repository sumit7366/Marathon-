'use client';
import { useEffect, useState, Suspense, lazy } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import EventCard from '@/components/EventCard';
import CountdownTimer from '@/components/CountdownTimer';
import { Event } from '@/lib/types';

const HeroScene = lazy(() => import('@/components/HeroScene'));

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    fetch('/api/events')
      .then(r => r.json())
      .then(d => setEvents(d.events || []))
      .catch(() => {});
  }, []);

  const upcomingEvent = events.find(e => new Date(e.date) > new Date());

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          background: 'var(--gradient-hero)',
        }}
      >
        {/* 3D Scene - desktop only */}
        {!isMobile && (
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        )}

        {/* Animated gradient overlay for mobile */}
        {isMobile && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(232,93,4,0.3), transparent 70%)',
            }}
          />
        )}

        <div
          className="text-center px-4"
          style={{ position: 'relative', zIndex: 10, maxWidth: '800px' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '8px 20px',
                borderRadius: '30px',
                fontSize: '0.85rem',
                color: 'white',
                marginBottom: '1.5rem',
                fontWeight: 500,
              }}
            >
              🏃 Bareilly&apos;s Premier Running Community
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            Run With <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #f48c06, #faa307)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              BareillyRunners
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '600px',
              margin: '0 auto 2rem',
              lineHeight: 1.6,
            }}
          >
            Join thousands of runners in Bareilly&apos;s biggest marathon events.
            5K, 10K, and Half Marathon — there&apos;s a race for everyone.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/events" className="btn-primary no-underline text-center" style={{ padding: '14px 36px', fontSize: '1.05rem' }}>
              Explore Events →
            </Link>
            <Link
              href="/gallery"
              className="no-underline text-center"
              style={{
                padding: '14px 36px',
                fontSize: '1.05rem',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.1)',
              }}
            >
              View Gallery
            </Link>
          </motion.div>

          {/* Countdown */}
          {upcomingEvent && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ marginTop: '3rem' }}
            >
              <CountdownTimer
                targetDate={upcomingEvent.date}
                label={`⏱ Next Event: ${upcomingEvent.name}`}
              />
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1.5rem',
          }}
        >
          ↓
        </motion.div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '5rem 1rem', background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            variants={fadeUp}
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              textAlign: 'center',
              marginBottom: '3rem',
            }}
          >
            How It <span className="gradient-text">Works</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📝', title: 'Register', desc: 'Fill the registration form with your details and choose your race category.' },
              { icon: '📱', title: 'Get QR Code', desc: 'Receive your unique QR code instantly. Show it at the event for entry.' },
              { icon: '🏁', title: 'Run & Win', desc: 'Show up at the venue, get verified, and run your heart out!' },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="glass"
                style={{
                  padding: '2rem',
                  borderRadius: '20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{step.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.75rem' }}>
                  Step {i + 1}: {step.title}
                </h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {events.length > 0 && (
        <section style={{ padding: '5rem 1rem' }}>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              variants={fadeUp}
              className="flex justify-between items-center mb-8 flex-wrap gap-4"
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                }}
              >
                Upcoming <span className="gradient-text">Events</span>
              </h2>
              <Link href="/events" className="btn-secondary no-underline">
                View All →
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Banner */}
      <section
        style={{
          padding: '4rem 1rem',
          background: 'var(--gradient-primary)',
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '500+', label: 'Runners' },
              { value: '10+', label: 'Events' },
              { value: '5+', label: 'Cities' },
              { value: '100%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring' }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'white' }}>
                  {stat.value}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
