'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminGuard from '@/components/AdminGuard';
import { GalleryImage, Event } from '@/lib/types';

function GalleryContent() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [eventId, setEventId] = useState('');

  const fetchData = () => {
    Promise.all([
      fetch('/api/gallery').then(r => r.json()),
      fetch('/api/events').then(r => r.json()),
    ]).then(([g, e]) => {
      setImages(g.images || []);
      setEvents(e.events || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setUploading(true);
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: url, event_id: eventId || null, caption: caption || null }),
    });
    setUrl('');
    setCaption('');
    setEventId('');
    setUploading(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.8rem', marginBottom: '0.5rem' }}>
            Manage <span className="gradient-text">Gallery</span>
          </h1>
          <p style={{ color: 'var(--muted)' }}>{images.length} photos</p>
        </motion.div>

        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass mb-8"
          style={{ borderRadius: '20px', padding: '1.5rem' }}
        >
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>📤 Add Photo</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const file = formData.get('file') as File;
            const link = formData.get('url') as string;
            
            if (!file?.size && !link?.trim()) {
              alert('Please select a file or provide an image URL');
              return;
            }

            setUploading(true);
            let finalUrl = link;

            try {
              if (file?.size) {
                const uploadRes = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData, // the form contains 'file'
                });
                if (!uploadRes.ok) throw new Error('Upload failed');
                const uploadData = await uploadRes.json();
                finalUrl = uploadData.url;
              }

              await fetch('/api/gallery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  image_url: finalUrl, 
                  event_id: eventId || null, 
                  caption: caption || null 
                }),
              });
              
              setUrl('');
              setCaption('');
              setEventId('');
              // @ts-ignore
              e.target.reset();
              fetchData();
            } catch (err) {
              alert('Failed to upload image. Please try again.');
            } finally {
              setUploading(false);
            }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Upload File (Local)</label>
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    className="input-field"
                  />
               </div>
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>OR Image URL</label>
                  <input
                    name="url"
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                  />
               </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Caption (Optional)</label>
                  <input
                    className="input-field"
                    placeholder="Caption"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                  />
              </div>
              <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>Link to Event (Optional)</label>
                 <select className="input-field" value={eventId} onChange={e => setEventId(e.target.value)}>
                   <option value="">No event linked</option>
                   {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                 </select>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={uploading} style={{ alignSelf: 'flex-start' }}>
              {uploading ? '⏳ Uploading...' : '➕ Add Photo'}
            </button>
          </form>
        </motion.div>

        {/* Images Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '16px' }} />)}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼</p>
            <p style={{ color: 'var(--muted)' }}>No photos yet. Add some!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '1',
                  background: 'var(--surface)',
                }}
              >
                <img
                  src={img.image_url}
                  alt={img.caption || 'Photo'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  onClick={() => handleDelete(img.id)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(239,68,68,0.9)',
                    border: 'none',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  🗑
                </button>
                {img.caption && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    padding: '1rem 0.75rem 0.5rem',
                    color: 'white',
                    fontSize: '0.8rem',
                  }}>
                    {img.caption}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  return (
    <AdminGuard>
      <GalleryContent />
    </AdminGuard>
  );
}
