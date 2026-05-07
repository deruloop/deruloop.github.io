import { useParams, useNavigate } from "react-router-dom";
import { getArticleBySlug } from "@/lib/articles";
import TabSwitcher from "@/components/TabSwitcher";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { useEffect, useMemo, useRef, useState, ReactNode, CSSProperties, isValidElement } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const codeTheme: Record<string, CSSProperties> = {
  'pre[class*="language-"]': {
    background: "transparent",
    color: "hsl(36 52% 91%)", // cream (default text)
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "0.875rem",
    lineHeight: "1.6",
    margin: 0,
    padding: 0,
    whiteSpace: "pre",
  },
  'code[class*="language-"]': {
    background: "transparent",
    color: "hsl(36 52% 91%)",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  comment: { color: "hsl(24 15% 55%)", fontStyle: "italic" },
  prolog: { color: "hsl(24 15% 55%)" },
  doctype: { color: "hsl(24 15% 55%)" },
  cdata: { color: "hsl(24 15% 55%)" },
  punctuation: { color: "hsl(36 30% 75%)" },
  property: { color: "hsl(40 59% 71%)" }, // accent-highlight
  tag: { color: "hsl(40 59% 71%)" },
  boolean: { color: "hsl(39 78% 60%)" }, // gold lighter
  number: { color: "hsl(39 78% 60%)" },
  constant: { color: "hsl(39 78% 60%)" },
  symbol: { color: "hsl(39 78% 60%)" },
  selector: { color: "hsl(40 59% 71%)" },
  "attr-name": { color: "hsl(40 59% 71%)" },
  string: { color: "hsl(24 50% 78%)" }, // warm taupe-cream
  char: { color: "hsl(24 50% 78%)" },
  builtin: { color: "hsl(40 70% 65%)" },
  inserted: { color: "hsl(40 70% 65%)" },
  operator: { color: "hsl(36 30% 75%)" },
  entity: { color: "hsl(36 30% 75%)", cursor: "help" },
  url: { color: "hsl(40 59% 71%)" },
  variable: { color: "hsl(36 52% 91%)" },
  atrule: { color: "hsl(39 78% 60%)" },
  "attr-value": { color: "hsl(24 50% 78%)" },
  function: { color: "hsl(39 78% 56%)" }, // accent gold
  "class-name": { color: "hsl(40 59% 78%)" },
  keyword: { color: "hsl(39 78% 56%)", fontWeight: "600" }, // accent gold, bold
  regex: { color: "hsl(24 50% 78%)" },
  important: { color: "hsl(39 78% 56%)", fontWeight: "bold" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
};

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
  if (isValidElement(node)) {
    return getTextContent(node.props.children);
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

  const paragraphNavRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!activeId) return;
    const container = paragraphNavRef.current;
    if (!container) return;

    const activeButton = container.querySelector<HTMLButtonElement>(`button[data-id="${activeId}"]`);
    if (!activeButton) return;
    activeButton.scrollIntoView({ block: "nearest", inline: "center" });
  }, [activeId]);

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

        <div className="prose prose-neutral max-w-none prose-headings:text-foreground prose-headings:font-bold prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-foreground/80 prose-strong:text-foreground prose-a:text-accent prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-code:bg-primary prose-code:text-primary-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-pre:bg-primary prose-pre:text-primary-foreground prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:overflow-x-auto prose-img:rounded-2xl prose-img:border prose-img:border-border/60 prose-img:shadow-medium prose-img:my-6 prose-img:mx-auto prose-img:max-w-lg prose-img:w-full prose-img:bg-card">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children, ...props }) => {
                const id = slugify(getTextContent(children));
                return <h2 id={id} className="scroll-mt-20 text-3xl font-bold mt-12 mb-4" {...props}>{children}</h2>;
              },
              h3: ({ children, ...props }) => {
                const id = slugify(getTextContent(children));
                return <h3 id={id} className="scroll-mt-20 text-2xl font-bold mt-8 mb-3" {...props}>{children}</h3>;
              },
              a: ({ children, ...props }) => (
                <a
                  {...props}
                  target={props.href?.startsWith("http") ? "_blank" : undefined}
                  rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-accent font-bold no-underline hover:underline"
                >
                  {children}
                </a>
              ),
              pre: ({ children }) => <>{children}</>,
              code: ({ className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  );
                }
                const language = match?.[1] || "swift";
                return (
                  <SyntaxHighlighter
                    language={language}
                    style={codeTheme}
                    PreTag="pre"
                    customStyle={{
                      background: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      border: "1px solid hsl(var(--border))",
                      overflowX: "auto",
                      margin: "1.25rem 0",
                    }}
                    codeTagProps={{ className: "text-sm font-mono" }}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
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
          <div className="w-full px-4">
            <div ref={paragraphNavRef} className="flex flex-nowrap items-center gap-1 py-2 overflow-x-auto">
              {headings.map((h) => (
                <button
                  key={h.id}
                  onClick={() => scrollTo(h.id)}
                  data-id={h.id}
                  className={`flex-shrink-0 min-w-[9.5rem] max-w-[70vw] sm:min-w-0 sm:max-w-none px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all duration-200 truncate ${
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
