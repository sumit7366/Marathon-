'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { Registration } from '@/lib/types';
import { formatCurrency, getVerifyUrl } from '@/lib/utils';

export default function SuccessPage() {
  const params = useParams();
  const registrationId = params.registrationId as string;
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    fetch(`/api/verify?id=${registrationId}`)
      .then(r => r.json())
      .then(d => {
        setRegistration(d.registration || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Hide confetti after 3s
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [registrationId]);

  if (loading) {
    return (
      <div style={{ padding: '2rem 1rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '300px', height: '400px', borderRadius: '24px' }} />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="text-center py-20" style={{ minHeight: '80vh' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</p>
        <h2>Registration not found</h2>
        <Link href="/" className="btn-primary no-underline inline-block" style={{ marginTop: '1rem' }}>
          Go Home
        </Link>
      </div>
    );
  }

  const shareUrl = getVerifyUrl(registrationId);
  const whatsappText = `🏃 I just registered for a marathon with BareillyRunners!\n\n📋 Registration ID: ${registrationId}\n🎽 Category: ${registration.category}\n💰 Amount: ${formatCurrency(registration.amount)}\n\nVerify: ${shareUrl}`;

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      {/* Confetti Effect */}
      {showConfetti && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none', overflow: 'hidden' }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                y: -20,
                rotate: 0,
              }}
              animate={{
                y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeIn',
              }}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                background: ['#e85d04', '#f48c06', '#22c55e', '#3b82f6', '#a855f7', '#faa307'][Math.floor(Math.random() * 6)],
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 150 }}
          className="glass text-center"
          style={{ borderRadius: '24px', padding: '2rem', overflow: 'hidden' }}
        >
          {/* Success Header */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
          >
            🎉
          </motion.div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.6rem',
            marginBottom: '0.5rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Registration Successful!
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Your spot has been reserved. Show this QR code at the venue.
          </p>

          {/* QR Code */}
          <div style={{ marginBottom: '1.5rem' }}>
            <QRCodeDisplay registrationId={registrationId} size={200} />
          </div>

          {/* Registration Details */}
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: '16px',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
            }}
          >
            <div className="flex flex-col gap-2" style={{ fontSize: '0.9rem' }}>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted)' }}>Registration ID</span>
                <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{registrationId}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted)' }}>Name</span>
                <span style={{ fontWeight: 600 }}>{registration.name}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted)' }}>Category</span>
                <span style={{ fontWeight: 600 }}>{registration.category}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted)' }}>Amount</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(registration.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--muted)' }}>Payment</span>
                <span className={registration.payment_status === 'paid' ? 'badge-paid' : 'badge-pending'}>
                  {registration.payment_status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                </span>
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            💡 Pay at the venue (Cash/UPI) to activate entry. Your payment status will be updated by the organizer.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary no-underline text-center"
              style={{ width: '100%', display: 'block', background: '#25D366', boxShadow: '0 4px 15px rgba(37,211,102,0.3)' }}
            >
              📲 Share on WhatsApp
            </a>
            <Link href="/events" className="btn-secondary no-underline text-center" style={{ width: '100%' }}>
              Browse More Events
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
