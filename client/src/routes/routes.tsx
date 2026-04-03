// src/routes/index.tsx
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import SuspenseFallback from "../shared/components/SuspenseFallback/SuspenseFallback";

const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const ProductDetailPage = lazy(
  () => import("../pages/ProductDetailPage/ProductDetail"),
);
const ProductListingPage = lazy(
  () => import("../pages/ProductListingPage/ProductListing"),
);
const HomePage = lazy(() => import("../pages/HomePage/Home"));

function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      {/* Suspense is required with lazy() */}
      {/* Shows fallback while the page chunk is downloading */}
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
  );
}

export default AppRoutes;
