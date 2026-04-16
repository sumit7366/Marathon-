'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSession } from '@/lib/types';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem('br-admin-session');
    if (session) {
      const parsed: AdminSession = JSON.parse(session);
      // Session valid for 24 hours
      if (parsed.authenticated && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000) {
        setIsAuth(true);
      } else {
        localStorage.removeItem('br-admin-session');
        router.replace('/admin');
      }
    } else {
      router.replace('/admin');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: 200, height: 40 }} />
      </div>
    );
  }

  if (!isAuth) return null;
  return <>{children}</>;
}
