export type ProductAdminCategory = {
  id: string;
  name: string;
  slug: string;
};

export type ProductAdminImage = {
  id: string;
  url: string;
  secureUrl: string | null;
  publicId: string | null;
  alt: string | null;
  order: number;
};

export type ProductAdminImageDetail = ProductAdminImage & {
  createdAt: string;
  updatedAt: string;
  productId?: string;
};

export type ProductAdminVariant = {
  id: string;
  size: string;
  color: string;
  sku: string | null;
  isActive: boolean;
  stock: number;
};

export type CreateProductVariantPayload = {
  size: string;
  color: string;
  sku?: string;
  isActive?: boolean;
  stock?: number;
};

export type UpdateProductVariantPayload = {
  size?: string;
  color?: string;
  sku?: string;
  isActive?: boolean;
  stock?: number;
};

export type ProductVariantResponse = {
  message: string;
  data: ProductAdminVariant & {
    productId: string;
  };
};

export type BulkCreateVariantsPayload = {
  startSize: number;
  endSize: number;
  includeHalfSizes: boolean;
  color: string;
  stock?: number;
  isActive?: boolean;
};

export type BulkCreateVariantsResponse = {
  message: string;
  data: {
    productId: string;
    requestedCount: number;
    createdCount: number;
    skippedCount: number;
    skippedSizes: string[];
    variants: Array<
      ProductAdminVariant & {
        productId: string;
      }
    >;
  };
};

export type DeleteVariantResponse = {
  message: string;
  data: {
    id: string;
  };
};

export type ProductAdmin = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  baseCost?: string | number | null;
  costCurrency?: string | null;
  createdAt: string;
  updatedAt: string;
  category: ProductAdminCategory;
  images: ProductAdminImage[];
  variants: ProductAdminVariant[];
};

export type ProductAdminDetail = Omit<ProductAdmin, "images"> & {
  images: ProductAdminImageDetail[];
};

export type ProductAdminListMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ProductAdminListResponse = {
  data: ProductAdmin[];
  meta: ProductAdminListMeta;
};

export type ProductAdminListQuery = {
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
};

export type UpdateAdminProductPayload = {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  categoryId?: string;
};

export type UpdateAdminProductResponse = {
  message: string;
  data: ProductAdminDetail;
};

export type CreateAdminProductPayload = {
  name: string;
  slug: string;
  categoryId: string;
  description?: string;
  isActive?: boolean;
};

export type CreateAdminProductResponse = {
  message: string;
  data: ProductAdminDetail;
};

export type ProductAdminDetailResponse = {
  data: ProductAdminDetail;
};

export type UploadProductImagePayload = {
  file: File;
  alt?: string;
  order?: number;
};

export type UploadProductImageResponse = {
  message: string;
  data: ProductAdminImageDetail;
};

export type DeleteProductImageResponse = {
  message: string;
  data: {
    id: string;
    publicId: string | null;
    cloudinaryCleanup: {
      attempted: boolean;
      result?: string;
      error?: string;
    };
  };
};

export type DeleteProductResponse = {
  message: string;
  data: {
    id: string;
    deletedVariants: boolean;
    deletedImages: boolean;
    cloudinaryCleanupPendingPublicIds: string[];
  };
};

export type CategoryAdmin = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  imageWebUrl: string | null;
  imageMobileUrl: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    products: number;
  };
};

export type AdminCategoriesListResponse = {
  data: CategoryAdmin[];
};
