import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Cloud, Gift, Languages, Lock, Smartphone } from "lucide-react";
import "../../styles/ciappitti.css";
import CiappittiBird from "./CiappittiBird";
import ciappittiIcon from "@/assets/ciappitti-icon.png";
import chatShot from "@/assets/ciappitti-1-chat.png";
import modelsShot from "@/assets/ciappitti-2-models.png";
import iconsShot from "@/assets/ciappitti-5-icons.png";

// What the bird says when someone taps it.
const CHIRPS = [
  "Ciappitti!",
  "Ask me anything. I might even know it.",
  "I live on this iPhone. Rent is cheap.",
  "Thinking… mostly.",
  "Free, private, a bit wonky.",
  "Cip cip!",
];

type Model = "On device" | "Private Cloud Compute";

// Real answers from the app's on-device model, word for word.
const CHAT: { question: string; answer: string; model: Model }[] = [
  {
    question: "Are you ChatGPT?",
    answer: "No, I'm Ciappitti, a small model.",
    model: "On device",
  },
  {
    question: "Explain black holes simply",
    answer:
      "A black hole is a region where gravity is so strong that nothing, not even light, can escape. It’s like a cosmic vacuum cleaner with a boundary called the event horizon—anything crossing it is trapped.",
    model: "On device",
  },
  {
    question: "What's the weather today?",
    answer:
      "I’m a small model, so I don’t have access to real-time weather. For updates, check a reliable local source or app.",
    model: "On device",
  },
];

// The same questions to both models, word for word. Asked with the app's
// instructions and settings, and the model that answered was checked.
const FACE_OFF: { question: string; onDevice: string; privateCloud: string }[] = [
  {
    question: "How many r's are in the word strawberry?",
    onDevice: 'There are two r\'s in the word "strawberry."\n\nThe word is spelled: s-t-r-e-w-b-e-r-r-y.',
    privateCloud: "Three. The spelling is s-t-r-a-w-b-e-r-r-y, so r appears in positions 3, 8, and 9.",
  },
  {
    question: "What's heavier, a kilo of feathers or a kilo of steel?",
    onDevice:
      "A kilo of steel is heavier than a kilo of feathers—they both weigh exactly one kilogram.\n\nNo exceptions here: the weight is the same regardless of the material.",
    privateCloud: "They weigh the same—one kilo each. It’s just that the feathers take up more space.",
  },
  {
    question: "Write a haiku about Monday mornings",
    onDevice:
      "Monday light arrives—\nCoffee brews beneath tired eyes—\nWeek begins quietly.\n\nLabel: Morning Routine\nNote: Adjust caffeine if needed; consistency helps ease the start.",
    privateCloud: "Monday light creeps in,\nCoffee steam starts the routine,\nWeek begins its pace.",
  },
];

