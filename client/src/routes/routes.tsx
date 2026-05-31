// src/routes/index.tsx
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";

import AllProducts from "../pages/AllProductsPage/AllProducts";
import ProtectedRoute from "../shared/components/ProtectedRoute/ProtectedRoute";
import SuspenseFallback from "../shared/components/SuspenseFallback/SuspenseFallback";
const ProductDetailPage = lazy(
  () => import("../pages/ProductDetailPage/ProductDetail"),
);
const ProductListingPage = lazy(
  () => import("../pages/ProductListingPage/ProductListing"),
);
const HomePage = lazy(() => import("../pages/HomePage/Home"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const LoginPage = lazy(() => import("../features/auth/LoginPage"));
const RegisterPage = lazy(() => import("../features/auth/RegisterPage"));

function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      {/* Suspense is required with lazy() */}
      {/* Shows fallback while the page chunk is downloading */}
      <Routes>
        {/* public routes - anyone can visit */}
        <Route path="/" element={<HomePage />} />
        <Route path="/:categorySlug" element={<ProductListingPage />} />
        <Route
          path="/:categorySlug/:productId/:productSlug"
          element={<ProductDetailPage />}
        />
        <Route path="/products" element={<AllProducts />} />
        <Route
          path="/products/:productId/:productSlug"
          element={<ProductDetailPage />}
        />

        {/* Auth routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* protected routes - must be logged in */}
        <Route element={<ProtectedRoute />}>
          {/* add account, checkout, etc pages after you build them */}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
