'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AdminGuard from '@/components/AdminGuard';
import { formatCurrency } from '@/lib/utils';

interface Stats {
  totalRegistrations: number;
  paidCount: number;
  pendingCount: number;
  totalRevenue: number;
  totalEvents: number;
}

function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(d => setStats(d.stats))
      .catch(() => {});
  }, []);

  const statCards = stats ? [
    { label: 'Total Events', value: stats.totalEvents, icon: '📅', color: '#3b82f6' },
    { label: 'Registrations', value: stats.totalRegistrations, icon: '👥', color: '#a855f7' },
    { label: 'Paid', value: stats.paidCount, icon: '✅', color: '#22c55e' },
    { label: 'Pending', value: stats.pendingCount, icon: '⏳', color: '#f59e0b' },
    { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: '💰', color: '#e85d04' },
  ] : [];

  const quickLinks = [
    { href: '/admin/events', label: 'Manage Events', icon: '📅', desc: 'Create & edit events' },
    { href: '/admin/participants', label: 'Participants', icon: '👥', desc: 'View & manage runners' },
    { href: '/admin/scanner', label: 'QR Scanner', icon: '📷', desc: 'Scan entry QR codes' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼', desc: 'Upload event photos' },
  ];

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', marginBottom: '0.25rem' }}>
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={{ color: 'var(--muted)' }}>Manage your marathon events</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats ? statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass"
              style={{ borderRadius: '16px', padding: '1.25rem' }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: stat.color }}>
                {stat.value}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.8rem', fontWeight: 500 }}>
                {stat.label}
              </div>
            </motion.div>
          )) : Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
          ))}
        </div>

        {/* Quick Actions */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <Link
                href={link.href}
                className="glass no-underline block"
                style={{
                  borderRadius: '16px',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'var(--foreground)',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{link.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>{link.label}</h3>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{link.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}
