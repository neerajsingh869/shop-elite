import { Link, useParams } from "react-router";

import type { ProductDetail } from "../../shared/types/api.types";

import { GET_PRODUCT_URL, ROUTES } from "../../shared/constants";
import useFetch from "../../shared/hooks/useFetch";
import useScrollToTop from "../../shared/hooks/useScrollToTop";
import ImageGallery from "./components/ImageGallery";
import AboutProduct from "./components/AboutProduct";
import Reviews from "./components/Reviews";
import ProductDetailPageSkeleton from "./skeleton";
import BackButton from "../../shared/components/ui/BackButton";
import getCategoryName from "../../shared/utils/getCategoryName";
import BackButtonSkeleton from "../../shared/components/ui/BackButtonSkeleton";

interface PageParams extends Record<string, string> {
  categorySlug: string;
  productId: string;
  productSlug: string;
}

function ProductDetailPage() {
  const params = useParams<PageParams>();
  const categorySlug = params.categorySlug;
  const productId = Number(params.productId);

  const { data, error, loading } = useFetch<ProductDetail>(
    GET_PRODUCT_URL(productId),
  );
  const { topRef } = useScrollToTop(loading);

  const categoryName = getCategoryName(categorySlug);

  return (
    <>
      <div className="absolute top-0" ref={topRef}></div>
      {loading ? (
        <BackButtonSkeleton />
      ) : (
        <BackButton
          to={categorySlug ? ROUTES.category(categorySlug) : ROUTES.home}
          label={`Back to ${categoryName}`}
        />
      )}
      {loading ? (
        <ProductDetailPageSkeleton />
      ) : error ? (
        <div className="text-red-400 text-sm">Error: {error}</div>
      ) : (
        data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Image gallery */}
              <ImageGallery images={data.images} />
              <div className="flex flex-col gap-5 items-start">
                {/* Link to go to product listing page for the category */}
                <Link
                  to={
                    categorySlug ? ROUTES.category(categorySlug) : ROUTES.home
                  }
                  className="border border-yellow-700 rounded-full px-3 py-1 uppercase text-xs font-semibold tracking-wide text-yellow-500 bg-yellow-900/20"
                >
                  {categoryName}
                </Link>
                {/* All the important product information */}
                <AboutProduct data={data} />
              </div>
            </div>
            <Reviews
              productId={productId}
              reviews={data.reviews}
              totalRating={data.rating}
            />
          </>
        )
      )}
    </>
  );
}

export default ProductDetailPage;
