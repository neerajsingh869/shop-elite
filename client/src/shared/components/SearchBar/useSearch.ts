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
  loading: boolean; // only for the first request
  error: string | null;
  hasSearched: boolean;

  // below for infinite scrolling
  hasMore: boolean;
  loadingMore: boolean;
}

const INITIAL_STATE = {
  products: [],
  filters: {},
  llmFailed: false,
  loading: false,
  error: null,
  hasSearched: false,
  hasMore: true,
  loadingMore: false,
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

      setState((prev) => ({
        ...prev,
        loading: cursor === undefined,
        error: null,
        loadingMore: cursor !== undefined,
      }));

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
          loadingMore: false,
        }));
      } catch (err) {
        if (axios.isCancel(err)) return;

        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Search failed",
          hasSearched: true,
          loadingMore: false,
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
      loadingMore: false,
    }));
    cursorRef.current = undefined;
    debouncedFetch(query, cursorRef.current);

    return () => {
      controllerRef.current?.abort();
      debouncedFetch.cancel();
    };
  }, [query, debouncedFetch]);

  const loadMore = useCallback(
    () => fetchData(query, cursorRef.current),
    [fetchData, query],
  );

  return { state, loadMore };
}

export default useSearch;
