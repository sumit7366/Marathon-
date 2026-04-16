'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCountdown } from '@/lib/utils';

export default function CountdownTimer({ targetDate, label }: { targetDate: string; label?: string }) {
  const [countdown, setCountdown] = useState(getCountdown(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (countdown.isExpired) {
    return (
      <div className="text-center py-4">
        <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
          🏁 Event has started!
        </span>
      </div>
    );
  }

  const units = [
    { value: countdown.days, label: 'Days' },
    { value: countdown.hours, label: 'Hours' },
    { value: countdown.minutes, label: 'Min' },
    { value: countdown.seconds, label: 'Sec' },
  ];

  return (
    <div className="text-center">
      {label && (
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 500 }}>
          {label}
        </p>
      )}
      <div className="flex justify-center gap-3">
        {units.map((unit, i) => (
          <motion.div
            key={unit.label}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}
            className="glass"
            style={{
              borderRadius: '16px',
              padding: '12px 16px',
              minWidth: '70px',
              textAlign: 'center',
            }}
          >
            <motion.div
              key={unit.value}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.5rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </motion.div>
            <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600, marginTop: '2px' }}>
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
