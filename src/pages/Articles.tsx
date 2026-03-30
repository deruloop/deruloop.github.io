import { getAllArticles } from "@/lib/articles";
import { useNavigate } from "react-router-dom";
import TabSwitcher from "@/components/TabSwitcher";
import { Calendar, Tag } from "lucide-react";

const Articles = () => {
  const articles = getAllArticles();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <TabSwitcher />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Articles</h1>
        <p className="text-muted-foreground mb-10">Thoughts on iOS development, Swift, and mobile engineering.</p>

        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              onClick={() => navigate(`/articles/${article.slug}`)}
              className="group cursor-pointer p-6 rounded-xl border border-border bg-card hover:border-accent/50 hover:shadow-medium transition-all duration-300"
            >
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
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
              <h2 className="text-xl font-semibold group-hover:text-accent transition-colors">
                {article.title}
              </h2>
              <p className="text-muted-foreground mt-1">{article.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;
