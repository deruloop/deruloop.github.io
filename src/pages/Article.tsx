import { useParams, useNavigate } from "react-router-dom";
import { getArticleBySlug } from "@/lib/articles";
import TabSwitcher from "@/components/TabSwitcher";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { useEffect, useMemo, useState, ReactNode } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getTextContent((node as any).props.children);
  }
  return "";
}

function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      headings.push({ id: slugify(text), text, level: match[1].length });
    }
  }
  return headings;
}

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = getArticleBySlug(slug || "");
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(
    () => (article ? extractHeadings(article.content) : []),
    [article]
  );

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      const ids = headings.map((h) => h.id);
      let currentId = ids[0] || "";

      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Pick the last heading whose top is above 30% of the viewport
          if (rect.top <= window.innerHeight * 0.3) {
            currentId = id;
          } else {
            break;
          }
        }
      }

      setActiveId(currentId);
    };

    // Initial check after DOM renders
    const timeout = setTimeout(handleScroll, 200);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Article not found.</p>
      </div>
    );
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Static (non-floating) tab switcher */}
      <div className="flex justify-center pt-4 pb-2">
        <TabSwitcher isStatic />
      </div>

      <div className="container mx-auto px-4 pt-8 pb-16 max-w-3xl">
        <button
          onClick={() => navigate("/articles")}
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </button>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(article.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          {article.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              {article.tags.join(", ")}
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-8">{article.title}</h1>

        <div className="prose prose-neutral max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-accent prose-code:bg-primary prose-code:text-accent prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-primary prose-pre:text-primary-foreground prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:overflow-x-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children, ...props }) => {
                const id = slugify(getTextContent(children));
                return <h2 id={id} className="scroll-mt-20" {...props}>{children}</h2>;
              },
              h3: ({ children, ...props }) => {
                const id = slugify(getTextContent(children));
                return <h3 id={id} className="scroll-mt-20" {...props}>{children}</h3>;
              },
              pre: ({ children, ...props }) => (
                <pre className="bg-primary text-primary-foreground p-4 rounded-lg border border-border overflow-x-auto text-sm leading-relaxed" {...props}>
                  {children}
                </pre>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-primary text-accent px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
                return (
                  <code className={`${className} text-sm font-mono`} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {article.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Bottom paragraph nav */}
      {headings.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border z-40">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
              {headings.map((h) => (
                <button
                  key={h.id}
                  onClick={() => scrollTo(h.id)}
                  className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 flex-shrink-0 ${
                    activeId === h.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {h.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
