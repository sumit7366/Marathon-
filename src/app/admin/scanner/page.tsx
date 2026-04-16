'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import AdminGuard from '@/components/AdminGuard';
import { Registration } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

function ScannerContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Registration | null>(null);
  const [error, setError] = useState('');
  const [manualId, setManualId] = useState('');
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopScanner = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    setScanning(false);
  }, []);

  const verifyId = async (id: string) => {
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/verify?id=${id}`);
      const data = await res.json();
      if (data.registration) {
        setResult(data.registration);
        stopScanner();
      } else {
        setError('Registration not found');
      }
    } catch {
      setError('Verification failed');
    }
  };

  const startScanner = async () => {
    setResult(null);
    setError('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setScanning(true);

      // Use BarcodeDetector if available, otherwise prompt manual entry
      if ('BarcodeDetector' in window) {
        const detector = new (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector({
          formats: ['qr_code'],
        });

        scanIntervalRef.current = setInterval(async () => {
          if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
            try {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const url = barcodes[0].rawValue;
                const match = url.match(/[?&]id=([^&]+)/);
                if (match) {
                  verifyId(match[1]);
                }
              }
            } catch {
              // continue scanning
            }
          }
        }, 300);
      } else {
        // Fallback: capture frames to canvas for manual processing hint
        setError('QR scanning may require manual ID entry on this browser. Point camera at QR and enter the ID manually.');
      }
    } catch {
      setError('Camera access denied. Please allow camera permission or enter ID manually.');
    }
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, [stopScanner]);

  const handleManualVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      verifyId(manualId.trim());
    }
  };

  const isPaid = result?.payment_status === 'paid';

  return (
    <div style={{ padding: '2rem 1rem', minHeight: '80vh' }}>
      <div className="max-w-lg mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '1.8rem',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}>
            QR <span className="gradient-text">Scanner</span>
          </h1>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem' }}>
            Scan runner&apos;s QR code to verify entry
          </p>
        </motion.div>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={isPaid ? 'entry-allowed' : 'entry-denied'}
            style={{
              borderRadius: '24px',
              padding: '2rem',
              marginBottom: '2rem',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
              {isPaid ? '✅' : '❌'}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem' }}>
              {isPaid ? 'ENTRY ALLOWED' : 'PAYMENT PENDING'}
            </h2>
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '16px',
                padding: '1rem',
                textAlign: 'left',
                fontSize: '0.9rem',
              }}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between"><span style={{ opacity: 0.8 }}>Name</span><span style={{ fontWeight: 700 }}>{result.name}</span></div>
                <div className="flex justify-between"><span style={{ opacity: 0.8 }}>Event</span><span style={{ fontWeight: 600 }}>{result.event?.name || 'N/A'}</span></div>
                <div className="flex justify-between"><span style={{ opacity: 0.8 }}>Category</span><span style={{ fontWeight: 600 }}>{result.category}</span></div>
                <div className="flex justify-between"><span style={{ opacity: 0.8 }}>Reg ID</span><span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{result.registration_id}</span></div>
                <div className="flex justify-between"><span style={{ opacity: 0.8 }}>Amount</span><span style={{ fontWeight: 700 }}>{formatCurrency(result.amount)}</span></div>
              </div>
            </div>
            <button
              onClick={() => { setResult(null); setError(''); }}
              style={{
                marginTop: '1.5rem',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '12px 28px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🔄 Scan Next
            </button>
          </motion.div>
        )}

        {/* Scanner */}
        {!result && (
          <>
            <div
              className="glass"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '1.5rem',
                position: 'relative',
                aspectRatio: '4/3',
                background: '#000',
              }}
            >
              <video
                ref={videoRef}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: scanning ? 'block' : 'none',
                }}
                playsInline
                muted
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {!scanning && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '1rem',
                  color: 'white',
                }}>
                  <div style={{ fontSize: '3rem' }}>📷</div>
                  <p style={{ opacity: 0.7 }}>Camera preview</p>
                </div>
              )}
              {scanning && (
                <div style={{
                  position: 'absolute',
                  inset: '20%',
                  border: '3px solid var(--primary)',
                  borderRadius: '16px',
                  pointerEvents: 'none',
                }} />
              )}
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={scanning ? stopScanner : startScanner}
                className="btn-primary flex-1"
                style={{ padding: '14px', fontSize: '1rem' }}
              >
                {scanning ? '⏹ Stop Scanner' : '📷 Start Scanner'}
              </button>
            </div>

            {error && (
              <div style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '12px',
                padding: '12px',
                color: '#d97706',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
              }}>
                {error}
              </div>
            )}

            {/* Manual Entry */}
            <div className="glass" style={{ borderRadius: '16px', padding: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                📝 Manual Entry
              </h3>
              <form onSubmit={handleManualVerify} className="flex gap-2">
                <input
                  className="input-field flex-1"
                  placeholder="Enter Registration ID (e.g. BR-A1B2C3)"
                  value={manualId}
                  onChange={e => setManualId(e.target.value)}
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px 20px' }}>
                  Verify
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminScannerPage() {
  return (
    <AdminGuard>
      <ScannerContent />
    </AdminGuard>
  );
}
