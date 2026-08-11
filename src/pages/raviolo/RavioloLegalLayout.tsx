import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/**
 * Shared chrome for Raviolo's legal pages (privacy / terms).
 * Reuses the Raviolo brand tokens + fonts, scoped under `.raviolo-scope`
 * so nothing leaks into the rest of the portfolio.
 */
export default function RavioloLegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="raviolo-scope min-h-screen bg-white text-[color:var(--rv-ink)]">
      <RavioloLegalStyles />

      {/* NAV */}
      <header className="w-full border-b border-[color:var(--rv-border)] bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link to="/raviolo" className="flex items-center gap-3">
            <img
              src="/icons/raviolo-ios-icon-v2-120x120.png"
              alt=""
              className="w-9 h-9 rounded-[22%]"
              width={36}
              height={36}
            />
            <span className="rv-display text-xl font-extrabold tracking-tight text-[color:var(--rv-tomato)]">
              raviolo<span className="text-[color:var(--rv-gold)]">.</span>
            </span>
          </Link>
          <Link
            to="/raviolo"
            className="text-sm font-medium text-[color:var(--rv-ink)]/70 hover:text-[color:var(--rv-ink)]"
          >
            ← Back
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="rv-display font-extrabold tracking-tight text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-[color:var(--rv-ink)]/50">Last updated: {updated}</p>

        <div
          className="
            legal-prose prose prose-lg mt-10 max-w-none
            prose-headings:text-[color:var(--rv-ink)]
            prose-p:text-[color:var(--rv-ink)]/80
            prose-li:text-[color:var(--rv-ink)]/80
            prose-strong:text-[color:var(--rv-ink)]
            prose-a:text-[color:var(--rv-tomato)] prose-a:no-underline hover:prose-a:underline
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-3 prose-h2:font-extrabold prose-h2:tracking-tight
          "
        >
          {children}
        </div>

        <div className="mt-14 border-t border-[color:var(--rv-border)] pt-8">
          <Link
            to="/raviolo"
            className="text-sm font-semibold text-[color:var(--rv-tomato)] hover:opacity-80"
          >
            ← Back to Raviolo
          </Link>
        </div>
      </article>
    </div>
  );
}

/**
 * Scoped Raviolo brand tokens + font import (mirrors the landing's own
 * <style> block), plus an Outfit heading rule for the legal prose.
 */
function RavioloLegalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Figtree:wght@400;500;600&display=swap');

      .raviolo-scope {
        --rv-tomato: oklch(0.56 0.2 32);
        --rv-gold: oklch(0.82 0.13 82);
        --rv-ink: oklch(0.22 0.02 60);
        --rv-border: oklch(0.93 0.01 80);
        --rv-muted: oklch(0.97 0.005 85);
        font-family: 'Figtree', ui-sans-serif, system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
      }
      .raviolo-scope .rv-display {
        font-family: 'Outfit', ui-sans-serif, system-ui, sans-serif;
        letter-spacing: -0.02em;
      }
      .raviolo-scope .legal-prose h1,
      .raviolo-scope .legal-prose h2,
      .raviolo-scope .legal-prose h3 {
        font-family: 'Outfit', ui-sans-serif, system-ui, sans-serif;
        letter-spacing: -0.02em;
      }
    `}</style>
  );
}
