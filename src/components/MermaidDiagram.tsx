import { useEffect, useId, useState } from "react";

type Mermaid = typeof import("mermaid").default;

// Loaded on first use, so articles without diagrams never download the library.
let mermaidPromise: Promise<Mermaid> | null = null;
function loadMermaid(): Promise<Mermaid> {
  mermaidPromise ??= import("mermaid").then((m) => m.default);
  return mermaidPromise;
}

// The site's tokens are bare "H S% L%" triples; a probe element turns one into
// an rgb() string Mermaid can parse.
function token(name: string): string {
  const probe = document.createElement("span");
  probe.style.color = `hsl(var(${name}))`;
  document.body.appendChild(probe);
  const value = getComputedStyle(probe).color;
  probe.remove();
  return value;
}

function themeVariables() {
  return {
    fontFamily: getComputedStyle(document.body).fontFamily,
    fontSize: "14px",
    background: token("--card"),
    primaryColor: token("--card"),
    primaryTextColor: token("--foreground"),
    primaryBorderColor: token("--foreground"),
    lineColor: token("--muted-foreground"),
    textColor: token("--foreground"),
    clusterBkg: token("--muted"),
    clusterBorder: token("--border"),
    edgeLabelBackground: token("--card"),
  };
}

const MermaidDiagram = ({ code }: { code: string }) => {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [scheme, setScheme] = useState(() => document.documentElement.classList.contains("dark"));

  // Redraw with the other palette when the site switches between light and dark.
  useEffect(() => {
    const observer = new MutationObserver(() =>
      setScheme(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then(async (mermaid) => {
        mermaid.initialize({ startOnLoad: false, theme: "base", themeVariables: themeVariables() });
        const { svg } = await mermaid.render(id, code);
        if (!cancelled) setSvg(svg);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [code, id, scheme]);

  if (failed) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      role="img"
      className="not-prose my-6 flex min-h-[8rem] justify-center overflow-x-auto rounded-2xl border border-border/60 bg-card p-4 shadow-medium [&_svg]:h-auto [&_svg]:max-h-[34rem] [&_svg]:max-w-full"
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
    />
  );
};

export default MermaidDiagram;
