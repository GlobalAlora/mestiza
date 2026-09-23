'use client';

import { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import { esAR } from '@/i18n/es-AR';

const COOKIE_NAME = 'sm_age_ok';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function setVerified(): void {
  document.cookie = `${COOKIE_NAME}=1; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
}

function isVerified(): boolean {
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
}

// Empty subscribe — we don't need reactive updates from the cookie store.
// useSyncExternalStore handles the server→client snapshot switch internally.
function subscribe() {
  return () => {};
}

export function AgeGate() {
  // Server snapshot = false → dialog hidden during SSR (no cookie check on server).
  // Client snapshot = !isVerified() → read cookie after hydration.
  // React reconciles the mismatch silently; no hydration warning.
  const notVerified = useSyncExternalStore(
    subscribe,
    () => !isVerified(),
    () => false,
  );

  // Tracks if the user dismissed the gate in this session.
  // Set only from event handlers, never from effects → no lint error.
  const [dismissed, setDismissed] = useState(false);

  const open = notVerified && !dismissed;

  const overlayRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const t = esAR.ageGate;

  // Body scroll lock and focus management — DOM mutations are fine in effects,
  // the lint rule only restricts setState inside effects.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    confirmRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return;
    const focusable = overlayRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable?.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }

  function confirm() {
    setVerified();
    setDismissed(true);
  }

  function reject() {
    window.location.replace('https://www.who.int/health-topics/alcohol');
  }

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-desc"
      className="bg-ink/70 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-surface mx-4 w-full max-w-sm rounded-lg p-8 text-center shadow-2xl">
        <p className="text-muted mb-4 text-xs font-semibold tracking-[0.3em] uppercase">+18</p>
        <h1 id="age-gate-title" className="text-primary font-serif text-2xl">
          {t.title}
        </h1>
        <p id="age-gate-desc" className="text-muted mt-3 text-sm">
          {t.description}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            ref={confirmRef}
            onClick={confirm}
            className="bg-primary text-surface w-full rounded-md px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-opacity hover:opacity-90"
          >
            {t.confirm}
          </button>
          <button
            onClick={reject}
            className="text-muted hover:text-ink w-full px-6 py-2 text-sm transition-colors"
          >
            {t.reject}
          </button>
        </div>
        <p className="text-muted mt-6 text-xs">{t.legalNote}</p>
      </div>
    </div>
  );
}
