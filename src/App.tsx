import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { VendorCard } from './components/VendorCard';
import type { Vendor, PaginatedVendorResponse } from './types/vendor';

export default function App() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchVendors = useCallback(async (page: number, search = '') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page: String(page) });
      const res = await fetch(`${API_URL}/vendors?${params}`, {
        cache: 'no-store'
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const result: PaginatedVendorResponse = await res.json();
      setVendors(result.data);
      setTotalPages(result.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const fetchTimeout = setTimeout(() => {
      fetchVendors(currentPage, debouncedSearchTerm);
    });
    return () => clearTimeout(fetchTimeout);
  }, [currentPage, debouncedSearchTerm, fetchVendors]);

  const handleRefresh = async (id: string) => {
    setRefreshingId(id);
    try {
      const res = await fetch(`${API_URL}/vendors/${id}/refresh`, { method: 'POST' });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed with status ${res.status}`);
      }
      
      // The backend now returns a 202 Accepted with a Job ID, not the vendor data.
      // Wait 10 seconds to give the BullMQ background worker time to scrape and save to the DB.
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Re-fetch the entire list to pull the newly updated data
      await fetchVendors(currentPage, debouncedSearchTerm);
    } catch (error: any) {
      alert(`Failed to refresh: ${error.message}`);
    } finally {
      // Clear the spinning icon
      setRefreshingId(null);
    }
  };

  const handleUpdate = async (id: string, data: Partial<Vendor>) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`${API_URL}/vendors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (errData.details && Array.isArray(errData.details)) {
          const messages = errData.details.map((d: any) => `- ${d.path.join('.')}: ${d.message}`).join('\n');
          throw new Error(`Validation Error:\n${messages}`);
        }
        throw new Error(errData.error || 'Update failed');
      }
      
      await fetchVendors(currentPage, debouncedSearchTerm);
      setEditingId(null);
    } catch (error: any) {
      alert(`Failed to update vendor.\n\n${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 text-slate-800 font-sans tracking-tight">
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        <Header searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        
        {loading && vendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="font-medium">Loading vendors...</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isEditing={editingId === vendor.id}
                isUpdating={isUpdating}
                isRefreshing={refreshingId === vendor.id}
                onEditStart={() => setEditingId(vendor.id)}
                onEditCancel={() => setEditingId(null)}
                onSave={handleUpdate}
                onRefresh={handleRefresh}
              />
            ))}
            
            {vendors.length === 0 && !loading && (
              <div className="text-center py-24 bg-white border border-slate-200 border-dashed rounded-2xl">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No vendors found</h3>
                <p className="text-slate-500">We couldn't find anything matching "{searchTerm}".</p>
                <button 
                  onClick={() => handleSearchChange('')}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => page - 1)}
            disabled={currentPage === 1 || loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-slate-600" aria-live="polite">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => page + 1)}
            disabled={currentPage === totalPages || loading}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
