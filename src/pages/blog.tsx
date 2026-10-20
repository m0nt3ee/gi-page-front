import BlogSection from "../components/root-domain/BlogSection/BlogSection";
import { useArticles } from "../components/root-domain/BlogSection/useArticles";

const Blog = () => {
  const { articles, isLoading, error, retry } = useArticles();

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-950 px-8 md:px-16 py-20">
      <BlogSection
        articles={articles}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
      />
    </div>
  );
};

export default Blog;
