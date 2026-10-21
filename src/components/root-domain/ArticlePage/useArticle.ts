import { useEffect, useState } from "react";
import type { Article } from "../../../services/api";
import { fetchArticleById } from "../../../services/api";

export const useArticle = (id: string | undefined) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);

  const isValidUUID = (uuid: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };

  const loadArticle = async (articleId: string) => {
    setIsLoading(true);
    setError(null);
    setNotFound(false);
    setArticle(null);

    try {
      const data = await fetchArticleById(articleId);
      setArticle(data);
    } catch (err) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response: { status: number } };
        if (axiosError.response?.status === 404) {
          setNotFound(true);
        } else {
          setError(
            err instanceof Error ? err : new Error("Failed to fetch article"),
          );
        }
      } else {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch article"),
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    if (!isValidUUID(id)) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;
      await loadArticle(id);
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const retry = () => {
    if (id) {
      loadArticle(id);
    }
  };

  return { article, isLoading, error, notFound, retry };
};
