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
    // eslint-disable-next-line @next/next/no-img-element
    { name: "Azad Jammu Kashmir", el: <img src="/flags/ajk.jpg" alt="Flag of Azad Jammu and Kashmir" width={30} height={20} loading="lazy" /> },
    // eslint-disable-next-line @next/next/no-img-element
    { name: "Pakistan", el: <img src="/flags/pakistan.svg" alt="Flag of Pakistan" width={30} height={20} loading="lazy" /> },
    { name: "UK", el: <UK /> },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
      {flags.map((f) => (
        <span key={f.name} className="inline-flex items-center gap-2 text-sm font-medium text-white/70">
          <span className="block h-5 w-[30px] overflow-hidden rounded-[2px] ring-1 ring-white/15 [&>*]:h-full [&>*]:w-full [&>img]:object-cover">{f.el}</span>
          {f.name}
        </span>
      ))}
    </div>
  );
}
