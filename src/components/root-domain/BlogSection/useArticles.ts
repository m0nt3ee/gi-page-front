import { useEffect, useState } from "react";
import type { Article } from "../../../services/api";
import { fetchArticles } from "../../../services/api";

export const useArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadArticles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch articles"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;
      await loadArticles();
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const retry = () => {
    loadArticles();
  };

  return { articles, isLoading, error, retry };
};
