import type { ReactNode } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBasket, Sparkles, BookOpen, Apple } from "lucide-react";
import spinacio from "@/assets/raviolo-spinacio.webp";
import mistoManzo from "@/assets/raviolo-misto-manzo.webp";

const assistants = [
  {
    name: "Spinacio",
    image: spinacio,
    back: "#3F7A4B",
    blurb:
      "Keeps the shopping list sorted by aisle and steers every basket toward fresher, better ingredients.",
  },
  {
    name: "Misto Manzo",
    image: mistoManzo,
    back: "var(--rv-tomato)",
    blurb:
      "Turns whatever is in the kitchen into a real recipe, with steps and portions ready for the pan.",
  },
];

// Side characters — smaller cards, art still to come. Colors are theirs.
const sideCharacters = [
  {
    name: "Olio",
    role: "the plate",
    color: "#8A8A2E",
    tagline: "Looks at what is on the plate and says what it still wants.",
    blurb:
      "Add things as they go on the plate and he keeps a picture of it: what is there, what would round it off, named as foods rather than as nutrients. A bowl of pasta gets a suggestion of something green and something with protein, in one sentence, with no numbers and no lecture. He is the one to ask whether a meal is finished.",
  },
  {
    name: "Ricotta",
    role: "the notebook",
    color: "#C97B96",
    tagline: "Say it once, and it holds.",
    blurb:
      "Mention a peanut allergy, a lactose problem or a hatred of coriander, and she writes it down without being asked. Every recipe after that comes back without it, and no one brings it up again. Ask her what is in the notebook and she reads it back.",
  },
  {
    name: "Amaretto",
    role: "the details",
    color: "#B07A2A",
    tagline: "Temperatures, times, and why the sauce split.",
    blurb:
      "He answers the questions with a right answer: how long pesto keeps, what to toast oats at and for how long, how much caffeine is in a cup, why mayonnaise breaks and how to bring it back. He arrives on his own when a question is his, gives the number, and leaves a dry remark on the way out.",
  },
];

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

      {/* AI ASSISTANTS */}
      <section id="assistants" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-[color:var(--rv-tomato)]">
            Meet the crew
          </p>
          <h2 className="rv-display mt-3 font-extrabold text-4xl sm:text-5xl tracking-tight">
            AI assistants
          </h2>
          <p className="mt-6 text-lg text-[color:var(--rv-ink)]/70">
            Meet Spinacio, Misto Manzo and many other personal AI assistants to create
            recipes as you want them, keep track of your shopping list and eat better.
          </p>
        </div>

        <div className="mt-12 flex flex-col lg:flex-row lg:items-stretch justify-center gap-10 lg:gap-14">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {assistants.map((a) => (
              <div key={a.name} className="w-40 sm:w-48">
                <AssistantCard name={a.name} image={a.image} blurb={a.blurb} back={a.back} />
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:border-l lg:border-[color:var(--rv-border)] lg:pl-14">
            <p className="rv-display text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--rv-ink)]/45 text-center lg:text-left">
              And more…
            </p>
            <div className="mt-5 flex flex-1 items-stretch justify-center gap-3 sm:gap-4">
              {sideCharacters.map((c) => (
                <div key={c.name} className="w-28 sm:w-32">
                  <SideCharacterCard
                    name={c.name}
                    role={c.role}
                    color={c.color}
                    blurb={c.blurb}
                  />
                </div>
              ))}
            </div>
          </div>
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
            <Link to="/raviolo/privacy" className="hover:text-[color:var(--rv-ink)]">Privacy</Link>
            <Link to="/raviolo/terms" className="hover:text-[color:var(--rv-ink)]">Terms</Link>
            <a href="mailto:cristiano@calicchia.dev" className="hover:text-[color:var(--rv-ink)]">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AssistantCard({
  name,
  image,
  blurb,
  back = "var(--rv-tomato)",
}: {
  name: string;
  image: string;
  blurb: string;
  back?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className={"rv-flip aspect-[4/5] w-full rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--rv-tomato)]" + (open ? " is-flipped" : "")}
    >
      <div className="rv-flip-inner">
        {/* Front */}
        <div className="rv-flip-face flex flex-col rounded-3xl border border-[color:var(--rv-border)] bg-white p-5 text-center">
          <div className="relative flex-1 min-h-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(closest-side, color-mix(in oklab, var(--rv-gold) 45%, transparent), transparent 70%)",
              }}
            />
            <img
              src={image}
              alt={name}
              className="relative h-full w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
            />
          </div>
          <h3 className="rv-display mt-3 text-lg font-bold">{name}</h3>
          <span className="mt-1 inline-block text-xs font-semibold text-[color:var(--rv-tomato)]">
            Tap to meet
          </span>
        </div>
        {/* Back */}
        <div
          className="rv-flip-back rv-flip-face flex flex-col items-center justify-center rounded-3xl border border-[color:var(--rv-border)] p-6 text-center text-white"
          style={{ background: back }}
        >
          <h3 className="rv-display text-lg font-bold">{name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/90">{blurb}</p>
          <span className="mt-4 inline-block text-xs font-semibold text-white/70">Tap to flip back</span>
        </div>
      </div>
    </button>
  );
}

function SideCharacterCard({
  name,
  role,
  color,
  blurb,
}: {
  name: string;
  role: string;
  color: string;
  blurb: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className={"rv-flip aspect-[3/4] lg:aspect-auto lg:h-full w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--rv-tomato)]" + (open ? " is-flipped" : "")}
    >
      <div className="rv-flip-inner">
        {/* Front — solid character color with a fixed-size letter */}
        <div
          className="rv-flip-face flex flex-col items-center justify-center rounded-2xl p-3 text-center text-white"
          style={{ background: color }}
        >
          <span className="rv-display text-4xl font-extrabold leading-none">
            {name.charAt(0)}
          </span>
          <h3 className="rv-display mt-3 text-sm font-bold leading-tight">{name}</h3>
          <p className="text-[11px] font-medium text-white/70">{role}</p>
        </div>
        {/* Back — the blurb */}
        <div className="rv-flip-back rv-flip-face flex flex-col rounded-2xl border border-[color:var(--rv-border)] bg-white p-2.5 text-left overflow-hidden">
          <h3 className="rv-display text-[10px] font-bold leading-tight" style={{ color }}>
            {name}
          </h3>
          <p className="mt-1 flex-1 min-h-0 text-[7px] leading-[1.2] text-[color:var(--rv-ink)]/75">
            {blurb}
          </p>
        </div>
      </div>
    </button>
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
      .raviolo-scope .rv-flip {
        perspective: 1200px;
      }
      .raviolo-scope .rv-flip-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
        transform-style: preserve-3d;
      }
      .raviolo-scope .rv-flip.is-flipped .rv-flip-inner {
        transform: rotateY(180deg);
      }
      .raviolo-scope .rv-flip-face {
        position: absolute;
        inset: 0;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      .raviolo-scope .rv-flip-back {
        transform: rotateY(180deg);
      }
      @media (prefers-reduced-motion: reduce) {
        .raviolo-scope .rv-flip-inner {
          transition: none;
        }
      }
    `}</style>
  );
}
