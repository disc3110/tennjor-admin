 "use client";

import type { ChangeEvent, FormEvent } from "react";
import { useRef, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card } from "@/src/components/ui/card";
import type {
  ProductAdminImageDetail,
  UploadProductImagePayload,
} from "@/src/features/products/types/product";

type ProductImagesPanelProps = {
  images: ProductAdminImageDetail[];
  productName: string;
  isSaving: boolean;
  onUploadImage: (payload: UploadProductImagePayload) => void;
  onDeleteImage: (imageId: string) => void;
};

function getImageHost(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "Invalid URL";
  }
}

export function ProductImagesPanel({
  images,
  productName,
  isSaving,
  onUploadImage,
  onDeleteImage,
}: ProductImagesPanelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [order, setOrder] = useState("0");

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const pickedFile = event.target.files?.[0] ?? null;
    setFile(pickedFile);
  };

  const handleUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    onUploadImage({
      file,
      alt: alt.trim() || undefined,
      order: Number(order),
    });

    setFile(null);
    setAlt("");
    setOrder("0");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Card>
      <h2 className="text-lg font-semibold text-slate-900">Media</h2>

      <form className="mt-4 space-y-3 rounded-lg border border-slate-200 p-3" onSubmit={handleUpload}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        />
        <div className="grid gap-2 md:grid-cols-2">
          <Input
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Alt text (optional)"
          />
          <Input
            type="number"
            min={0}
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            placeholder="Order"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={!file || isSaving}>
            {isSaving ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </form>

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
                <div className="pt-1">
                  <Button
                    variant="ghost"
                    className="h-8 px-2 text-xs"
                    disabled={isSaving}
                    onClick={() => {
                      const accepted = window.confirm(
                        "Delete this image? This action cannot be undone.",
                      );
                      if (accepted) onDeleteImage(image.id);
                    }}
                  >
                    Delete Image
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
