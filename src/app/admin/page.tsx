'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { verifyAdmin } from '@/lib/utils';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate slight delay for UX
    await new Promise(r => setTimeout(r, 500));

    if (verifyAdmin(password, pin)) {
      localStorage.setItem('br-admin-session', JSON.stringify({
        authenticated: true,
        timestamp: Date.now(),
      }));
      router.push('/admin/dashboard');
    } else {
      setError('Invalid password or PIN');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          maxWidth: '400px',
          width: '100%',
          borderRadius: '24px',
          padding: '2rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: 'var(--gradient-primary)',
            margin: '-2rem -2rem 2rem -2rem',
            padding: '2rem',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.5rem',
          }}>
            Admin Panel
          </h1>
          <p style={{ opacity: 0.9, fontSize: '0.85rem' }}>Enter credentials to continue</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '10px',
            color: '#ef4444',
            fontSize: '0.85rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
              Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              id="admin-password"
            />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>
              PIN
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter PIN"
              value={pin}
              onChange={e => setPin(e.target.value)}
              required
              id="admin-pin"
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            id="admin-login-btn"
          >
            {loading ? '⏳ Verifying...' : '🔓 Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
