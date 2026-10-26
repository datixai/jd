import type { Scene as SceneName } from "@/content/site";

// Drawn landscapes used until JD's own photos are added.
const palettes: Record<SceneName, { sky: [string, string]; far: string; mid: string; near: string; water?: string }> = {
  valley: { sky: ["#8ec5d6", "#f3e3c3"], far: "#7fa39a", mid: "#3f7a5e", near: "#1f4f3c" },
  lake: { sky: ["#6fb0d0", "#dff0f2"], far: "#9bb7c4", mid: "#4a7f86", near: "#24524a", water: "#3e93b0" },
  peaks: { sky: ["#5d8fc0", "#e8eef5"], far: "#b9c7d6", mid: "#6e8296", near: "#34495c" },
  forest: { sky: ["#9cc9b8", "#f1ecd9"], far: "#6e9c84", mid: "#2f6b4f", near: "#123d2c" },
  meadow: { sky: ["#f0b973", "#fbe9c9"], far: "#a9b97d", mid: "#6f9a4f", near: "#3f6b34" },
  river: { sky: ["#7cc0c9", "#eef4e4"], far: "#86ab90", mid: "#3c7257", near: "#1b4636", water: "#2f86a6" },
};

export function Scene({ name, className = "" }: { name: SceneName; className?: string }) {
  const p = palettes[name];
  const id = `sky-${name}`;
  return (
    <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill={`url(#${id})`} />
      <circle cx="310" cy="62" r="22" fill="#fff6dc" opacity="0.85" />
      <path d="M0 150 L70 70 L120 115 L190 40 L250 110 L310 60 L400 130 V260 H0 Z" fill={p.far} />
      <path d="M190 40 L210 62 L198 60 L186 66 L175 56 Z M70 70 L86 88 L72 84 L60 86 Z" fill="#ffffff" opacity="0.9" />
      <path d="M0 185 L90 120 L160 170 L240 110 L320 165 L400 140 V260 H0 Z" fill={p.mid} />
      {p.water && <path d="M0 215 Q200 195 400 215 V235 Q200 220 0 235 Z" fill={p.water} opacity="0.9" />}
      <path d="M0 230 L60 200 L120 225 L200 195 L290 228 L360 205 L400 220 V260 H0 Z" fill={p.near} />
    </svg>
  );
}
