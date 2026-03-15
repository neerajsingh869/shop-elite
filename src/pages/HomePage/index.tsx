import { Dot } from "lucide-react";
import { GET_CATEGORIES_URL } from "../../shared/constants";
import useFetch from "../../shared/hooks/useFetch";
import type { Category } from "../../shared/types/api.types";
import CategoryCard from "./components/CategoryCard";

function HomePage() {
  const { data, error, loading } = useFetch<Category[]>(GET_CATEGORIES_URL);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  if (!data) {
    return <div>No Categories.</div>;
  }

  return (
    <>
      <header className="border-b border-zinc-800 mb-8 pb-6">
        <p className="text-xs text-yellow-500 uppercase tracking-widest mb-2">
          Welcome to ShopElite
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
          Shop by Category
        </h1>
        <p className="text-sm text-zinc-500 flex mt-1">
          {data.length} categories <Dot className="cursor-text" /> Over 200
          premium products
        </p>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {data.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </>
  );
}

export default HomePage;
