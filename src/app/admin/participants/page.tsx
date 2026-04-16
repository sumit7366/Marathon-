'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminGuard from '@/components/AdminGuard';
import { Registration, Event } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

function ParticipantsContent() {
  const [participants, setParticipants] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchData = () => {
    Promise.all([
      fetch('/api/participants').then(r => r.json()),
      fetch('/api/events').then(r => r.json()),
    ]).then(([p, e]) => {
      setParticipants(p.participants || []);
      setEvents(e.events || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const togglePayment = async (regId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    await fetch('/api/participants', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registration_id: regId, payment_status: newStatus }),
    });
    setParticipants(prev =>
      prev.map(p => p.registration_id === regId ? { ...p, payment_status: newStatus as 'paid' | 'pending' } : p)
    );
  };

  const handleDeleteParticipant = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete participant ${name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/participants?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setParticipants(prev => prev.filter(p => p.id !== id));
      } else {
        alert('Failed to delete participant');
      }
    } catch {
      alert('Network error while deleting participant');
    }
  };

  const filtered = participants.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.registration_id.toLowerCase().includes(search.toLowerCase()) &&
        !p.phone.includes(search) &&
        !p.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterEvent && p.event_id !== filterEvent) return false;
    if (filterStatus && p.payment_status !== filterStatus) return false;
    if (filterCategory && p.category !== filterCategory) return false;
    return true;
  });

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            <span className="gradient-text">Participants</span>
          </h1>
          <p style={{ color: 'var(--muted)' }}>
            {filtered.length} of {participants.length} participants
          </p>
        </motion.div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <input
            className="input-field"
            placeholder="🔍 Search name, ID, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="input-field" value={filterEvent} onChange={e => setFilterEvent(e.target.value)}>
            <option value="">All Events</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
          </select>
          <select className="input-field" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
          <select className="input-field" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="5KM">5KM</option>
            <option value="10KM">10KM</option>
            <option value="21KM">21KM</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: '60px', borderRadius: '12px' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</p>
            <p style={{ color: 'var(--muted)' }}>No participants found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                <thead>
                  <tr style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'left' }}>
                    <th style={{ padding: '0 12px' }}>REG ID</th>
                    <th>NAME</th>
                    <th>PHONE</th>
                    <th>CATEGORY</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <motion.tr
                      key={p.registration_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="glass"
                      style={{ fontSize: '0.9rem' }}
                    >
                      <td style={{ padding: '12px', borderRadius: '12px 0 0 12px', fontFamily: 'monospace', fontWeight: 700 }}>
                        {p.registration_id}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.email}</div>
                      </td>
                      <td style={{ padding: '12px' }}>{p.phone}</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>{p.category}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--primary)' }}>
                        {formatCurrency(p.amount)}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={p.payment_status === 'paid' ? 'badge-paid' : 'badge-pending'}>
                          {p.payment_status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderRadius: '0 12px 12px 0' }}>
                        <div className="flex gap-2">
                          <button
                            onClick={() => togglePayment(p.registration_id, p.payment_status)}
                            className="btn-secondary"
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              color: p.payment_status === 'paid' ? '#f59e0b' : '#22c55e',
                            }}
                          >
                            {p.payment_status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                          </button>
                          <button
                            onClick={() => handleDeleteParticipant(p.id, p.name)}
                            className="btn-secondary"
                            style={{
                              padding: '6px 12px',
                              fontSize: '0.8rem',
                              color: '#ef4444',
                              borderColor: 'rgba(239,68,68,0.3)',
                            }}
                            title="Delete Participant"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.registration_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass"
                  style={{ borderRadius: '16px', padding: '1rem' }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem' }}>{p.name}</div>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--muted)' }}>{p.registration_id}</div>
                    </div>
                    <span className={p.payment_status === 'paid' ? 'badge-paid' : 'badge-pending'}>
                      {p.payment_status === 'paid' ? '✅ Paid' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3" style={{ fontSize: '0.85rem' }}>
                    <div style={{ color: 'var(--muted)' }}>
                      {p.category} · {formatCurrency(p.amount)}
                    </div>
                    <div className="flex gap-2">
                       <button
                         onClick={() => togglePayment(p.registration_id, p.payment_status)}
                         className="btn-primary"
                         style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                       >
                         {p.payment_status === 'paid' ? 'Mark Unpaid' : 'Mark Paid'}
                       </button>
                       <button
                         onClick={() => handleDeleteParticipant(p.id, p.name)}
                         className="btn-secondary"
                         style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                       >
                         🗑
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminParticipantsPage() {
  return (
    <AdminGuard>
      <ParticipantsContent />
    </AdminGuard>
  );
}
