export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
}

function parseFrontmatter(raw: string): { meta: Record<string, any>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };

  const metaBlock = match[1];
  const content = match[2].trim();
  const meta: Record<string, any> = {};

  for (const line of metaBlock.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value: any = line.slice(colonIdx + 1).trim();

    // Parse arrays like [tag1, tag2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s: string) => s.trim());
    }

    meta[key] = value;
  }

  return { meta, content };
}

const modules = import.meta.glob('/src/content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export function getAllArticles(): Article[] {
  const articles: Article[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    const slug = path.split('/').pop()!.replace('.md', '');
    const { meta, content } = parseFrontmatter(raw as string);

    articles.push({
      slug,
      title: meta.title || slug,
      date: meta.date || '',
      excerpt: meta.excerpt || '',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      content,
    });
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}
