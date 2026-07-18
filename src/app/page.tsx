export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          Dashboard
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--foreground-muted)" }}
        >
          Placeholder — module content will be added per feature branch.
        </p>
      </div>

      {/* Placeholder stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["Card 1", "Card 2", "Card 3", "Card 4"].map((label) => (
          <div
            key={label}
            className="rounded-xl border p-6"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg mb-4"
              style={{ background: "var(--accent-soft)" }}
            />
            <p
              className="text-3xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              —
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--foreground-muted)" }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
