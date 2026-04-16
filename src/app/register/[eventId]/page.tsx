'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Event } from '@/lib/types';
import { formatCurrency, isValidEmail, isValidPhone } from '@/lib/utils';

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    category: '',
  });

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => {
        const found = (d.events || []).find((e: Event) => e.id === params.eventId);
        setEvent(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.eventId]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    else if (!isValidPhone(form.phone)) errs.phone = 'Enter valid 10-digit phone';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!isValidEmail(form.email)) errs.email = 'Enter valid email';
    if (!form.age) errs.age = 'Age is required';
    else if (parseInt(form.age) < 10 || parseInt(form.age) > 80) errs.age = 'Age must be 10-80';
    if (!form.gender) errs.gender = 'Select gender';
    if (!form.category) errs.category = 'Select category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !event) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: event.id,
          ...form,
          age: parseInt(form.age),
        }),
      });

      const data = await res.json();
      if (res.ok && data.registration) {
        router.push(`/success/${data.registration.registration_id}`);
      } else {
        setErrors({ form: data.error || 'Registration failed' });
      }
    } catch {
      setErrors({ form: 'Network error. Please try again.' });
    }
    setSubmitting(false);
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const selectedPrice = event && form.category ? event.categories[form.category] : null;

  if (loading) {
    return (
      <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
        <div className="max-w-lg mx-auto">
          <div className="skeleton" style={{ height: '500px', borderRadius: '20px' }} />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20" style={{ minHeight: '80vh' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>😕</p>
        <h2>Event not found</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ borderRadius: '24px', padding: '2rem', overflow: 'hidden' }}
        >
          {/* Header */}
          {event.poster_url && (
            <div style={{ margin: '-2rem -2rem 0 -2rem' }}>
              <img
                src={event.poster_url}
                alt={`${event.name} Poster`}
                style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div
            style={{
              background: 'var(--gradient-primary)',
              margin: event.poster_url ? '0 -2rem 2rem -2rem' : '-2rem -2rem 2rem -2rem',
              padding: '1.5rem 2rem',
              color: 'white',
            }}
          >
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              Register for Race
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>{event.name}</p>
          </div>

          {errors.form && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '12px', color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Full Name *</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your full name"
                value={form.name}
                onChange={e => updateField('name', e.target.value)}
                id="reg-name"
              />
              {errors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.name}</span>}
            </div>

            {/* Phone */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Phone Number *</label>
              <input
                type="tel"
                className="input-field"
                placeholder="10-digit phone number"
                value={form.phone}
                onChange={e => updateField('phone', e.target.value)}
                maxLength={10}
                id="reg-phone"
              />
              {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.phone}</span>}
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Email *</label>
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => updateField('email', e.target.value)}
                id="reg-email"
              />
              {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.email}</span>}
            </div>

            {/* Age + Gender row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Age *</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Age"
                  value={form.age}
                  onChange={e => updateField('age', e.target.value)}
                  min={10}
                  max={80}
                  id="reg-age"
                />
                {errors.age && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.age}</span>}
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Gender *</label>
                <select
                  className="input-field"
                  value={form.gender}
                  onChange={e => updateField('gender', e.target.value)}
                  id="reg-gender"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.gender}</span>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', display: 'block' }}>Race Category *</label>
              
              {(!event.categories || Object.keys(event.categories).length === 0) ? (
                <div style={{ padding: '12px', background: 'var(--surface)', borderRadius: '12px', color: 'var(--muted)', fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
                  No race categories have been priced for this event yet. Please contact the organizer.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {Object.entries(event.categories).map(([cat, price]) => {
                    // Safe parsing in case price comes back as a string from DB
                    const parsedPrice = typeof price === 'string' ? parseFloat(price) : (price as number);
                    return (
                    <label
                      key={cat}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: form.category === cat ? '2px solid var(--primary)' : '1.5px solid var(--border-color)',
                        background: form.category === cat ? 'var(--gradient-card)' : 'var(--surface)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={form.category === cat}
                          onChange={e => updateField('category', e.target.value)}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span style={{ fontWeight: 600 }}>{cat}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(parsedPrice)}</span>
                    </label>
                  )})}
                </div>
              )}
              {errors.category && <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>{errors.category}</span>}
            </div>

            {/* Price Summary */}
            {selectedPrice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  background: 'var(--gradient-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 600 }}>Registration Fee</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>
                  {formatCurrency(selectedPrice)}
                </span>
              </motion.div>
            )}

            <p style={{ color: 'var(--muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>
              💡 Payment is collected offline at the venue (Cash/UPI). You&apos;ll receive a QR code for entry verification.
            </p>

            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ padding: '14px', fontSize: '1.05rem', width: '100%' }}
              id="reg-submit"
            >
              {submitting ? '⏳ Registering...' : '🏃 Register Now'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
