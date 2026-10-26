function Kashmir() {
  return (
    <svg viewBox="0 0 120 80" preserveAspectRatio="none" role="img" aria-label="Flag of Azad Jammu and Kashmir">
      <rect width="120" height="80" fill="#00843d" />
      {[8.89, 26.67, 44.44, 62.22].map((y) => (
        <rect key={y} x="30" y={y} width="90" height="8.89" fill="#fff" />
      ))}
      <rect x="30" width="45" height="40" fill="#00843d" />
      <circle cx="52" cy="20" r="10" fill="#fff" />
      <circle cx="55.5" cy="18" r="8.5" fill="#00843d" />
      <polygon fill="#fff" points="63,11 64.2,14.6 68,14.6 64.9,16.8 66.1,20.4 63,18.2 59.9,20.4 61.1,16.8 58,14.6 61.8,14.6" />
      <rect width="30" height="80" fill="#f7a800" />
    </svg>
  );
}

function Pakistan() {
  return (
    <svg viewBox="0 0 120 80" preserveAspectRatio="none" role="img" aria-label="Flag of Pakistan">
      <rect width="120" height="80" fill="#01411c" />
      <rect width="30" height="80" fill="#fff" />
      <circle cx="78" cy="40" r="20" fill="#fff" />
      <circle cx="84" cy="35" r="17" fill="#01411c" />
      <polygon fill="#fff" transform="rotate(-35 90 30)" points="90,22 92.1,28.3 98.7,28.3 93.4,32.2 95.4,38.5 90,34.6 84.6,38.5 86.6,32.2 81.3,28.3 87.9,28.3" />
    </svg>
  );
}

function UK() {
  return (
    <svg viewBox="0 0 60 40" preserveAspectRatio="none" role="img" aria-label="Flag of the United Kingdom">
      <clipPath id="uk-clip">
        <rect width="60" height="40" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
        <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="3" />
        <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="12" />
        <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  );
}

export function Flags() {
  const flags = [
    { name: "Kashmir", el: <Kashmir /> },
    { name: "Pakistan", el: <Pakistan /> },
    { name: "UK", el: <UK /> },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      {flags.map((f) => (
        <span key={f.name} className="inline-flex items-center gap-2 text-sm font-medium text-white/70">
          <span className="block h-5 w-[30px] overflow-hidden rounded-[2px] ring-1 ring-white/15 [&>svg]:h-full [&>svg]:w-full">{f.el}</span>
          {f.name}
        </span>
      ))}
    </div>
  );
}
