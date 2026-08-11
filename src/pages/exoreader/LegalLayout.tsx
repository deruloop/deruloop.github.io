import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import exoIcon from "@/assets/exoreader-icon.png";

export default function ExoreaderLegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white text-zinc-950 font-sans dark:bg-background dark:text-foreground">
      {/* Nav */}
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-8">
        <Link
          to="/exoreader"
          className="text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-950 transition-colors dark:text-muted-foreground dark:hover:text-foreground"
        >
          ← Exoreader
        </Link>
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.15em] text-zinc-500 hover:text-zinc-950 transition-colors dark:text-muted-foreground dark:hover:text-foreground"
        >
          Portfolio
        </Link>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <div className="flex items-center gap-3">
          <img src={exoIcon} alt="Exoreader" width={32} height={32} className="rounded-md" />
          <span className="text-sm font-medium tracking-tight">Exoreader</span>
        </div>

        <h1 className="mt-8 text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-zinc-500 dark:text-muted-foreground">
          Last updated: {updated}
        </p>

        <div
          className="
            prose prose-zinc mt-10 max-w-none dark:prose-invert
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3
            prose-p:text-zinc-600 dark:prose-p:text-muted-foreground
            prose-li:text-zinc-600 dark:prose-li:text-muted-foreground
            prose-a:text-zinc-950 prose-a:underline-offset-4 dark:prose-a:text-foreground
            prose-strong:text-zinc-950 dark:prose-strong:text-foreground
          "
        >
          {children}
        </div>

        <div className="mt-14 border-t border-zinc-200 pt-8 dark:border-border">
          <Link
            to="/exoreader"
            className="text-sm text-zinc-500 hover:text-zinc-950 transition-colors dark:text-muted-foreground dark:hover:text-foreground"
          >
            ← Back to Exoreader
          </Link>
        </div>
      </article>
    </main>
  );
}
