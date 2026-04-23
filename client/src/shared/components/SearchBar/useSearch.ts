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
}

const INITIAL_STATE = {
  products: [],
  filters: {},
  llmFailed: false,
  loading: false,
  error: null,
  hasSearched: false,
};

function useSearch(query: string): SearchState {
  const [state, setState] = useState<SearchState>(INITIAL_STATE);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (searchQuery: string) => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/llm-search`,
        { userQuery: searchQuery },
        { signal: controllerRef.current?.signal },
      );

      setState({
        products: data.products,
        filters: data.filters,
        llmFailed: data.llmFailed,
        loading: false,
        error: null,
        hasSearched: true,
      });
    } catch (err) {
      if (axios.isCancel(err)) return;

      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Search failed",
        hasSearched: true,
      }));
    }
  }, []);

  const debouncedFetch = useRef(debounce(fetchData, 300)).current;

  useEffect(() => {
    if (!query?.trim()) {
      setState(INITIAL_STATE);
      return;
    }

    debouncedFetch(query);

    return () => {
      controllerRef.current?.abort();
      debouncedFetch.cancel();
    };
  }, [query, debouncedFetch]);

  return state;
}

export default useSearch;
