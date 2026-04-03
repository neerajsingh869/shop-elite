import ImageGallarySkeleton from "./components/ImageGallery/ImageGallerySkeleton";
import AboutProductSkeleton from "./components/AboutProduct/AboutProductSkeleton";
import ReviewsSkeleton from "./components/Reviews/ReviewsSkeleton";
import BackButtonSkeleton from "../../shared/components/ui/BackButtonSkeleton";

function ProductDetailPageSkeleton() {
  return (
    <>
      <BackButtonSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ImageGallarySkeleton />
        <div className="flex flex-col gap-5 items-start">
          <button className="border border-yellow-700 rounded-full px-3 py-1 bg-yellow-900/20 w-24 h-6"></button>
          <AboutProductSkeleton />
        </div>
      </div>
      <ReviewsSkeleton />
    </>
  );
}

export default ProductDetailPageSkeleton;
