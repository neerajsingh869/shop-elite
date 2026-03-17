import type { ProductDetail } from "../../../../../../shared/types/api.types";
import MoreInfo from "../MoreInfo";
import Tag from "../Tag";
import ProductMetadataSkeleton from "./skeleton";

interface ProductMetadataProps {
  data: ProductDetail;
}

function ProductMetadata({ data }: ProductMetadataProps) {
  return (
    <>
      <ProductMetadataSkeleton />
      {/* Product description */}
      <p className="text-zinc-400 text-sm leading-5.5">{data.description}</p>
      {/* More info about product */}
      <div className="grid grid-cols-2 gap-2 w-full">
        <MoreInfo
          label={"Availability"}
          value={
            data.availabilityStatus === "In Stock"
              ? `${data.availabilityStatus} (${data.stock})`
              : "Out of Stock"
          }
        />
        <MoreInfo label={"sku"} value={data.sku} />
        <MoreInfo label={"Warranty"} value={data.warrantyInformation} />
        <MoreInfo label={"Shipping"} value={data.shippingInformation} />
      </div>
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {data.tags.map(tag => <Tag key={tag} tag={tag} />)}
      </div>
    </>
  );
}

export default ProductMetadata;
