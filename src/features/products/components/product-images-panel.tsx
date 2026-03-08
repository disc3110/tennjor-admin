import { Card } from "@/src/components/ui/card";
import type { ProductAdminImageDetail } from "@/src/features/products/types/product";

type ProductImagesPanelProps = {
  images: ProductAdminImageDetail[];
  productName: string;
};

function getImageHost(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "Invalid URL";
  }
}

export function ProductImagesPanel({ images, productName }: ProductImagesPanelProps) {
  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">Media</h2>

      {images.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">No images configured for this product.</p>
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white"
            >
              <div className="relative h-32 w-full bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt ?? productName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="space-y-1 p-3">
                <p className="truncate text-sm font-medium text-slate-800">
                  {image.alt || `Image ${index + 1}`}
                </p>
                <p className="text-xs text-slate-500">
                  Order {image.order} • {getImageHost(image.url)}
                </p>
                <p className="truncate text-xs text-slate-400">ID: {image.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
