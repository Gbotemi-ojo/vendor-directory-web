import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { VendorCard } from './components/VendorCard';
import type { Vendor, PaginatedVendorResponse } from './types/vendor';

export default function App() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const fetchController = useRef<AbortController | null>(null);

  const fetchVendors = useCallback(async (page: number, search: string, signal?: AbortSignal) => {
    fetchController.current?.abort();
    const controller = new AbortController();
    fetchController.current = controller;
    const abortRequest = () => controller.abort();
    signal?.addEventListener('abort', abortRequest, { once: true });
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page: String(page) });
      const res = await fetch(`${API_URL}/vendors?${params}`, {
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const result: PaginatedVendorResponse = await res.json();
      if (fetchController.current === controller) {
        setVendors(result.data);
        setTotalPages(result.meta.totalPages);
      }
      return result.data;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return null;
      }
      throw error;
    } finally {
      signal?.removeEventListener('abort', abortRequest);
      if (fetchController.current === controller) {
        fetchController.current = null;
        setLoading(false);
      }
    }
  }, [API_URL]);

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
  };

  useEffect(() => {
    const controller = new AbortController();
    const fetchTimeout = setTimeout(() => {
      fetchVendors(currentPage, searchTerm, controller.signal).catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setNotice({
            type: 'error',
            message: error instanceof Error ? error.message : 'Failed to fetch vendors.',
          });
        }
      });
    }, 300);

    return () => {
      clearTimeout(fetchTimeout);
      controller.abort();
      fetchController.current?.abort();
    };
  }, [currentPage, searchTerm, fetchVendors]);

  useEffect(() => () => fetchController.current?.abort(), []);

  const handleRefresh = async (id: string) => {
    setRefreshingId(id);
    setNotice(null);
    try {
      const res = await fetch(`${API_URL}/vendors/${id}/refresh`, { method: 'POST' });

      if (!res.ok) {
        throw new Error(`Refresh request failed with status ${res.status}`);
      }

      const vendorBeforeRefresh = vendors.find((vendor) => vendor.id === id);
      if (!vendorBeforeRefresh) {
        throw new Error('Could not find the vendor to refresh.');
      }

      let updated = false;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const refreshedVendors = await fetchVendors(currentPage, searchTerm);
        if (!refreshedVendors) {
          continue;
        }
        const refreshedVendor = refreshedVendors.find((vendor) => vendor.id === id);
        if (
          refreshedVendor &&
          (refreshedVendor.name !== vendorBeforeRefresh.name ||
            refreshedVendor.slug !== vendorBeforeRefresh.slug ||
            refreshedVendor.website !== vendorBeforeRefresh.website ||
            refreshedVendor.description !== vendorBeforeRefresh.description)
        ) {
          updated = true;
          break;
        }
      }

      if (!updated) {
        throw new Error('The refreshed vendor data was not visible after 10 checks.');
      }
      setNotice({ type: 'success', message: 'Vendor data refreshed.' });
    } catch (error: unknown) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to refresh vendor.',
      });
    } finally {
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
        const errorData: unknown = await res.json().catch(() => null);
        if (
          typeof errorData === 'object' &&
          errorData !== null &&
          'error' in errorData &&
          typeof errorData.error === 'string'
        ) {
          throw new Error(errorData.error);
        }
        throw new Error(`Update failed with status ${res.status}`);
      }

      await fetchVendors(currentPage, searchTerm);
      setEditingId(null);
      setNotice(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 text-slate-800 font-sans tracking-tight">
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        <Header searchTerm={searchTerm} onSearchChange={handleSearchChange} />

        {notice && (
          <div
            role={notice.type === 'error' ? 'alert' : 'status'}
            className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
              notice.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {notice.message}
          </div>
        )}
        
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
