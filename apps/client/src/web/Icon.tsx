import React from 'react';
export default function Icon({ name, size = 24, ...props }: { name: string; size?: number; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    mail: <><rect x="2" y="5" width="20" height="16" rx="3"/><path d="m3 7 9 7 9-7"/></>,
    food: <><path d="M5 3v7a3 3 0 0 0 6 0V3M8 3v19M19 3c-4 2-4 10 0 10V3Zm0 10v9"/></>,
    move: <><circle cx="15" cy="4" r="2"/><path d="m10 9 4-2 3 4 4 1M10 9l-4 4-4-1m12-5-3 9 5 3-1 4M11 16l-5 2-3 5"/></>,
    watch: <><rect x="2" y="5" width="20" height="14" rx="3"/><path d="m10 9 5 3-5 3V9ZM8 23h8"/></>,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    idea: <><path d="M7 16a8 8 0 1 1 10 0l-1 3H8l-1-3ZM9 23h6M9 19v4M15 19v4"/></>,
    book: <><path d="M12 5c-3-3-7-3-10-2v16c4-1 7 0 10 3 3-3 6-4 10-3V3c-3-1-7-1-10 2Zm0 0v17"/></>,
    heart: <path d="M12 21S2 15 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 13-10 13Z"/>,
    bookmark: <path d="M5 3h14v19l-7-5-7 5V3Z"/>,
    close: <path d="m5 5 14 14M19 5 5 19"/>,
    menu: <path d="M4 6h16M4 12h11M4 18h7"/>,
    arrow: <path d="M3 12h18m-6-6 6 6-6 6"/>,
    back: <path d="M21 12H3m6-6-6 6 6 6"/>,
    refresh: <><path d="M21 10a9 9 0 1 0-2 8M21 3v7h-7"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 3"/></>,
    check: <><circle cx="12" cy="13" r="10"/><path d="m7 13 3 3 7-7"/></>,
    seen: <><path d="M1 13s4-7 11-7 11 7 11 7-4 7-11 7S1 13 1 13Z"/><circle cx="12" cy="13" r="3"/></>,
    calendar: <><rect x="3" y="5" width="18" height="18" rx="3"/><path d="M7 2v6M17 2v6M3 11h18"/></>,
    chef: <><path d="M6 13a5 5 0 1 1 3-9 5 5 0 0 1 6 0 5 5 0 1 1 3 9v9H6v-9ZM6 18h12"/></>,
    people: <><circle cx="8" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><path d="M1 21v-4c0-6 14-6 14 0v4m0-9c4 0 8 1 8 5v4"/></>,
    home: <><rect x="2" y="2" width="6" height="6" rx="2"/><rect x="16" y="2" width="6" height="6" rx="2"/><rect x="2" y="16" width="6" height="6" rx="2"/><rect x="16" y="16" width="6" height="6" rx="2"/></>,
    profile: <><circle cx="12" cy="7" r="4"/><path d="M3 23v-3a9 9 0 0 1 18 0v3"/></>,
    chart: <><path d="M4 23V13h4v10M11 23V3h4v20M18 23V8h4v15"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 26" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] ?? paths.idea}</svg>;
}
