"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEmployeePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    departmentId: "",
    subDepartmentId: "",
    designationId: "",
    employeeTypeId: "",
    categoryId: "",
    gradeId: "",
    levelId: "",
    unitId: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        ...form,
        departmentId: form.departmentId ? parseInt(form.departmentId) : null,
        subDepartmentId: form.subDepartmentId
          ? parseInt(form.subDepartmentId)
          : null,
        designationId: form.designationId ? parseInt(form.designationId) : null,
        employeeTypeId: form.employeeTypeId ? parseInt(form.employeeTypeId) : null,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
        gradeId: form.gradeId ? parseInt(form.gradeId) : null,
        levelId: form.levelId ? parseInt(form.levelId) : null,
        unitId: form.unitId ? parseInt(form.unitId) : null,
      };

      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create employee");
      }

      const created = await res.json();
      router.push(`/employees/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    borderColor: "var(--border)",
    background: "var(--surface)",
    color: "var(--foreground)",
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/employees"
          className="text-sm hover:underline"
          style={{ color: "var(--foreground-muted)" }}
        >
          ← Back to Employees
        </Link>
        <h1
          className="text-2xl font-bold mt-2"
          style={{ color: "var(--foreground)" }}
        >
          New Employee
        </h1>
      </div>

      {error && (
        <div
          className="p-4 rounded-lg text-sm"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground)" }}
            >
              Employee Code *
            </label>
            <input
              required
              type="text"
              value={form.employeeCode}
              onChange={(e) => update("employeeCode", e.target.value)}
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground)" }}
            >
              First Name *
            </label>
            <input
              required
              type="text"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground)" }}
            >
              Last Name *
            </label>
            <input
              required
              type="text"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
        </div>

        {/* FK placeholders — will be dropdowns once master data APIs exist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground-muted)" }}
            >
              Department ID
            </label>
            <input
              type="number"
              value={form.departmentId}
              onChange={(e) => update("departmentId", e.target.value)}
              placeholder="numeric ID"
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground-muted)" }}
            >
              Sub-Department ID
            </label>
            <input
              type="number"
              value={form.subDepartmentId}
              onChange={(e) => update("subDepartmentId", e.target.value)}
              placeholder="numeric ID"
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground-muted)" }}
            >
              Designation ID
            </label>
            <input
              type="number"
              value={form.designationId}
              onChange={(e) => update("designationId", e.target.value)}
              placeholder="numeric ID"
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground-muted)" }}
            >
              Employee Type ID
            </label>
            <input
              type="number"
              value={form.employeeTypeId}
              onChange={(e) => update("employeeTypeId", e.target.value)}
              placeholder="numeric ID"
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground-muted)" }}
            >
              Category ID
            </label>
            <input
              type="number"
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              placeholder="numeric ID"
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground-muted)" }}
            >
              Grade ID
            </label>
            <input
              type="number"
              value={form.gradeId}
              onChange={(e) => update("gradeId", e.target.value)}
              placeholder="numeric ID"
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground-muted)" }}
            >
              Level ID
            </label>
            <input
              type="number"
              value={form.levelId}
              onChange={(e) => update("levelId", e.target.value)}
              placeholder="numeric ID"
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--foreground-muted)" }}
            >
              Unit ID
            </label>
            <input
              type="number"
              value={form.unitId}
              onChange={(e) => update("unitId", e.target.value)}
              placeholder="numeric ID"
              className="w-full h-10 px-3 rounded-lg border text-sm"
              style={inputStyle}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
            style={{ background: "var(--accent)" }}
          >
            {saving ? "Saving…" : "Create Employee"}
          </button>
          <Link
            href="/employees"
            className="px-5 py-2 rounded-lg border text-sm font-medium"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
