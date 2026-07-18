"use client";

import ThemeToggle from "./ThemeToggle";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 px-4 md:px-6 h-16 border-b"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        aria-label="Toggle sidebar"
        className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ color: "var(--foreground-muted)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Search placeholder — non-functional */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          disabled
          placeholder="Search (placeholder)…"
          className="w-full h-9 px-3 rounded-lg border text-sm cursor-not-allowed"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface-hover)",
            color: "var(--foreground-muted)",
          }}
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <ThemeToggle />

        {/* User avatar placeholder — no auth integration */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
          style={{
            background: "var(--accent-soft)",
            color: "var(--accent)",
          }}
        >
          U
        </div>
      </div>
    </header>
  );
}
