export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0f3d2e" />
      <path d="M9 52 L22 37 L29 44 L40 29 L55 52" fill="none" stroke="#e9a23b" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M36.6 33.6 L40 29 L43.4 33.6" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
      <text x="32" y="28" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="700" fontSize="22" fill="#ffffff">
        JD
      </text>
    </svg>
  );
}

// Full logo: mark plus "JD Travels" wordmark. light = white text for dark backgrounds.
export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="size-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={`font-heading text-2xl font-semibold ${light ? "text-white" : "text-pine"}`}>
          JD <span className="text-saffron">Travels</span>
        </span>
        <span className={`mt-1 text-[10px] font-semibold tracking-[0.25em] uppercase ${light ? "text-white/60" : "text-muted"}`}>Travel with JD</span>
      </span>
    </span>
  );
}
