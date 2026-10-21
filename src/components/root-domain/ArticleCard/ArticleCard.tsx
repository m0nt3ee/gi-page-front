import { Link } from "react-router";
import {
  ARTICLE_CARD_TEST_ID,
  ARTICLE_DATE_TEST_ID,
  ARTICLE_TITLE_TEST_ID,
} from "./ArticleCard.constants";
import type { ArticleCardProps } from "./ArticleCard.types";

const ArticleCard = ({ article }: ArticleCardProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPreview = (content: string, maxLength = 100): string => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <Link to={`/article/${article.id}`}>
      <article
        data-testid={ARTICLE_CARD_TEST_ID}
        className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-teal-500 transition-colors cursor-pointer"
      >
        <h3
          data-testid={ARTICLE_TITLE_TEST_ID}
          className="text-xl font-semibold text-white mb-2 break-words"
        >
          {article.title}
        </h3>
        <time
          data-testid={ARTICLE_DATE_TEST_ID}
          dateTime={article.createdAt}
          className="text-neutral-400 text-sm font-(family-name:--font-family-jetbrains) block mb-3"
        >
          {formatDate(article.createdAt)}
        </time>
        <p className="text-neutral-300 text-sm leading-relaxed">
          {getPreview(article.content)}
        </p>
      </article>
    </Link>
  );
};

export default ArticleCard;
