import { useParams, useNavigate } from "react-router-dom";
import { getArticleBySlug } from "@/lib/articles";
import TabSwitcher from "@/components/TabSwitcher";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = getArticleBySlug(slug || "");

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Article not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TabSwitcher />

      <div className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
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

        <div className="prose prose-neutral max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-accent prose-pre:bg-primary prose-pre:text-primary-foreground prose-a:text-accent">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Article;
