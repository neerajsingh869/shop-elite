import { Dot } from "lucide-react";

import { GET_CATEGORIES_URL } from "../../shared/constants";
import useFetch from "../../shared/hooks/useFetch";
import type { Category } from "../../shared/types/api.types";
import CategoryCard from "./components/CategoryCard";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import CategoryGridSkeleton from "./components/Skeleton";

function HomePage() {
  const { data, error, loading } = useFetch<Category[]>(GET_CATEGORIES_URL);
  const { topRef } = useScrollToTop(loading);

  return (
    <>
      <div className="absolute top-0" ref={topRef}></div>
      <header className="border-b border-zinc-800 mb-8 pb-6">
        <p className="text-xs text-yellow-500 uppercase tracking-widest mb-2">
          Welcome to ShopElite
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Shop by Category
        </h1>
        {loading ? (
          <p className="h-3 w-64 bg-zinc-800 rounded animate-pulse mt-2"></p>
        ) : (
          <p className="text-sm text-zinc-500 mt-1">
            {data?.length} categories{" "}
            <Dot className="cursor-text inline -mx-2" /> Over 200 premium
            products
          </p>
        )}
      </header>
      {loading && <CategoryGridSkeleton />}
      {!loading && error && <div className="text-red-400 text-sm">Error: {error}</div>}
      {!loading && !error && data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      )}
    </>
  );
}

export default HomePage;
