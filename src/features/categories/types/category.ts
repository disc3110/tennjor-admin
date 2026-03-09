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

export type CategoryProductSnapshot = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  images: Array<{
    id: string;
    url: string;
    secureUrl: string | null;
    alt: string | null;
    order: number;
  }>;
  variants: Array<{
    id: string;
    size: string;
    color: string;
    stock: number;
    isActive: boolean;
  }>;
};

export type CategoryWithProducts = Omit<CategoryAdmin, "_count"> & {
  products: CategoryProductSnapshot[];
  _count: {
    products: number;
  };
};

export type AdminCategoriesListResponse = {
  data: CategoryAdmin[];
};

export type CategoryDetailResponse = {
  data: CategoryWithProducts;
};

export type CategoryListQuery = {
  search?: string;
  isActive?: boolean;
};

export type CreateCategoryPayload = {
  name: string;
  slug: string;
  isActive?: boolean;
  imageWebUrl?: string;
  imageMobileUrl?: string;
};

export type UpdateCategoryPayload = {
  name?: string;
  slug?: string;
  isActive?: boolean;
  imageWebUrl?: string;
  imageMobileUrl?: string;
};

export type CreateCategoryResponse = {
  message: string;
  data: CategoryAdmin;
};

export type UpdateCategoryResponse = {
  message: string;
  data: CategoryAdmin;
};

export type DeleteCategoryResponse = {
  message: string;
  data: {
    id: string;
    deletedProductsCount: number;
    deletedVariants: boolean;
    deletedImages: boolean;
    cloudinaryCleanupPendingPublicIds: string[];
  };
};

export type CategoryImageUploadSlot = "web" | "mobile";

export type CategoryImageUploadResponse = {
  message: string;
  data: {
    category: CategoryAdmin;
    uploadedAsset: {
      url: string;
      secureUrl: string;
      publicId: string;
    };
    previousAssetCleanup: {
      attempted: boolean;
      result?: string;
      error?: string;
    };
  };
};
