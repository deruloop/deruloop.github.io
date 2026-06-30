export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
  status?: string;
  collection?: string;
  collectionSlug?: string;
  collectionOrder?: number;
  track?: string;
  trackDisplayTitle?: string;
  trackSlug?: string;
  trackOrder?: number;
  lessonOrder?: number;
}

type FrontmatterValue = string | string[];
type Frontmatter = Record<string, FrontmatterValue | undefined>;

function getString(meta: Frontmatter, key: string): string | undefined {
  return typeof meta[key] === 'string' ? meta[key] : undefined;
}

function getStringArray(meta: Frontmatter, key: string): string[] {
  return Array.isArray(meta[key]) ? meta[key] : [];
}

function getNumber(meta: Frontmatter, key: string): number | undefined {
  const value = getString(meta, key);
  if (!value) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseFrontmatter(raw: string): { meta: Frontmatter; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const metaBlock = match[1];
  const content = match[2].trim();
  const meta: Frontmatter = {};

  for (const line of metaBlock.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: FrontmatterValue = line.slice(colonIdx + 1).trim();

    // Parse arrays like [tag1, tag2]
    if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim());
    }

    meta[key] = value;
  }

  return { meta, content };
}

const modules = import.meta.glob('/src/content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export function getAllArticles(): Article[] {
  const articles: Article[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    const slug = path.split('/').pop()!.replace('.md', '');
    const { meta, content } = parseFrontmatter(raw);

    articles.push({
      slug,
      title: getString(meta, 'title') ?? slug,
      date: getString(meta, 'date') ?? '',
      excerpt: getString(meta, 'excerpt') ?? '',
      tags: getStringArray(meta, 'tags'),
      content,
      status: getString(meta, 'status'),
      collection: getString(meta, 'collection'),
      collectionSlug: getString(meta, 'collectionSlug'),
      collectionOrder: getNumber(meta, 'collectionOrder'),
      track: getString(meta, 'track'),
      trackDisplayTitle: getString(meta, 'trackDisplayTitle'),
      trackSlug: getString(meta, 'trackSlug'),
      trackOrder: getNumber(meta, 'trackOrder'),
      lessonOrder: getNumber(meta, 'lessonOrder'),
    });
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug && a.status !== 'coming-soon');
}
