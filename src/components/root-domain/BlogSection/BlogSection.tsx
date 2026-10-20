import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../shared/Button/Button";
import ArticleCard from "../ArticleCard/ArticleCard";
import {
  BLOG_ARTICLES_TEST_ID,
  BLOG_EMPTY_TEST_ID,
  BLOG_ERROR_TEST_ID,
  BLOG_LOADING_TEST_ID,
  BLOG_RETRY_BUTTON_TEST_ID,
  BLOG_SECTION_TEST_ID,
  EMPTY_MESSAGE,
  ERROR_MESSAGE,
  LOADING_MESSAGE,
  RETRY_BUTTON_TEXT,
} from "./BlogSection.constants";
import type { BlogSectionProps } from "./BlogSection.types";

const BlogSection = ({
  articles,
  isLoading,
  error,
  onRetry,
}: BlogSectionProps) => {
  const renderLoading = () => (
    <div
      data-testid={BLOG_LOADING_TEST_ID}
      className="flex flex-col items-center justify-center py-12"
    >
      <FontAwesomeIcon
        icon={faSpinner}
        className="text-teal-500 text-4xl animate-spin mb-4"
        aria-label="Loading spinner"
      />
      <p className="text-neutral-400 text-lg">{LOADING_MESSAGE}</p>
    </div>
  );

  const renderError = () => (
    <div
      data-testid={BLOG_ERROR_TEST_ID}
      className="flex flex-col items-center justify-center py-12"
    >
      <p className="text-red-400 text-lg mb-6">{ERROR_MESSAGE}</p>
      {onRetry && (
        <div data-testid={BLOG_RETRY_BUTTON_TEST_ID}>
          <Button onClick={onRetry} className="px-6 py-2">
            <span className="text-white">{RETRY_BUTTON_TEXT}</span>
          </Button>
        </div>
      )}
    </div>
  );

  const renderEmpty = () => (
    <div
      data-testid={BLOG_EMPTY_TEST_ID}
      className="flex items-center justify-center py-12"
    >
      <p className="text-neutral-400 text-lg">{EMPTY_MESSAGE}</p>
    </div>
  );

  const renderArticles = () => (
    <div
      data-testid={BLOG_ARTICLES_TEST_ID}
      className="grid gap-6 grid-cols-1 md:grid-cols-2"
    >
      {articles?.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return renderLoading();
    }

    if (error) {
      return renderError();
    }

    if (!articles || articles.length === 0) {
      return renderEmpty();
    }

    return renderArticles();
  };

  return (
    <section data-testid={BLOG_SECTION_TEST_ID} className="mx-auto">
      <h2 className="text-[15vw] font-mono font-bold text-neutral-200 mb-12 select-none font-(family-name:--font-family-jetbrains)">
        ARTICLES
      </h2>
      {renderContent()}
    </section>
  );
};

export default BlogSection;