const FEATURES = [
  {
    icon: Smartphone,
    title: "On the iPhone",
    body: "Apple's on-device model answers even offline, and the chat never leaves the phone.",
  },
  {
    icon: Lock,
    title: "Private Cloud Compute",
    body: "Apple's larger model for harder questions, one tap away in any chat. Apple keeps none of the data.",
  },
  {
    icon: Gift,
    title: "Free, no account",
    body: "No sign-up, no subscription, no ads. Chats sync through iCloud, in a database only their owner can read.",
  },
  {
    icon: Languages,
    title: "Five languages",
    body: "English, Italian, Spanish, German and French, down to the example questions.",
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** The hero bird: draws itself, hops now and then, and chirps when tapped. */
function TappableBird({ size }: { size: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const [chirp, setChirp] = useState<{ text: string; key: number } | null>(null);
  const timer = useRef<number>();
  const bird = useRef<HTMLSpanElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const tap = () => {
    setChirp((previous) => {
      const choices = CHIRPS.filter((line) => line !== previous?.text);
      return { text: choices[Math.floor(Math.random() * choices.length)], key: Date.now() };
    });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setChirp(null), 2600);
    if (!reducedMotion) {
      bird.current?.animate(
        [
          { transform: "translateY(0) rotate(0deg)" },
          { transform: "translateY(-12%) rotate(-10deg)" },
          { transform: "translateY(0) rotate(8deg)" },
          { transform: "translateY(0) rotate(0deg)" },
        ],
        { duration: 700, easing: "ease-in-out" },
      );
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center">
      <div className="mb-4 h-14" aria-live="polite">
        {chirp && (
          <span
            key={chirp.key}
            className="ciappitti-bubble relative inline-block rounded-2xl bg-[var(--ciappitti-paper)] px-4 py-2 text-sm font-medium text-[var(--ciappitti-accent)]"
          >
            {chirp.text}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={tap}
        className="rounded-3xl p-2 outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[var(--ciappitti-accent)] active:scale-95"
        aria-label="Tap the bird"
      >
        <span ref={bird} className="block origin-bottom">
          <CiappittiBird size={size} drawsIn idle className="h-auto w-[261px] md:w-auto" />
        </span>
      </button>
      <span className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-muted-foreground">
        Tap the bird
      </span>
    </div>
  );
}

function ModelLabel({ model }: { model: Model }) {
  const Icon = model === "On device" ? Smartphone : Cloud;
  return (
    <span className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-muted-foreground">
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {model}
    </span>
  );
}

/** A short chat that plays once it scrolls into view. */
function ChatDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  // Each exchange shows its question, then the thinking bird, then the answer.
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const total = CHAT.length * 2;

  useEffect(() => {
    if (reducedMotion) {
      setStep(total);
      return;
    }
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion, total]);

  useEffect(() => {
    if (!started || step >= total) return;
    // A question appears quickly; an answer takes a little thinking.
    const delay = step === 0 ? 300 : step % 2 === 1 ? 1500 : 900;
    const timer = window.setTimeout(() => setStep((current) => current + 1), delay);
    return () => window.clearTimeout(timer);
  }, [started, step, total]);

  const thinking = started && step < total && step % 2 === 1;

  return (
    <div
      ref={container}
      className="mx-auto w-full max-w-md rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-[var(--shadow-large)] dark:border-border dark:bg-card sm:p-6"
    >
      <div className="flex min-h-[26rem] flex-col justify-end gap-5">
        {CHAT.map((exchange, index) => (
          <div key={exchange.question} className="flex flex-col gap-5">
            {step > index * 2 && (
              <p className="ciappitti-bubble ml-10 self-end rounded-[1.25rem] bg-[var(--ciappitti-paper)] px-4 py-2.5 text-sm text-zinc-950 dark:text-foreground">
                {exchange.question}
              </p>
            )}
            {step > index * 2 + 1 && (
              <div className="ciappitti-bubble flex flex-col items-start">
                <p className="text-sm leading-relaxed text-zinc-950 dark:text-foreground">{exchange.answer}</p>
                <ModelLabel model={exchange.model} />
              </div>
            )}
          </div>
        ))}
        {thinking && <CiappittiBird size={34} thinking label="Ciappitti is thinking" />}
      </div>
      <div className="mt-5 flex items-center gap-3 rounded-[1.4rem] border border-zinc-200 px-4 py-3 text-sm text-zinc-400 dark:border-border dark:text-muted-foreground">
        <span className="flex-1">Ask anything</span>
        {step >= total && !reducedMotion ? (
          <button
            type="button"
            onClick={() => setStep(0)}
            className="rounded-full bg-[var(--ciappitti-accent)] px-3 py-1 text-xs font-semibold text-white dark:text-zinc-950"
          >
            Play again
          </button>
        ) : (
          <span className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-border" aria-hidden />
        )}
      </div>
    </div>
  );
}

/** One question to both models, side by side. Plays once it scrolls into view. */
function ModelFaceOff() {
  const reducedMotion = usePrefersReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  // 0: just the question, 1: both birds thinking, 2: both answers.
  const [phase, setPhase] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setPhase(2);
      return;
    }
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!started || phase >= 2) return;
    const timer = window.setTimeout(() => setPhase((current) => current + 1), phase === 0 ? 400 : 1500);
    return () => window.clearTimeout(timer);
  }, [started, phase]);

  const pick = (index: number) => {
    setSelected(index);
    if (!reducedMotion) {
      setStarted(true);
      setPhase(0);
    }
  };

  const exchange = FACE_OFF[selected];
  const answers: { model: Model; text: string }[] = [
    { model: "On device", text: exchange.onDevice },
    { model: "Private Cloud Compute", text: exchange.privateCloud },
  ];

  return (
    <div ref={container}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Pick a question">
        {FACE_OFF.map((item, index) => (
          <button
            key={item.question}
            type="button"
            onClick={() => pick(index)}
            aria-pressed={index === selected}
            className={
              "rounded-full border px-4 py-2 text-left text-sm transition-colors " +
              (index === selected
                ? "border-[var(--ciappitti-accent)] bg-[var(--ciappitti-accent)] text-white dark:text-zinc-950"
                : "border-zinc-200 text-zinc-600 hover:border-[var(--ciappitti-accent)] hover:text-zinc-950 dark:border-border dark:text-muted-foreground dark:hover:text-foreground")
            }
          >
            {item.question}
          </button>
        ))}
      </div>

      <div className="mt-10 flex justify-end">
        <p
          key={selected}
          className="ciappitti-bubble max-w-md rounded-[1.25rem] bg-[var(--ciappitti-paper)] px-4 py-2.5 text-sm text-zinc-950 dark:text-foreground"
        >
          {exchange.question}
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2" aria-live="polite">
        {answers.map(({ model, text }) => (
          <div
            key={model}
            className="flex min-h-[8rem] flex-col rounded-[2rem] md:min-h-[13rem] border border-zinc-200 bg-white p-6 shadow-[var(--shadow-large)] dark:border-border dark:bg-card"
          >
            <ModelLabel model={model} />
            <div className="mt-4 flex flex-1 flex-col justify-start">
              {phase === 1 && <CiappittiBird size={34} thinking label="Ciappitti is thinking" />}
              {phase === 2 && (
                <p
                  key={selected}
                  className="ciappitti-bubble whitespace-pre-line text-sm leading-relaxed text-zinc-950 dark:text-foreground"
                >
                  {text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const eyebrow = "text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-muted-foreground";
const muted = "text-zinc-500 dark:text-muted-foreground";
const divider = (
  <div className="mx-auto max-w-5xl px-6">
    <div className="h-px bg-zinc-200 dark:bg-border" />
  </div>
);

function ComingSoon({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-[var(--ciappitti-accent)] px-4 py-2 text-sm font-semibold text-[var(--ciappitti-accent)] ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-[var(--ciappitti-accent)]" aria-hidden />
      Coming soon to the App Store
    </span>
  );
}

export default function CiappittiLanding() {
  useEffect(() => {
    const previous = document.title;
    document.title = "Ciappitti · Ask freely";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <main className="ciappitti-page min-h-screen bg-white font-sans text-zinc-950 dark:bg-background dark:text-foreground">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-8">
        <Link
          to="/"
          className="text-xs uppercase tracking-[0.2em] text-zinc-500 transition-colors hover:text-zinc-950 dark:text-muted-foreground dark:hover:text-foreground"
        >
          ← Portfolio
        </Link>
        <nav className="hidden items-center gap-6 text-xs sm:flex uppercase tracking-[0.15em] text-zinc-500 dark:text-muted-foreground">
          <a href="#name" className="transition-colors hover:text-zinc-950 dark:hover:text-foreground">The name</a>
          <a href="#features" className="transition-colors hover:text-zinc-950 dark:hover:text-foreground">What it does</a>
          <a href="#models" className="transition-colors hover:text-zinc-950 dark:hover:text-foreground">Two models</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-24 pt-14 md:grid-cols-2 md:pb-32 md:pt-24">
        <div className="order-2 md:order-1">
          <div className="flex items-center gap-3">
            <img src={ciappittiIcon} alt="" width={28} height={28} className="rounded-md border border-zinc-200 dark:border-border" />
            <span className="text-sm font-medium tracking-tight">Ciappitti</span>
          </div>
          <p className={`mt-8 ${eyebrow}`}>A small chat assistant for iPhone</p>
          <h1 className="mt-6 text-5xl font-semibold leading-[0.95] tracking-tight lg:text-7xl">
            Ask freely.
            <br />
            <span className="text-[var(--ciappitti-accent)]">It tries its best.</span>
          </h1>
          <p className={`mt-8 max-w-md text-base leading-relaxed ${muted}`}>
            Ciappitti is a pocket-sized, slightly wonky take on ChatGPT. It answers with Apple&apos;s on-device
            model and Private Cloud Compute, it&apos;s free, and it needs no account.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ComingSoon />
            <a href="#name" className={`text-sm transition-colors hover:text-zinc-950 dark:hover:text-foreground ${muted}`}>
              Why the name? →
            </a>
          </div>
        </div>
        <div className="order-1 flex justify-center md:order-2">
          <TappableBird size={300} />
        </div>
      </section>

      {divider}

      {/* The name */}
      <section id="name" className="mx-auto grid max-w-5xl gap-12 px-6 py-28 md:grid-cols-2 md:items-start">
        <div>
          <p className={eyebrow}>The name</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight">Named by my nephew.</h2>
          <p className={`mt-6 text-base leading-relaxed ${muted}`}>
            My nephew can&apos;t quite say ChatGPT. It comes out as Ciappitti. So when I made my own little
            ChatGPT, it got his name for it.
          </p>
          <p className={`mt-4 text-base leading-relaxed ${muted}`}>
            The bird is a doodle that stuck. It draws itself while Ciappitti thinks and hops when an answer
            is on its way, which is about as much as a small model can promise.
          </p>
        </div>
        <ChatDemo />
      </section>

      {divider}

      {/* Features */}
      <section id="features" className="mx-auto max-w-5xl px-6 py-28">
        <p className={eyebrow}>What it does</p>
        <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon className="h-6 w-6 text-[var(--ciappitti-accent)]" aria-hidden />
              <h3 className="mt-4 text-lg font-medium tracking-tight">{title}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-3 gap-3 sm:gap-6">
          {[
            { src: chatShot, alt: "A chat about a weekend in Rome" },
            { src: modelsShot, alt: "Picking between On device and Private Cloud Compute" },
            { src: iconsShot, alt: "Themes and app icons in Settings" },
          ].map((shot, index) => (
            <img
              key={shot.src}
              src={shot.src}
              alt={shot.alt}
              loading="lazy"
              className={
                "w-full rounded-[1.25rem] border border-zinc-200 shadow-[var(--shadow-large)] dark:border-border sm:rounded-[2rem] " +
                (index === 1 ? "sm:-translate-y-6" : "")
              }
            />
          ))}
        </div>
      </section>

      {divider}

      {/* Two models */}
      <section id="models" className="mx-auto max-w-5xl px-6 py-28">
        <p className={eyebrow}>Two models</p>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <h2 className="text-4xl font-semibold tracking-tight">Same question, two answers.</h2>
          <p className={`text-base leading-relaxed ${muted}`}>
            Any chat can switch models with one tap. The on-device model is quick and works offline. Private
            Cloud Compute is Apple&apos;s larger model, and it does better when a question needs some care.
            These are real answers from both to the same questions, word for word.
          </p>
        </div>
        <div className="mt-14">
          <ModelFaceOff />
        </div>
      </section>

      {divider}

      {/* Fine print */}
      <section className="mx-auto max-w-5xl px-6 py-28">
        <p className={eyebrow}>Fine print</p>
        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <h2 className="text-4xl font-semibold tracking-tight">Small model, honest about it.</h2>
          <div className={`space-y-4 text-base leading-relaxed ${muted}`}>
            <p>
              Ciappitti runs on Apple&apos;s models, which are much smaller than the big chatbots. It has no web
              access and it can get things wrong with a straight face.
            </p>
            <p>
              Every answer says which model wrote it. When the chosen model can&apos;t answer, the other one steps
              in and the chat says why. For quick questions, drafts and ideas it&apos;s plenty, and it costs
              nothing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-32">
        <div className="flex flex-col items-center rounded-[2rem] bg-[var(--ciappitti-paper)] px-8 py-16 text-center">
          <CiappittiBird size={96} />
          <h2 className="mt-8 text-4xl font-semibold tracking-tight md:text-5xl">Cip cip, almost there.</h2>
          <p className={`mt-4 max-w-md text-base ${muted}`}>Free, on iPhone, in five languages.</p>
          <ComingSoon className="mt-8 bg-white dark:bg-background" />
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 pb-10">
        <div className="flex flex-col items-center gap-4 border-t border-zinc-200 pt-8 text-center dark:border-border sm:flex-row sm:justify-between sm:text-left">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-muted-foreground">
            © 2026 Ciappitti. All rights reserved.
          </span>
          <Link
            to="/"
            className="text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 dark:text-muted-foreground dark:hover:text-foreground"
          >
            Portfolio
          </Link>
        </div>
      </footer>
    </main>
  );
}
