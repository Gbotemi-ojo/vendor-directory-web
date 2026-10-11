export interface Vendor {
  id: string;
  slug: string | null;
  name: string;
  website: string | null;
  description: string | null;
}

export interface PaginatedVendorResponse {
  data: Vendor[];
  meta: {
    totalPages: number;
    total?: number;
    page?: number;
    limit?: number;
  };
}
