import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import "./App.css";
import Header from "./shared/components/Header";
import SuspenseFallback from "./shared/components/SuspenseFallback";

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"))
const ProductListingPage = lazy(() => import("./pages/ProductListingPage"))
const HomePage = lazy(() => import("./pages/HomePage"))

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Lazy loaded components need Suspense to handle crash */}
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path=":categorySlug" element={<ProductListingPage />} />
            <Route path=":categorySlug/:productId/:productSlug" element={<ProductDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App;
