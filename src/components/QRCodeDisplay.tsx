'use client';
import { QRCodeSVG } from 'qrcode.react';
import { getVerifyUrl } from '@/lib/utils';

export default function QRCodeDisplay({ registrationId, size = 200 }: { registrationId: string; size?: number }) {
  const url = getVerifyUrl(registrationId);

  return (
    <div
      className="qr-pulse"
      style={{
        background: 'white',
        padding: '16px',
        borderRadius: '20px',
        display: 'inline-block',
      }}
    >
      <QRCodeSVG
        value={url}
        size={size}
        level="H"
        bgColor="#ffffff"
        fgColor="#0a0a0f"
        includeMargin={false}
      />
    </div>
  );
}
