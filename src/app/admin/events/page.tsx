'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminGuard from '@/components/AdminGuard';
import { Event } from '@/lib/types';
import { formatDate, formatCurrency } from '@/lib/utils';

function EventsContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [form, setForm] = useState({
    name: '',
    date: '',
    venue: '',
    description: '',
    benefits: '',
    cat5k: '',
    cat10k: '',
    cat21k: '',
    posterUrl: '',
  });
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = () => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => { setEvents(d.events || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const resetForm = () => {
    setForm({ name: '', date: '', venue: '', description: '', benefits: '', cat5k: '', cat10k: '', cat21k: '', posterUrl: '' });
    setPosterFile(null);
    setEditingEvent(null);
    setShowForm(false);
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    const cats = event.categories;
    setForm({
      name: event.name,
      date: event.date.slice(0, 16),
      venue: event.venue,
      description: event.description,
      benefits: event.benefits.join(', '),
      cat5k: cats['5KM']?.toString() || '',
      cat10k: cats['10KM']?.toString() || '',
      cat21k: cats['21KM']?.toString() || '',
      posterUrl: event.poster_url || '',
    });
    setPosterFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let finalPosterUrl = form.posterUrl;

    if (posterFile) {
      const formData = new FormData();
      formData.append('file', posterFile);
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          finalPosterUrl = uploadData.url;
        }
      } catch (err) {
        console.error('Failed to upload poster:', err);
      }
    }

    const categories: Record<string, number> = {};
    if (form.cat5k) categories['5KM'] = parseFloat(form.cat5k);
    if (form.cat10k) categories['10KM'] = parseFloat(form.cat10k);
    if (form.cat21k) categories['21KM'] = parseFloat(form.cat21k);

    // If user forgot to input any category prices, add a default so it doesn't break
    if (Object.keys(categories).length === 0) {
      categories['Standard'] = 0;
    }

    const payload = {
      name: form.name,
      date: new Date(form.date).toISOString(),
      venue: form.venue,
      description: form.description,
      benefits: form.benefits.split(',').map(b => b.trim()).filter(Boolean),
      categories,
      poster_url: finalPosterUrl,
      route_map_url: null,
      is_active: true,
    };

    if (editingEvent) {
      await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingEvent.id, ...payload }),
      });
    } else {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    setUploading(false);
    resetForm();
    fetchEvents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    fetchEvents();
  };

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.8rem' }}>
              Manage <span className="gradient-text">Events</span>
            </h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="btn-primary"
          >
            {showForm ? '✕ Cancel' : '+ Create Event'}
          </button>
        </div>

        {/* Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass mb-8"
              style={{ borderRadius: '20px', overflow: 'hidden' }}
            >
              <form onSubmit={handleSubmit} style={{ padding: '2rem' }} className="flex flex-col gap-4">
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {editingEvent ? '✏️ Edit Event' : '🆕 New Event'}
                </h3>
                <input className="input-field" placeholder="Event Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                <input className="input-field" type="datetime-local" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
                <input className="input-field" placeholder="Venue" value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} required />
                <textarea className="input-field" placeholder="Description" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required style={{ resize: 'vertical' }} />
                <input className="input-field" placeholder="Benefits (comma separated)" value={form.benefits} onChange={e => setForm(p => ({ ...p, benefits: e.target.value }))} />

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Event Poster (Local Upload OR URL)</label>
                  <div className="flex gap-4">
                    <input type="file" className="input-field flex-1" accept="image/*" onChange={(e) => setPosterFile(e.target.files?.[0] || null)} />
                    <input className="input-field flex-1" placeholder="Or enter image URL" value={form.posterUrl} onChange={e => setForm(p => ({ ...p, posterUrl: e.target.value }))} />
                  </div>
                  {form.posterUrl && !posterFile && <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '4px' }}>Currently linked: {form.posterUrl}</p>}
                </div>

                <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: '0.5rem' }}>Category Pricing (₹)</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>5KM</label>
                    <input className="input-field" type="number" placeholder="499" value={form.cat5k} onChange={e => setForm(p => ({ ...p, cat5k: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>10KM</label>
                    <input className="input-field" type="number" placeholder="799" value={form.cat10k} onChange={e => setForm(p => ({ ...p, cat10k: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>21KM</label>
                    <input className="input-field" type="number" placeholder="1299" value={form.cat21k} onChange={e => setForm(p => ({ ...p, cat21k: e.target.value }))} />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }} disabled={uploading}>
                  {uploading ? '⏳ Uploading...' : editingEvent ? '💾 Update Event' : '🚀 Create Event'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events List */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />)}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</p>
            <p style={{ color: 'var(--muted)' }}>No events yet. Create your first event!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass"
                style={{ borderRadius: '16px', padding: '1.25rem' }}
              >
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{event.name}</h3>
                    <div className="flex flex-wrap gap-3" style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
                      <span>📅 {formatDate(event.date)}</span>
                      <span>📍 {event.venue}</span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {Object.entries(event.categories).map(([cat, price]) => (
                        <span key={cat} style={{
                          background: 'var(--gradient-card)',
                          border: '1px solid var(--border-color)',
                          padding: '2px 10px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}>
                          {cat}: {formatCurrency(price)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(event)}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminEventsPage() {
  return (
    <AdminGuard>
      <EventsContent />
    </AdminGuard>
  );
}
