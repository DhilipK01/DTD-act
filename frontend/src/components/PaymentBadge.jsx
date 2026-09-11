import React from 'react';
import { Smartphone, Banknote, CreditCard } from 'lucide-react';

export default function PaymentBadge({ method, size = 'sm' }) {
  const isSm = size === 'sm';
  
  if (method === 'GPay') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 shadow-[0_0_12px_-3px_rgba(59,130,246,0.3)] ${isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        <Smartphone className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        GPay
      </span>
    );
  }

  if (method === 'Cash') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)] ${isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <Banknote className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        Cash
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30 shadow-[0_0_12px_-3px_rgba(168,85,247,0.3)] ${isSm ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
      <CreditCard className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      Other
    </span>
  );
}
