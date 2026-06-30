import { Article, getAllArticles } from "@/lib/articles";
import { useNavigate } from "react-router-dom";
import TabSwitcher from "@/components/TabSwitcher";
import { useMemo, useState } from "react";
import { BookOpen, Calendar, ChevronDown, ChevronRight, FolderOpen, Tag } from "lucide-react";

interface ArticleTrack {
  key: string;
  title: string;
  displayTitle?: string;
  order: number;
  articles: Article[];
}

interface ArticleCollection {
  key: string;
  title: string;
  order: number;
  tracks: ArticleTrack[];
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function sortArticles(items: Article[]): Article[] {
  return [...items].sort((a, b) => {
    const lessonOrderA = a.lessonOrder ?? Number.MAX_SAFE_INTEGER;
    const lessonOrderB = b.lessonOrder ?? Number.MAX_SAFE_INTEGER;
    if (lessonOrderA !== lessonOrderB) return lessonOrderA - lessonOrderB;

    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

const Articles = () => {
  const articles = getAllArticles();
  const navigate = useNavigate();
  const [expandedCollections, setExpandedCollections] = useState<Record<string, boolean>>({});
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({});
  const standaloneArticles = useMemo(
    () => articles.filter((article) => !article.collection),
    [articles]
  );

  const collections = useMemo<ArticleCollection[]>(() => {
    const collectionMap = new Map<
      string,
      {
        key: string;
        title: string;
        order: number;
        tracks: Map<string, ArticleTrack>;
      }
    >();

    for (const article of articles) {
      if (!article.collection) continue;

      const collectionKey = article.collectionSlug ?? article.collection.toLowerCase().replace(/\s+/g, "-");
      const trackTitle = article.track ?? "Lessons";
      const trackKey =
        article.trackSlug ?? `${collectionKey}-${trackTitle.toLowerCase().replace(/\s+/g, "-")}`;

      if (!collectionMap.has(collectionKey)) {
        collectionMap.set(collectionKey, {
          key: collectionKey,
          title: article.collection,
          order: article.collectionOrder ?? Number.MAX_SAFE_INTEGER,
          tracks: new Map(),
        });
      }

      const collection = collectionMap.get(collectionKey)!;

      if (!collection.tracks.has(trackKey)) {
        collection.tracks.set(trackKey, {
          key: trackKey,
          title: trackTitle,
          displayTitle: article.trackDisplayTitle,
          order: article.trackOrder ?? Number.MAX_SAFE_INTEGER,
          articles: [],
        });
      }

      collection.tracks.get(trackKey)!.articles.push(article);
    }

    return Array.from(collectionMap.values())
      .map((collection) => ({
        key: collection.key,
        title: collection.title,
        order: collection.order,
        tracks: Array.from(collection.tracks.values())
          .map((track) => ({
            ...track,
            articles: sortArticles(track.articles),
          }))
          .sort((a, b) => {
            if (a.order !== b.order) return a.order - b.order;
            return a.title.localeCompare(b.title);
          }),
      }))
      .sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.title.localeCompare(b.title);
      });
  }, [articles]);

  const toggleTrack = (trackKey: string) => {
    const isExpanded = expandedTracks[trackKey] ?? false;
    setExpandedTracks((current) => ({
      ...current,
      [trackKey]: !isExpanded,
    }));
  };

  const toggleCollection = (collectionKey: string) => {
    const isExpanded = expandedCollections[collectionKey] ?? false;
    setExpandedCollections((current) => ({
      ...current,
      [collectionKey]: !isExpanded,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <TabSwitcher />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Articles</h1>
        <p className="text-muted-foreground mb-10">
          Thoughts on iOS development, Swift, and mobile engineering, plus curated collections you can browse as mini-series.
        </p>

        {collections.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="h-5 w-5 text-accent" />
              <h2 className="text-2xl font-semibold">Collections</h2>
            </div>

            <div className="space-y-6">
              {collections.map((collection) => {
                const articleCount = collection.tracks.reduce((total, track) => total + track.articles.length, 0);

                return (
                  <section
                    key={collection.key}
                    className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleCollection(collection.key)}
                      className="flex w-full items-start justify-between gap-4 px-6 py-6 text-left transition-colors hover:bg-background/40"
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/80">
                          Collection
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <h3 className="text-2xl font-semibold text-foreground">{collection.title}</h3>
                          <span>
                            {collection.tracks.length} {collection.tracks.length === 1 ? "track" : "tracks"}
                          </span>
                          <span>
                            {articleCount} {articleCount === 1 ? "article" : "articles"}
                          </span>
                        </div>
                      </div>
                      {(expandedCollections[collection.key] ?? false) ? (
                        <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                    </button>

                    {(expandedCollections[collection.key] ?? false) && (
                      <div className="border-t border-border px-6 py-5 space-y-3">
                        {collection.tracks.map((track) => {
                          if (track.articles.length === 1) {
                            const article = track.articles[0];
                            const isComingSoon = article.status === "coming-soon";

                            return (
                              <article
                                key={track.key}
                                onClick={() => {
                                  if (!isComingSoon) navigate(`/articles/${article.slug}`);
                                }}
                                className={`rounded-xl border border-border/70 bg-background/60 p-4 transition-all duration-300 ${
                                  isComingSoon
                                    ? "cursor-default opacity-80"
                                    : "group cursor-pointer hover:border-accent/50 hover:bg-background"
                                }`}
                              >
                                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                  <BookOpen className="h-3.5 w-3.5" />
                                  <span>{track.title}</span>
                                </div>
                                <h4 className={`mt-2 text-lg font-semibold ${isComingSoon ? "text-foreground" : "transition-colors group-hover:text-accent"}`}>
                                  {article.title}
                                </h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {isComingSoon ? "Coming soon" : article.excerpt}
                                </p>
                              </article>
                            );
                          }

                          const isExpanded = expandedTracks[track.key] ?? false;

                          return (
                            <div
                              key={track.key}
                              className="rounded-xl border border-border/70 bg-background/60 overflow-hidden"
                            >
                              <button
                                type="button"
                                onClick={() => toggleTrack(track.key)}
                                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors hover:bg-background"
                              >
                                <div>
                                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    <span>{track.title}</span>
                                  </div>
                                  {track.displayTitle && (
                                    <h4 className="mt-2 text-lg font-semibold text-foreground">
                                      {track.displayTitle}
                                    </h4>
                                  )}
                                  <p className="mt-2 text-sm text-muted-foreground">
                                    {track.articles.length} articles inside
                                  </p>
                                </div>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="border-t border-border/70 px-4 py-3 space-y-3">
                                  {track.articles.map((article, index) => (
                                    (() => {
                                      const isComingSoon = article.status === "coming-soon";

                                      return (
                                    <article
                                      key={article.slug}
                                      onClick={() => {
                                        if (!isComingSoon) navigate(`/articles/${article.slug}`);
                                      }}
                                      className={`rounded-lg border border-transparent px-1 py-1 transition-colors ${
                                        isComingSoon
                                          ? "cursor-default opacity-80"
                                          : "group cursor-pointer hover:text-accent"
                                      }`}
                                    >
                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                        <span>
                                          Article {article.lessonOrder ?? index + 1}
                                        </span>
                                        {isComingSoon && <span>Coming soon</span>}
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-3.5 w-3.5" />
                                          {formatDate(article.date)}
                                        </span>
                                      </div>
                                      <h4 className={`mt-1 text-base font-semibold text-foreground ${isComingSoon ? "" : "transition-colors group-hover:text-accent"}`}>
                                        {article.title}
                                      </h4>
                                      <p className="mt-1 text-sm text-muted-foreground">
                                        {isComingSoon ? "Coming soon" : article.excerpt}
                                      </p>
                                    </article>
                                      );
                                    })()
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </section>
        )}

        {standaloneArticles.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-semibold">Articles</h2>
          </div>

          <div className="space-y-6">
            {standaloneArticles.map((article) => (
              <article
                key={article.slug}
                onClick={() => navigate(`/articles/${article.slug}`)}
                className="group cursor-pointer p-6 rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-medium transition-all duration-300"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(article.date)}
                  </span>
                  {article.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag className="h-3.5 w-3.5" />
                      {article.tags.join(", ")}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mt-1">{article.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
        )}
      </div>
    </div>
  );
};

export default Articles;
