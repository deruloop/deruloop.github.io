import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import AutoplayVideo from "@/components/AutoplayVideo";
import TabSwitcher from "@/components/TabSwitcher";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getAllUpdates } from "@/lib/updates";
import { cn } from "@/lib/utils";

const mediaClasses =
  "mx-auto my-4 block h-auto max-h-[28rem] w-auto max-w-full rounded-2xl border border-border/60 bg-card shadow-medium";

const markdownComponents: Components = {
  // Links to my own pages stay in the app; everything else opens a new tab.
  a: ({ href = "", children }) =>
    href.startsWith("/") ? (
      <Link to={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  // The same image syntax takes a gif or a video. Videos play like gifs, and
  // they are far lighter for the same clip.
  img: ({ src = "", alt = "" }) =>
    /\.(mp4|webm)$/i.test(src) ? (
      <AutoplayVideo src={src} aria-label={alt} className={mediaClasses} />
    ) : (
      <img src={src} alt={alt} loading="lazy" className={mediaClasses} />
    ),
};

const proseClasses =
  "prose prose-neutral max-w-none prose-h3:mb-1 prose-h3:mt-6 prose-h3:text-base prose-h3:font-semibold prose-h3:text-foreground first:prose-h3:mt-0 prose-p:text-foreground/80 prose-strong:text-foreground prose-a:font-semibold prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-ul:my-1 prose-li:my-0.5 prose-li:text-foreground/80 prose-li:marker:text-accent prose-code:font-medium prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none";

const Markdown = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
    {children}
  </ReactMarkdown>
);

const Updates = () => {
  const updates = getAllUpdates();
  const { hash } = useLocation();

  // The browser looks for the anchor before React has rendered the timeline,
  // so a link straight to a month needs scrolling by hand.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <TabSwitcher />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Updates</h1>
        <p className="text-muted-foreground mb-10">What changed across my apps, month by month.</p>

        {updates.length === 0 ? (
          <p className="text-muted-foreground">The first update is on its way.</p>
        ) : (
          <ol className="ml-2 space-y-12 border-l-2 border-border">
            {updates.map((update, index) => (
              <li key={update.month} id={update.month} className="relative scroll-mt-24 pl-8">
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-[9px] top-2 h-4 w-4 rounded-full border-2 border-background",
                    index === 0 ? "bg-accent" : "bg-muted-foreground/40"
                  )}
                />
                <h2 className="text-2xl font-semibold">
                  <a href={`#${update.month}`} className="transition-colors hover:text-accent">
                    {update.title}
                  </a>
                </h2>
                {update.intro && (
                  <div className={cn(proseClasses, "mt-2")}>
                    <Markdown>{update.intro}</Markdown>
                  </div>
                )}
                <Accordion type="multiple" className="mt-2">
                  {update.apps.map(({ app, content }) => (
                    <AccordionItem key={app} value={app}>
                      <AccordionTrigger className="text-left text-lg font-semibold transition-colors hover:text-accent hover:no-underline">
                        {app}
                      </AccordionTrigger>
                      <AccordionContent className={proseClasses}>
                        <Markdown>{content}</Markdown>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default Updates;
