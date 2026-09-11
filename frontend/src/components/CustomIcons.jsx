import React from 'react';

// 1. Doctor Doom Villain Mask (Marvel)
export function DoctorDoomIcon({ className = "w-12 h-12" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer Hood Cowl (Dark Green) */}
      <path
        d="M50 4 C26 4 10 24 12 56 C14 74 24 90 27 96 C35 88 44 86 50 86 C56 86 65 88 73 96 C76 90 86 74 88 56 C90 24 74 4 50 4 Z"
        fill="#143823"
        stroke="#276b3f"
        strokeWidth="2.5"
      />
      {/* Hood Interior Shadow */}
      <path
        d="M50 9 C32 9 19 26 21 53 C22 68 30 78 33 82 C38 76 44 74 50 74 C56 74 62 76 67 82 C70 78 78 68 79 53 C81 26 68 9 50 9 Z"
        fill="#07100b"
      />
      {/* Iron Faceplate */}
      <path
        d="M33 32 C33 25 42 22 50 22 C58 22 67 25 67 32 C68 45 69 58 66 74 C62 82 54 85 50 85 C46 85 38 82 34 74 C31 58 32 45 33 32 Z"
        fill="#64748b"
        stroke="#94a3b8"
        strokeWidth="2"
      />
      {/* Forehead Band */}
      <path
        d="M34 32 C41 28 59 28 66 32 L65 37 C59 34 41 34 35 37 Z"
        fill="#94a3b8"
      />
      {/* Rivets on Forehead */}
      <circle cx="38" cy="33" r="1.3" fill="#1e293b" />
      <circle cx="50" cy="31" r="1.3" fill="#1e293b" />
      <circle cx="62" cy="33" r="1.3" fill="#1e293b" />
      {/* Angular Eye Sockets */}
      <polygon points="37,44 48,46 47,53 38,51" fill="#04060a" />
      <polygon points="63,44 52,46 53,53 62,51" fill="#04060a" />
      {/* Menacing Glowing Green Eyes */}
      <ellipse cx="43" cy="48.5" rx="3.5" ry="1.8" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 5px #4ade80)' }} />
      <ellipse cx="57" cy="48.5" rx="3.5" ry="1.8" fill="#22c55e" style={{ filter: 'drop-shadow(0 0 5px #4ade80)' }} />
      {/* Nose Bridge */}
      <polygon points="50,42 48,58 52,58" fill="#475569" />
      {/* Robotic Mouth Grill Vents */}
      <rect x="42" y="64" width="16" height="2.2" rx="1" fill="#1e293b" />
      <rect x="44" y="68" width="12" height="2" rx="1" fill="#1e293b" />
      <rect x="46" y="72" width="8" height="1.8" rx="0.9" fill="#1e293b" />
      {/* Mouth Vertical Bars */}
      <line x1="47" y1="63" x2="47" y2="75" stroke="#334155" strokeWidth="1.2" />
      <line x1="50" y1="63" x2="50" y2="75" stroke="#334155" strokeWidth="1.2" />
      <line x1="53" y1="63" x2="53" y2="75" stroke="#334155" strokeWidth="1.2" />
      {/* Cheek Rivets */}
      <circle cx="37" cy="62" r="1.2" fill="#334155" />
      <circle cx="63" cy="62" r="1.2" fill="#334155" />
    </svg>
  );
}

// 2. Batman Batarang Symbol (Men Are Brave)
export function BatarangIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className}>
      <path d="M16 8 C14.5 12 11 13.5 7 10 C5 8 3 7 1 8 C1 13 4 18 8 20 C11.5 21.5 14.5 20.5 16 17 C17.5 20.5 20.5 21.5 24 20 C28 18 31 13 31 8 C29 7 27 8 25 10 C21 13.5 17.5 12 16 8 Z" />
    </svg>
  );
}

// 3. Thanos Double-Bladed Sword (I Am Inevitable)
export function ThanosSwordIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <g transform="rotate(45 12 12)">
        {/* Top Blade */}
        <path d="M10.5 2 L13.5 2 L14.5 8 L13.5 10 L10.5 10 L9.5 8 Z" />
        {/* Central Handguard / Hilt */}
        <rect x="8.5" y="10.5" width="7" height="3" rx="0.75" />
        <circle cx="12" cy="12" r="1" fill="#040711" />
        {/* Bottom Blade */}
        <path d="M10.5 14 L13.5 14 L14.5 16 L13.5 22 L10.5 22 L9.5 16 Z" />
      </g>
    </svg>
  );
}
