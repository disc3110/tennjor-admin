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

export type ProductAdminVariant = {
  id: string;
  size: string;
  color: string;
  sku: string | null;
  isActive: boolean;
  stock: number;
};

export type ProductAdmin = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: ProductAdminCategory;
  images: ProductAdminImage[];
  variants: ProductAdminVariant[];
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
  data: ProductAdmin;
};
