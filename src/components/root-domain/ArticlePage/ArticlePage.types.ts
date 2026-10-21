import type { Article } from "../../../services/api";

export interface ArticlePageProps {
  article: Article | null;
  isLoading: boolean;
  error: Error | null;
  notFound: boolean;
  onRetry: () => void;
  onBack: () => void;
}
