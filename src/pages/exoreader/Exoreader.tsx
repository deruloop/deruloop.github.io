import { Link } from "react-router-dom";
import exoIcon from "@/assets/exoreader-icon.png";
import heroVideo from "@/assets/exoreader-hero.mp4";

export default function Exoreader() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors">
            ← Portfolio
          </Link>
        </div>
        <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.15em] text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-28 md:pb-40">
        <div className="grid grid-cols-12 items-center gap-10 lg:gap-16">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <img src={exoIcon} alt="Exoreader" width={28} height={28} className="rounded-md" />
              <span className="text-sm font-medium tracking-tight">Exoreader</span>
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              001 &nbsp;— &nbsp;A reader for Bluesky
            </p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight leading-[0.95] md:text-6xl lg:text-7xl">
              Read the
              <br />
              <span className="text-muted-foreground">atmosphere.</span>
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground md:mt-10">
              Exoreader turns Bluesky into a calm, chronological reading surface. No algorithm.
              No noise. Just the posts, in order, whenever you want them.
            </p>
            <div className="mt-10 flex items-center gap-4 md:mt-12">
              <a
                href="#how"
                className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Get Exoreader
              </a>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Learn more →
              </a>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-7 flex items-center justify-center md:justify-end">
            <div className="w-full max-w-[260px] p-4 md:max-w-[360px] md:p-6 lg:max-w-[440px]">
              <video
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full rounded-2xl shadow-[var(--shadow-large)]"
                aria-label="Exoreader logo animation"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="h-px bg-border" /></div>

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-32">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          002 &nbsp;— &nbsp;Principles
        </p>
        <div className="mt-16 grid gap-16 md:grid-cols-3">
          {[
            { n: "01", title: "Chronological", body: "The timeline runs in time order. Nothing promoted, nothing hidden." },
            { n: "02", title: "Three-pane on desktop", body: "Feeds, posts, reader. The layout you already know from RSS." },
            { n: "03", title: "Quiet on mobile", body: "One column. Generous type. Built to be read, not scrolled." },
          ].map((f) => (
            <div key={f.n}>
              <span className="text-xs font-mono text-muted-foreground">{f.n}</span>
              <h3 className="mt-4 text-xl font-medium tracking-tight">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6"><div className="h-px bg-border" /></div>

      {/* How */}
      <section id="how" className="mx-auto max-w-5xl px-6 py-32">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          003 &nbsp;— &nbsp;How it works
        </p>
        <div className="mt-16 grid gap-12 md:grid-cols-2">
          <div>
            <h3 className="text-2xl font-medium tracking-tight">Sign in with an app password.</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Create an app password in your Bluesky settings and paste it in. Exoreader never
              sees your main password. Your session lives only in your browser.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-medium tracking-tight">Read at your pace.</h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Posts stay marked unread until you open them. Come back tomorrow, next week, next
              month — the queue is still there, in order.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-40">
        <div className="rounded-2xl border border-border bg-card px-10 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight">
            Read the sky, slowly.
          </h2>
          <div className="mt-10">
            <a
              href="#how"
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Open Exoreader
            </a>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-10">
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
          <span>© Exoreader</span>
          <Link to="/" className="hover:text-foreground transition-colors">Back to portfolio</Link>
        </div>
      </footer>
    </main>
  );
}
