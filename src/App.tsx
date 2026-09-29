import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { VendorCard } from './components/VendorCard';
import type { Vendor } from './types/vendor';

export default function App() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const fetchVendors = async (search = '') => {
    setLoading(true);
    try {
      const url = search ? `${API_URL}/vendors?search=${encodeURIComponent(search)}` : `${API_URL}/vendors`;
      const res = await fetch(url);
      const data = await res.json();
      setVendors(data);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchVendors(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleRefresh = async (id: string) => {
    setRefreshingId(id);
    try {
      const res = await fetch(`${API_URL}/vendors/${id}/refresh`, { method: 'POST' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed with status ${res.status}`);
      }
      const updatedVendor = await res.json();
      setVendors(vendors.map(v => v.id === id ? updatedVendor : v));
    } catch (error: any) {
      alert(`Failed to refresh: ${error.message}`);
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
      if (!res.ok) throw new Error('Update failed');
      
      await fetchVendors(searchTerm);
      setEditingId(null);
    } catch (error) {
      alert('Failed to update vendor.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 text-slate-800 font-sans tracking-tight">
      <div className="max-w-5xl mx-auto p-6 md:p-8">
        <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
