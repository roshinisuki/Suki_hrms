/**
 * Login page — /login
 * Grayscale minimalist design. Email + password + stay logged in + forgot links.
 * On success, redirects to home.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const errs: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        if (issue.path[0] === 'email') errs.email = issue.message;
        if (issue.path[0] === 'password') errs.password = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Login failed');
      }

      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--surface-2)' }}
    >
      <div className="w-full max-w-sm">
        <div
          className="rounded-lg p-8"
          style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Wordmark */}
          <h1
            className="text-xl font-bold text-center mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Suki HRMS
          </h1>
          <p
            className="text-center text-sm mb-6"
            style={{ color: 'var(--text-secondary)' }}
          >
            Sign in
          </p>

          {/* Error — grayscale: bold text + border, no red */}
          {error && (
            <div
              className="px-4 py-3 rounded-md mb-4 text-sm font-semibold"
              style={{
                border: '1px solid var(--border-strong)',
                color: 'var(--text-primary)',
                background: 'var(--surface-2)',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Email
                </label>
                <a
                  href="#"
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot?
                </a>
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-md px-3 py-2 text-sm outline-none transition"
                style={{
                  border: `1px solid ${fieldErrors.email ? 'var(--border-strong)' : 'var(--border)'}`,
                  background: 'var(--surface-1)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = fieldErrors.email ? 'var(--border-strong)' : 'var(--border)')}
              />
              {fieldErrors.email && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  className="text-sm font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-md px-3 py-2 text-sm outline-none transition"
                style={{
                  border: `1px solid ${fieldErrors.password ? 'var(--border-strong)' : 'var(--border)'}`,
                  background: 'var(--surface-1)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = fieldErrors.password ? 'var(--border-strong)' : 'var(--border)')}
              />
              {fieldErrors.password && (
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Stay logged in */}
            <label
              className="flex items-center gap-2 text-sm cursor-pointer select-none"
              style={{ color: 'var(--text-secondary)' }}
            >
              <input
                type="checkbox"
                checked={stayLoggedIn}
                onChange={(e) => setStayLoggedIn(e.target.checked)}
                className="h-4 w-4 cursor-pointer"
                style={{ accentColor: 'var(--text-primary)' }}
              />
              Stay logged in
            </label>

            {/* Submit — solid dark fill */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md py-2 text-sm font-semibold transition disabled:opacity-50"
              style={{
                background: 'var(--text-primary)',
                color: 'var(--surface-1)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Test credentials hint */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          Test: admin@suki.hrms / admin123 — POST /api/auth/seed-user to create
        </p>
      </div>
    </div>
  );
}
