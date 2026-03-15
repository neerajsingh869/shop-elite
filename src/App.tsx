import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import "./App.css";
import Header from "./shared/components/Header";
import SuspenseFallback from "./shared/components/SuspenseFallback";

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const ProductListingPage = lazy(() => import("./pages/ProductListingPage"));
const HomePage = lazy(() => import("./pages/HomePage"));

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        {/* Header is outside Routes so renders on every page */}
        <Header />
        <main className="max-w-7xl mx-auto p-6 md:p-8">
          {/* Suspense is required with lazy() */}
          {/* Shows fallback while the page chunk is downloading */}
          <Suspense fallback={<SuspenseFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:categorySlug" element={<ProductListingPage />} />
              <Route
                path="/:categorySlug/:productId/:productSlug"
                element={<ProductDetailPage />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
