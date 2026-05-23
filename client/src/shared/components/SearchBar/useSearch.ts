import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import type {
  ProductAPIResponse,
  ProductFiltersAPIResponse,
} from "./SearchBar.types";
import { debounce } from "../../utils/debounce";

interface SearchState {
  products: ProductAPIResponse[];
  filters: ProductFiltersAPIResponse;
  llmFailed: boolean;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;

  // below for infinite scrolling
  hasMore: boolean;
}

const INITIAL_STATE = {
  products: [],
  filters: {},
  llmFailed: false,
  loading: false,
  error: null,
  hasSearched: false,
  hasMore: true,
};

function useSearch(query: string): {
  state: SearchState;
  loadMore: () => void;
} {
  const [state, setState] = useState<SearchState>(INITIAL_STATE);
  const controllerRef = useRef<AbortController | null>(null);
  const cursorRef = useRef<number | undefined>(undefined);

  const fetchData = useCallback(
    async (searchQuery: string, cursor: number | undefined) => {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/products/llm-search`,
          { userQuery: searchQuery, cursor },
          { signal: controllerRef.current?.signal },
        );

        cursorRef.current = data.cursor;
        setState((prev) => ({
          ...prev,
          products:
            cursor === undefined
              ? data.products
              : [...prev.products, ...data.products],
          filters: data.filters,
          llmFailed: data.llmFailed,
          loading: false,
          error: null,
          hasSearched: true,
          hasMore: data.hasMore,
        }));
      } catch (err) {
        if (axios.isCancel(err)) return;

        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Search failed",
          hasSearched: true,
        }));
      }
    },
    [],
  );

  const debouncedFetch = useRef(debounce(fetchData, 300)).current;

  useEffect(() => {
    if (!query?.trim()) {
      setState(INITIAL_STATE);
      return;
    }

    // If query changes, update the state in a way
    // that old products and filters stay until new response
    // overwrite them
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      hasMore: true,
    }));
    cursorRef.current = undefined;
    debouncedFetch(query, cursorRef.current);

    return () => {
      controllerRef.current?.abort();
      debouncedFetch.cancel();
    };
  }, [query, debouncedFetch]);

  return { state, loadMore: () => fetchData(query, cursorRef.current) };
}

export default useSearch;
