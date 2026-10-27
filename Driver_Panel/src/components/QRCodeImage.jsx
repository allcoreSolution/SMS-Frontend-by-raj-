import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function QRCodeImage({ value, size = 160, className = '', darkColor = '#0f172a', lightColor = '#ffffff' }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    if (!value) {
      setDataUrl('');
      return;
    }
    const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
    QRCode.toDataURL(text, {
      width: size * 2, // high DPI
      margin: 1.5,
      color: {
        dark: darkColor,
        light: lightColor
      }
    })
      .then(url => setDataUrl(url))
      .catch(err => console.error('QR Code render error:', err));
  }, [value, size, darkColor, lightColor]);

  if (!dataUrl) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center animate-pulse ${className}`}
      >
        <span className="text-[10px] text-slate-400 font-mono">Loading QR...</span>
      </div>
    );
  }

  return (
    <img 
      src={dataUrl} 
      alt="Verifiable QR Code" 
      style={{ width: size, height: size }}
      className={`rounded-2xl shadow-sm bg-white p-1.5 border border-slate-200/80 dark:border-slate-700/80 object-contain ${className}`} 
    />
  );
}
