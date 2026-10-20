import type { Article } from "../../../services/api";

export interface BlogSectionProps {
  articles?: Article[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}
