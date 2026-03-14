import { useState, useEffect } from "react";

interface IUseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

function useFetch<T>(url: string): IUseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!url) return;

    /*
      Reset state to prevent old data flash
      on url change (navigating to another page)
    */
    setData(null);
    setError(null);
    setLoading(true);

    // To cancel request in midway
    const controller = new AbortController();

    async function fetchData() {
      try {
        const response = await fetch(url, { signal: controller.signal });
        // In case 404 or 500 is returned, fetch doesn't throw error
        if (!response.ok) {
          throw new Error(`Request failed with Status ${response.status}`);
        }

        const jsonData = (await response.json()) as T;

        setData(jsonData);
      } catch (err) {
        // If we aborted, then the error thrown is actually expected
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error ? err.message : "An unknown error occured",
        );
      } finally {
        /*
          Avoid updating the state when the request is aborted.
          If we don't do this, the state will change and we want to aovoid
        */
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, [url]);

  return {
    data,
    error,
    loading,
  };
}

export default useFetch;
