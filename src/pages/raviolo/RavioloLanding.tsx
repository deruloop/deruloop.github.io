import type { ReactNode } from "react";
import { ShoppingBasket, Sparkles, BookOpen, Apple } from "lucide-react";

/**
 * Raviolo — standalone landing page.
 *
 * Drop-in usage:
 *  1. Copy this file into your project (e.g. src/pages/RavioloLanding.tsx).
 *  2. Copy /public/icons/* from this bundle into your project's /public/icons/.
 *  3. Ensure Tailwind CSS + lucide-react are installed.
 *  4. Render <RavioloLanding /> from any route (e.g. /raviolo).
 *
 * The component ships its own <style> block with the Raviolo brand tokens
 * (colors, fonts) so it doesn't depend on your global CSS.
 */
export default function RavioloLanding() {
  return (
    <div className="raviolo-scope min-h-screen bg-white text-[color:var(--rv-ink)]">
      <RavioloStyles />

      {/* NAV */}
      <header className="w-full border-b border-[color:var(--rv-border)] bg-white/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
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
          </a>
          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-[color:var(--rv-ink)]/70">
            <a href="#features" className="hover:text-[color:var(--rv-ink)]">Features</a>
            <a href="#how" className="hover:text-[color:var(--rv-ink)]">How it works</a>
            <a href="#faq" className="hover:text-[color:var(--rv-ink)]">FAQ</a>
          </nav>
          <a
            href="#download"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--rv-ink)] text-white px-4 py-2 text-sm font-semibold hover:opacity-90"
          >
            <Apple className="h-4 w-4" strokeWidth={2.5} />
            Get the app
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative overflow-hidden"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in oklab, var(--rv-tomato) 18%, transparent) 2.5px, transparent 3.5px)",
          backgroundSize: "22px 22px",
          backgroundPosition: "center top",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.95) 60%, #fff 100%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--rv-border)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--rv-ink)]/60">
              <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--rv-gold)]" /> Now in beta
            </span>
            <h1 className="rv-display mt-6 font-extrabold tracking-tight text-5xl sm:text-6xl leading-[1.02]">
              Turn ingredients into{" "}
              <span className="text-[color:var(--rv-tomato)]">inspiration</span>.
            </h1>
            <p className="mt-6 text-lg text-[color:var(--rv-ink)]/70 max-w-lg">
              Raviolo is your AI-first meal companion. Smart shopping lists by aisle,
              a home for every recipe you love, and instant dish ideas whenever the
              fridge feels uninspired.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#download"
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--rv-tomato)] text-white px-6 py-3 text-sm font-semibold shadow-[0_10px_30px_-10px_oklch(0.56_0.2_32_/_0.6)] hover:opacity-90"
              >
                <Apple className="h-4 w-4" strokeWidth={2.5} />
                Download for iOS
              </a>
            </div>
            <p className="mt-4 text-xs text-[color:var(--rv-ink)]/50">
              Free while in beta · No account required · Data stays on your device
            </p>
          </div>

          <div className="relative flex justify-center">
            <div
              aria-hidden
              className="absolute inset-0 -m-8 rounded-[40%] blur-3xl"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--rv-gold) 45%, transparent), transparent 70%)",
              }}
            />
            <img
              src="/icons/raviolo-logo-stacked.png"
              alt="Raviolo"
              className="relative w-[360px] max-w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
              width={1024}
              height={1280}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[color:var(--rv-tomato)]">
            Three tabs. Zero friction.
          </p>
          <h2 className="rv-display mt-3 font-extrabold text-4xl sm:text-5xl tracking-tight">
            Everything a home cook needs, nothing they don't.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          <Feature
            icon={<ShoppingBasket className="h-6 w-6" strokeWidth={2.2} />}
            title="Smart shopping list"
            body="Type items the way you think. Raviolo groups them by aisle so you shop in one clean sweep — no more backtracking."
            accent="gold"
          />
          <Feature
            icon={<Sparkles className="h-6 w-6" strokeWidth={2.2} />}
            title="AI inspiration"
            body="Tell it what's in the fridge or the mood you're in. Get a real recipe you can cook tonight — and save it before it disappears."
            accent="tomato"
            featured
          />
          <Feature
            icon={<BookOpen className="h-6 w-6" strokeWidth={2.2} />}
            title="Saved recipes"
            body="Paste a link, write your own, or keep what the AI cooked up. All your recipes live in one calm library."
            accent="gold"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-[color:var(--rv-muted)]/60 border-y border-[color:var(--rv-border)]">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[color:var(--rv-tomato)]">
              How it works
            </p>
            <h2 className="rv-display mt-3 font-extrabold text-4xl sm:text-5xl tracking-tight">
              From craving to cooking in three steps.
            </h2>
          </div>
          <ol className="mt-14 grid md:grid-cols-3 gap-8">
            {[
              {
                n: "01",
                t: "Tell Raviolo what you have",
                d: "A few ingredients, a mood, a cuisine — anything counts.",
              },
              {
                n: "02",
                t: "Get a real recipe",
                d: "AI writes a dish with steps, portions, and ingredients you can actually shop.",
              },
              {
                n: "03",
                t: "Save it or shop it",
                d: "One tap to keep the recipe forever, one tap to add missing items to your list.",
              },
            ].map((s) => (
              <li
                key={s.n}
                className="relative rounded-3xl bg-white border border-[color:var(--rv-border)] p-8"
              >
                <span className="rv-display text-6xl font-extrabold text-[color:var(--rv-tomato)]/15 leading-none">
                  {s.n}
                </span>
                <h3 className="rv-display mt-4 text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-sm text-[color:var(--rv-ink)]/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section id="download" className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-[color:var(--rv-tomato)] text-white p-12 md:p-16 flex flex-col md:flex-row items-center gap-10">
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 2px, transparent 3px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="relative flex-1">
            <h2 className="rv-display font-extrabold text-4xl sm:text-5xl tracking-tight leading-[1.05]">
              Cook happier.<br />Start with a raviolo.
            </h2>
            <p className="mt-4 text-white/85 max-w-md">
              Available for iPhone. The Android build is simmering.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#"
                className="inline-flex items-center gap-2 rounded-full bg-white text-[color:var(--rv-ink)] px-6 py-3 text-sm font-semibold hover:opacity-90"
              >
                <Apple className="h-4 w-4" strokeWidth={2.5} />
                Download for iOS
              </a>
            </div>
          </div>
          <img
            src="/icons/raviolo-ios-icon-v2-1024x1024.png"
            alt=""
            className="relative w-48 h-48 rounded-[22%] shadow-2xl"
            width={192}
            height={192}
          />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 pb-24">
        <h2 className="rv-display font-extrabold text-3xl tracking-tight">Questions</h2>
        <div className="mt-8 space-y-4">
          {[
            {
              q: "Do I need an account?",
              a: "No. Raviolo stores everything locally on your device by default. Sign-in is coming for sync across devices.",
            },
            {
              q: "Does the AI remember my conversations?",
              a: "The Inspire chat resets when you close the app — so save any recipe you want to keep before you go.",
            },
            {
              q: "Is it free?",
              a: "Yes, during beta. A small subscription is planned for advanced AI features when we launch.",
            },
          ].map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-[color:var(--rv-border)] bg-white p-5"
            >
              <summary className="cursor-pointer list-none rv-display font-semibold text-lg flex items-center justify-between">
                {f.q}
                <span className="text-[color:var(--rv-tomato)] text-2xl leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-[color:var(--rv-ink)]/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[color:var(--rv-border)]">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-[color:var(--rv-ink)]/60">
          <div className="flex items-center gap-2">
            <span className="rv-display font-extrabold text-[color:var(--rv-tomato)]">
              raviolo<span className="text-[color:var(--rv-gold)]">.</span>
            </span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[color:var(--rv-ink)]">Privacy</a>
            <a href="#" className="hover:text-[color:var(--rv-ink)]">Terms</a>
            <a href="mailto:hello@raviolo.app" className="hover:text-[color:var(--rv-ink)]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
  accent,
  featured,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  accent: "gold" | "tomato";
  featured?: boolean;
}) {
  return (
    <div
      className={
        "rounded-3xl border border-[color:var(--rv-border)] bg-white p-8 transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)] " +
        (featured ? "md:-translate-y-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)]" : "")
      }
    >
      <div
        className={
          "w-12 h-12 rounded-2xl flex items-center justify-center " +
          (accent === "tomato"
            ? "bg-[color:var(--rv-tomato)] text-white"
            : "bg-[color:var(--rv-gold)]/25 text-[color:var(--rv-ink)]")
        }
      >
        {icon}
      </div>
      <h3 className="rv-display mt-6 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm text-[color:var(--rv-ink)]/70 leading-relaxed">{body}</p>
    </div>
  );
}

/**
 * Scoped Raviolo brand tokens + font import.
 * Everything is namespaced under `.raviolo-scope` so it can't collide with
 * the rest of your site.
 */
function RavioloStyles() {
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
    `}</style>
  );
}
