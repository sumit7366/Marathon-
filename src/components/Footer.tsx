import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 1rem 1.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.4rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.75rem',
              }}
            >
              🏃 BareillyRunners
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Organizing marathon events in Bareilly. Join us and be part of the running community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/events', label: 'Events' },
                { href: '/gallery', label: 'Gallery' },
                // { href: '/admin', label: 'Admin Panel 🔒' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ color: 'var(--muted)', fontSize: '0.9rem', textDecoration: 'none' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem' }}>Contact</h4>
            <div className="flex flex-col gap-2" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Bareilly,+Uttar+Pradesh"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#25d34bff', textDecoration: 'none', cursor: 'pointer' }}
              >
                📍 Bareilly, Uttar Pradesh
              </a>              <a
                href="mailto:contact@bareillyrunners.com"
                style={{ color: '#25D366', textDecoration: 'none', cursor: 'pointer' }}
              >
                📧 contact@bareillyrunners.com
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#25D366', textDecoration: 'none' }}
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            textAlign: 'center',
            color: 'var(--muted)',
            fontSize: '0.85rem',
          }}
        >
          © {new Date().getFullYear()} BareillyRunners.{' '}
          <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
            All{' '}
          </Link>
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
