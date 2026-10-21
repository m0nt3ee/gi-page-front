import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../../shared/Button/Button";
import {
  ARTICLE_PAGE_BACK_BUTTON_TEST_ID,
  ARTICLE_PAGE_CONTENT_TEST_ID,
  ARTICLE_PAGE_DATE_TEST_ID,
  ARTICLE_PAGE_ERROR_TEST_ID,
  ARTICLE_PAGE_LOADING_TEST_ID,
  ARTICLE_PAGE_NOT_FOUND_TEST_ID,
  ARTICLE_PAGE_RETRY_BUTTON_TEST_ID,
  ARTICLE_PAGE_TEST_ID,
  ARTICLE_PAGE_TEXT_TEST_ID,
  ARTICLE_PAGE_TITLE_TEST_ID,
  BACK_BUTTON_TEXT,
  ERROR_MESSAGE,
  LOADING_MESSAGE,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_MESSAGE,
  RETRY_BUTTON_TEXT,
} from "./ArticlePage.constants";
import type { ArticlePageProps } from "./ArticlePage.types";

const ArticlePage = ({
  article,
  isLoading,
  error,
  notFound,
  onRetry,
  onBack,
}: ArticlePageProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatContent = (content: string): string => {
    return content
      .split("\n")
      .filter((line) => line.trim())
      .join("\n\n");
  };

  const renderLoading = () => (
    <div
      data-testid={ARTICLE_PAGE_LOADING_TEST_ID}
      className="flex flex-col items-center justify-center py-20"
    >
      <FontAwesomeIcon
        icon={faSpinner}
        className="text-teal-500 text-5xl animate-spin mb-6"
        aria-label="Loading spinner"
      />
      <p className="text-neutral-400 text-xl">{LOADING_MESSAGE}</p>
    </div>
  );

  const renderError = () => (
    <div
      data-testid={ARTICLE_PAGE_ERROR_TEST_ID}
      className="flex flex-col items-center justify-center py-20"
    >
      <p className="text-red-400 text-xl mb-8">{ERROR_MESSAGE}</p>
      <div className="flex gap-4">
        <div data-testid={ARTICLE_PAGE_RETRY_BUTTON_TEST_ID}>
          <Button onClick={onRetry} className="px-6 py-3">
            <span className="text-white">{RETRY_BUTTON_TEXT}</span>
          </Button>
        </div>
        <div data-testid={ARTICLE_PAGE_BACK_BUTTON_TEST_ID}>
          <Button onClick={onBack} className="px-6 py-3">
            <span className="text-white">{BACK_BUTTON_TEXT}</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNotFound = () => (
    <div
      data-testid={ARTICLE_PAGE_NOT_FOUND_TEST_ID}
      className="flex flex-col items-center justify-center py-20"
    >
      <h2 className="text-3xl font-bold text-white mb-4">
        {NOT_FOUND_MESSAGE}
      </h2>
      <p className="text-neutral-400 text-lg mb-8">{NOT_FOUND_DESCRIPTION}</p>
      <div data-testid={ARTICLE_PAGE_BACK_BUTTON_TEST_ID}>
        <Button onClick={onBack} className="px-6 py-3">
          <span className="text-white">{BACK_BUTTON_TEXT}</span>
        </Button>
      </div>
    </div>
  );

  const renderArticle = () => {
    if (!article) return null;

    return (
      <article
        data-testid={ARTICLE_PAGE_CONTENT_TEST_ID}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <div data-testid={ARTICLE_PAGE_BACK_BUTTON_TEST_ID} className="mb-8">
            <Button onClick={onBack} className="px-4 py-2">
              <span className="text-white">← {BACK_BUTTON_TEXT}</span>
            </Button>
          </div>
          <h1
            data-testid={ARTICLE_PAGE_TITLE_TEST_ID}
            className="text-4xl md:text-5xl font-bold text-white mb-4 break-words"
          >
            {article.title}
          </h1>
          <time
            data-testid={ARTICLE_PAGE_DATE_TEST_ID}
            dateTime={article.createdAt}
            className="text-neutral-400 text-lg font-(family-name:--font-family-jetbrains)"
          >
            {formatDate(article.createdAt)}
          </time>
        </div>
        <div
          data-testid={ARTICLE_PAGE_TEXT_TEST_ID}
          className="prose prose-invert prose-lg max-w-none"
        >
          {formatContent(article.content)
            .split("\n\n")
            .map((paragraph, index) => (
              <p key={index} className="text-neutral-300 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))}
        </div>
      </article>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return renderLoading();
    }

    if (notFound) {
      return renderNotFound();
    }

    if (error) {
      return renderError();
    }

    return renderArticle();
  };

  return (
    <div data-testid={ARTICLE_PAGE_TEST_ID} className="mx-auto">
      {renderContent()}
    </div>
  );
};

export default ArticlePage;
