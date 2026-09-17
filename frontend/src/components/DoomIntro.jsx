import React, { useState, useEffect } from 'react';

export default function DoomIntro({ onComplete }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade-out at 2.6s, complete at 3.0s
    const fadeTimer = setTimeout(() => setFading(true), 2600);
    const doneTimer = setTimeout(() => { if (onComplete) onComplete(); }, 3000);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onComplete]);

  const skip = () => {
    setFading(true);
    setTimeout(() => { if (onComplete) onComplete(); }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#05070d]"
      style={{
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.35s ease-in',
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          animation: 'dtd-logo-in 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          opacity: 0,
        }}
      >
        <img
          src="/dtd-logo.png"
          alt="DTD"
          style={{ width: '130px', height: '130px', borderRadius: '28px' }}
        />
      </div>

      {/* Skip button */}
      <button
        type="button"
        onClick={skip}
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '24px',
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '999px',
          color: 'rgba(255,255,255,0.35)',
          fontSize: '11px',
          fontFamily: 'monospace',
          letterSpacing: '0.12em',
          padding: '6px 16px',
          cursor: 'pointer',
          animation: 'dtd-skip-in 0.4s 0.8s ease-out forwards',
          opacity: 0,
        }}
      >
        SKIP
      </button>

      <style>{`
        @keyframes dtd-logo-in {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes dtd-skip-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
