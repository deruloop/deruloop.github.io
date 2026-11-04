export interface AppUpdate {
  app: string;
  content: string;
}

export interface MonthlyUpdate {
  /** The filename without extension, e.g. "2026-10". Also the page anchor. */
  month: string;
  title: string;
  /** Anything written above the first app heading. */
  intro: string;
  apps: AppUpdate[];
}

const modules = import.meta.glob('/src/content/updates/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function formatMonth(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  // Built from local parts: parsing "2026-10-01" is UTC, which would show
  // September to anyone west of Greenwich.
  return new Date(year, monthNumber - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

/** Each `## App` heading starts a section. Headings with nothing under them are skipped. */
function parseMonth(raw: string): Pick<MonthlyUpdate, 'intro' | 'apps'> {
  const [intro, ...blocks] = raw.split(/^## +/m);
  const apps = blocks
    .map((block) => {
      const [heading, ...body] = block.split('\n');
      return { app: heading.trim(), content: body.join('\n').trim() };
    })
    .filter((section) => section.content.length > 0);
  return { intro: intro.trim(), apps };
}

/** Newest month first. A file holding only headings is still a draft, so it stays hidden. */
export function getAllUpdates(): MonthlyUpdate[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const month = path.split('/').pop()!.replace('.md', '');
      return { month, title: formatMonth(month), ...parseMonth(raw) };
    })
    .filter((update) => update.intro.length > 0 || update.apps.length > 0)
    .sort((a, b) => b.month.localeCompare(a.month));
}
