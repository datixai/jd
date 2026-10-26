import type { ReactNode } from "react";

// Pure CSS reveal (scroll-driven animation), so no JavaScript is needed and content is never hidden while the page loads.
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
