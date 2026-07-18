"use client";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const placeholderNav = [
  { label: "Module 1" },
  { label: "Module 2" },
  { label: "Module 3" },
  { label: "Module 4" },
  { label: "Module 5" },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 shrink-0 flex flex-col transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ background: "var(--sidebar-bg)" }}
      >
        {/* Brand */}
        <div
          className="px-5 py-5 border-b"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <h1
            className="text-lg font-bold tracking-tight"
            style={{ color: "var(--sidebar-fg-active)" }}
          >
            KUN HRMS
          </h1>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--sidebar-fg)", opacity: 0.6 }}
          >
            Human Resource Management
          </p>
        </div>

        {/* Nav placeholders */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {placeholderNav.map((item) => (
            <div
              key={item.label}
              className="px-3 py-2 rounded-md text-sm cursor-default select-none"
              style={{ color: "var(--sidebar-fg)" }}
            >
              {item.label}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t text-xs"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            color: "var(--sidebar-fg)",
            opacity: 0.5,
          }}
        >
          &copy; {new Date().getFullYear()} KUN HRMS
        </div>
      </aside>
    </>
  );
}
