"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";

interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  department: { name: string } | null;
  subDepartment: { name: string } | null;
  designation: { name: string } | null;
  employeeType: { name: string } | null;
  category: { name: string } | null;
  grade: { name: string } | null;
  level: { name: string } | null;
  unit: { name: string } | null;
  personalDetails: unknown;
  jobInfo: unknown;
  salaryStructures: unknown[];
  dependents: unknown[];
  experiences: unknown[];
  education: unknown[];
  documents: unknown[];
  kpiJd: unknown;
  exitInterview: unknown;
  assetAllocations: unknown[];
}

const TABS = [
  "Personal Details",
  "Job Info",
  "Salary Structure",
  "Dependents",
  "Experience",
  "Education",
  "Documents",
  "KPI / JD",
  "Exit Interview",
  "Assets",
] as const;

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Personal Details");

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await fetch(`/api/employees/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Employee not found");
          throw new Error("Failed to fetch employee");
        }
        const data = await res.json();
        setEmployee(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div
        className="text-center py-12"
        style={{ color: "var(--foreground-muted)" }}
      >
        Loading…
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="space-y-4">
        <Link
          href="/employees"
          className="text-sm hover:underline"
          style={{ color: "var(--foreground-muted)" }}
        >
          ← Back to Employees
        </Link>
        <div
          className="p-4 rounded-lg text-sm"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {error ?? "Employee not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/employees"
          className="text-sm hover:underline"
          style={{ color: "var(--foreground-muted)" }}
        >
          ← Back to Employees
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--foreground)" }}
            >
              {employee.firstName} {employee.lastName}
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--foreground-muted)" }}
            >
              {employee.employeeCode} · {employee.designation?.name ?? "No designation"}
            </p>
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: employee.isActive
                ? "var(--accent-soft)"
                : "var(--surface-hover)",
              color: employee.isActive
                ? "var(--accent)"
                : "var(--foreground-muted)",
            }}
          >
            {employee.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Master data summary */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border p-4"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {[
          { label: "Department", value: employee.department?.name },
          { label: "Sub-Department", value: employee.subDepartment?.name },
          { label: "Employee Type", value: employee.employeeType?.name },
          { label: "Category", value: employee.category?.name },
          { label: "Grade", value: employee.grade?.name },
          { label: "Level", value: employee.level?.name },
          { label: "Unit", value: employee.unit?.name },
          { label: "Designation", value: employee.designation?.name },
        ].map((item) => (
          <div key={item.label}>
            <p
              className="text-xs"
              style={{ color: "var(--foreground-muted)" }}
            >
              {item.label}
            </p>
            <p
              className="text-sm font-medium mt-0.5"
              style={{ color: "var(--foreground)" }}
            >
              {item.value ?? "—"}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div
        className="flex flex-wrap gap-1 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 text-sm font-medium border-b-2 transition-colors"
            style={{
              borderColor:
                activeTab === tab ? "var(--accent)" : "transparent",
              color:
                activeTab === tab
                  ? "var(--accent)"
                  : "var(--foreground-muted)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content — placeholders */}
      <div
        className="rounded-xl border p-8 text-center"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--foreground-muted)",
        }}
      >
        <p className="text-sm">
          {activeTab} — placeholder. Sub-entity CRUD will be built per feature
          branch.
        </p>
        {activeTab === "Documents" && (
          <p className="text-xs mt-2" style={{ opacity: 0.7 }}>
            Document upload logic is explicitly out of scope for this checkpoint.
          </p>
        )}
        {activeTab === "KPI / JD" && (
          <p className="text-xs mt-2" style={{ opacity: 0.7 }}>
            KPI/JD attachment UI is explicitly out of scope for this checkpoint.
          </p>
        )}
      </div>
    </div>
  );
}
