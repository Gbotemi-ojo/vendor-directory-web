import type { Vendor } from './vendor';

export interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export interface VendorCardProps {
  vendor: Vendor;
  isEditing: boolean;
  isUpdating: boolean;
  isRefreshing: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
  onSave: (id: string, data: Partial<Vendor>) => void;
  onRefresh: (id: string) => void;
}

export interface VendorFormProps {
  vendor: Vendor;
  isUpdating: boolean;
  onSave: (id: string, data: Partial<Vendor>) => void;
  onCancel: () => void;
}
