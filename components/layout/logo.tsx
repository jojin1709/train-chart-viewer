export function RailChartLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="2" width="28" height="28" rx="7" fill="var(--accent-soft)" />
      <path d="M9 22V10.5A3.5 3.5 0 0 1 12.5 7h7A3.5 3.5 0 0 1 23 10.5V22" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 17h14" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12.5" cy="22" r="1.6" fill="var(--accent)" />
      <circle cx="19.5" cy="22" r="1.6" fill="var(--accent)" />
      <path d="M6.5 25.5l3-3M25.5 25.5l-3-3" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
