"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Employee {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  department: { name: string } | null;
  designation: { name: string } | null;
}

interface ApiResponse {
  data: Employee[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchEmployees(page = 1) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: "20",
        ...(search ? { search } : {}),
      });
      const res = await fetch(`/api/employees?${params}`);
      if (!res.ok) throw new Error("Failed to fetch employees");
      const json: ApiResponse = await res.json();
      setEmployees(json.data);
      setPagination(json.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--foreground)" }}
          >
            Employees
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--foreground-muted)" }}
          >
            {pagination.total} total employees
          </p>
        </div>
        <Link
          href="/employees/new"
          className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          + Add Employee
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by code or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchEmployees(1)}
          className="flex-1 h-10 px-3 rounded-lg border text-sm"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
          }}
        />
        <button
          onClick={() => fetchEmployees(1)}
          className="px-4 h-10 rounded-lg border text-sm font-medium"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
          }}
        >
          Search
        </button>
      </div>

      {error && (
        <div
          className="p-4 rounded-lg text-sm"
          style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                background: "var(--surface-hover)",
                color: "var(--foreground-muted)",
              }}
            >
              <th className="text-left px-4 py-3 font-medium">Code</th>
              <th className="text-left px-4 py-3 font-medium">Name</th>
              <th className="text-left px-4 py-3 font-medium">Department</th>
              <th className="text-left px-4 py-3 font-medium">Designation</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  Loading…
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/employees/${emp.id}`}
                      className="font-medium hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      {emp.employeeCode}
                    </Link>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--foreground)" }}>
                    {emp.firstName} {emp.lastName}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    {emp.department?.name ?? "—"}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--foreground-muted)" }}
                  >
                    {emp.designation?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: emp.isActive
                          ? "var(--accent-soft)"
                          : "var(--surface-hover)",
                        color: emp.isActive
                          ? "var(--accent)"
                          : "var(--foreground-muted)",
                      }}
                    >
                      {emp.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div
          className="flex items-center justify-between text-sm"
          style={{ color: "var(--foreground-muted)" }}
        >
          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => fetchEmployees(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 rounded-lg border disabled:opacity-40"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              Previous
            </button>
            <button
              onClick={() => fetchEmployees(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg border disabled:opacity-40"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
