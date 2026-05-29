// src/routes/index.tsx
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import SuspenseFallback from "../shared/components/SuspenseFallback/SuspenseFallback";
import AllProducts from "../pages/AllProductsPage/AllProducts";
import ProtectedRoute from "../shared/components/ProtectedRoute/ProtectedRoute";

const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const ProductDetailPage = lazy(
  () => import("../pages/ProductDetailPage/ProductDetail"),
);
const ProductListingPage = lazy(
  () => import("../pages/ProductListingPage/ProductListing"),
);
const HomePage = lazy(() => import("../pages/HomePage/Home"));

const LoginPage = lazy(() => import("../pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage/RegisterPage"));

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
