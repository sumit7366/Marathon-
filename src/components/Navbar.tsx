'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('br-admin-session'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('br-admin-session');
    window.location.href = '/admin';
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass"
      style={{ borderBottom: '1px solid var(--glass-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              background: 'var(--gradient-primary)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              🏃 BareillyRunners
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{
                  color: 'var(--foreground)',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '20px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.background = 'rgba(232,93,4,0.1)';
                  (e.target as HTMLElement).style.borderColor = 'var(--primary)';
                  (e.target as HTMLElement).style.color = 'var(--primary)';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.background = 'var(--surface)';
                  (e.target as HTMLElement).style.borderColor = 'var(--border-color)';
                  (e.target as HTMLElement).style.color = 'var(--foreground)';
                }}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium transition-all cursor-pointer"
                style={{
                  color: '#ef4444',
                  background: 'var(--surface)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '20px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
                onMouseEnter={e => {
                  (e.target as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
                  (e.target as HTMLElement).style.borderColor = '#ef4444';
                }}
                onMouseLeave={e => {
                  (e.target as HTMLElement).style.background = 'var(--surface)';
                  (e.target as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)';
                }}
              >
                🚪 Logout
              </button>
            )}

            <div style={{ marginLeft: '10px' }}>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-lg flex flex-col items-center justify-center gap-1.5"
              style={{ background: 'rgba(232,93,4,0.1)' }}
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block w-5 h-0.5 rounded-full"
                style={{ background: 'var(--primary)' }}
              />
              <motion.span
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-5 h-0.5 rounded-full"
                style={{ background: 'var(--primary)' }}
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block w-5 h-0.5 rounded-full"
                style={{ background: 'var(--primary)' }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden glass"
            style={{ borderTop: '1px solid var(--glass-border)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-lg text-base font-medium no-underline"
                  style={{ color: 'var(--foreground)' }}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="px-4 py-3 rounded-lg text-base font-medium text-left cursor-pointer"
                  style={{ color: '#ef4444' }}
                >
                  🚪 Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
