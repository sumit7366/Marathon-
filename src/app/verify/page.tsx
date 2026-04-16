'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Registration } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

function VerifyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No registration ID provided');
      setLoading(false);
      return;
    }

    fetch(`/api/verify?id=${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.registration) {
          setRegistration(d.registration);
        } else {
          setError('Registration not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to verify');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ fontSize: '2rem' }}
        >
          ⏳
        </motion.div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '2px solid rgba(239,68,68,0.3)',
            borderRadius: '24px',
            padding: '3rem 2rem',
            maxWidth: '400px',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>Not Found</h2>
          <p style={{ color: 'var(--muted)' }}>{error || 'Registration not found'}</p>
        </motion.div>
      </div>
    );
  }

  const isPaid = registration.payment_status === 'paid';

  return (
    <div
      className={isPaid ? 'entry-allowed' : 'entry-denied'}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2rem',
          maxWidth: '420px',
          width: '100%',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
        }}
      >
        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-center"
          style={{ marginBottom: '1.5rem' }}
        >
          <div style={{ fontSize: '5rem', marginBottom: '0.5rem' }}>
            {isPaid ? '✅' : '❌'}
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '1.8rem',
          }}>
            {isPaid ? 'Entry Allowed' : 'Payment Pending'}
          </h1>
          <p style={{ opacity: 0.9, fontSize: '1rem', marginTop: '0.25rem' }}>
            {isPaid ? 'Runner is verified and paid' : 'Payment has not been received'}
          </p>
        </motion.div>

        {/* Details */}
        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '1.25rem',
          }}
        >
          <div className="flex flex-col gap-3" style={{ fontSize: '0.95rem' }}>
            <div className="flex justify-between">
              <span style={{ opacity: 0.7 }}>Name</span>
              <span style={{ fontWeight: 700 }}>{registration.name}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ opacity: 0.7 }}>Event</span>
              <span style={{ fontWeight: 600 }}>{registration.event?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ opacity: 0.7 }}>Category</span>
              <span style={{ fontWeight: 600 }}>{registration.category}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ opacity: 0.7 }}>Reg. ID</span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{registration.registration_id}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ opacity: 0.7 }}>Amount</span>
              <span style={{ fontWeight: 700 }}>{formatCurrency(registration.amount)}</span>
            </div>
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.2)',
                paddingTop: '0.75rem',
                marginTop: '0.5rem',
              }}
              className="flex justify-between items-center"
            >
              <span style={{ opacity: 0.7 }}>Payment</span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  padding: '4px 16px',
                  borderRadius: '20px',
                  background: isPaid ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
                }}
              >
                {isPaid ? '✅ PAID' : '❌ PENDING'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '2rem' }}>⏳</div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
