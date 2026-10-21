import { useNavigate, useParams } from "react-router";
import ArticlePage from "../components/root-domain/ArticlePage/ArticlePage";
import { useArticle } from "../components/root-domain/ArticlePage/useArticle";

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { article, isLoading, error, notFound, retry } = useArticle(id);

  const handleBack = () => {
    navigate("/blog");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 px-8 md:px-16 py-20">
      <ArticlePage
        article={article}
        isLoading={isLoading}
        error={error}
        notFound={notFound}
        onRetry={retry}
        onBack={handleBack}
      />
    </div>
  );
};

export default Article;
