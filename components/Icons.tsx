import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function SearchIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function BagIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
      <path d="M5.5 8h13l-1 12h-11l-1-12Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export function AccountIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
    </svg>
  );
}

export function MenuIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...props}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

export function ChevronDownIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...props}>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

export function PlusIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function InstagramIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

export function FacebookIcon(props: P) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8.5A.5.5 0 0 1 14 8Z" />
    </svg>
  );
}
