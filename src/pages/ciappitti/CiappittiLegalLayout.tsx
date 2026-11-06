import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import "../../styles/ciappitti.css";
import ciappittiIcon from "@/assets/ciappitti-icon.png";

const quietLink =
  "text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-muted-foreground dark:hover:text-foreground";

/** Shared frame for the pages under /ciappitti: privacy and support. */
export default function CiappittiLegalLayout({
  pageTitle,
  title,
  intro,
  children,
}: {
  pageTitle: string;
  title: string;
  intro: ReactNode;
  children: ReactNode;
}) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${pageTitle} · Ciappitti`;
    // The page renders after the browser has looked for the #italiano target,
    // and a link from the bottom of the landing page would otherwise land midway.
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
    return () => {
      document.title = previous;
    };
  }, [pageTitle]);

  return (
    <main className="ciappitti-page min-h-screen bg-white font-sans text-zinc-950 dark:bg-background dark:text-foreground">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-8">
        <Link to="/ciappitti" className="flex items-center gap-3">
          <img src={ciappittiIcon} alt="" width={36} height={36} className="h-9 w-9 rounded-[22%]" />
          <span className="text-lg font-semibold tracking-tight">Ciappitti</span>
        </Link>
        <a href="#italiano" className={quietLink}>
          Italiano
        </a>
      </header>

      <article className="mx-auto max-w-3xl px-6 pb-16 pt-14">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <div className="mt-4 text-sm text-zinc-500 dark:text-muted-foreground">{intro}</div>
        <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert prose-h2:mt-10 prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-a:text-[color:var(--ciappitti-accent)]">
          {children}
        </div>
      </article>

      <footer className="mx-auto max-w-3xl px-6 pb-10">
        <div className="flex flex-col items-center gap-4 border-t border-zinc-200 pt-8 dark:border-border sm:flex-row sm:justify-between">
          <Link to="/ciappitti" className={quietLink}>
            ← Ciappitti
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/ciappitti/privacy" className={quietLink}>
              Privacy
            </Link>
            <Link to="/ciappitti/support" className={quietLink}>
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
