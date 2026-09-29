import React, { useState, useEffect } from 'react';
import { Search, Edit2, RefreshCw, X, Save } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  website: string | null;
  description: string | null;
}

export default function App() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Vendor>>({});
  const [refreshingId, setRefreshingId] = useState<string | null>(null);

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

  // Debounce the search input
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
      if (!res.ok) throw new Error('Refresh failed');
      const updatedVendor = await res.json();
      setVendors(vendors.map(v => v.id === id ? updatedVendor : v));
    } catch (error) {
      alert('Failed to refresh data from source.');
    } finally {
      setRefreshingId(null);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;
    
    try {
      const res = await fetch(`${API_URL}/vendors/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Update failed');
      
      fetchVendors(searchTerm);
      setEditingId(null);
    } catch (error) {
      alert('Failed to update vendor.');
    }
  };

  const startEdit = (vendor: Vendor) => {
    setEditingId(vendor.id);
    setEditForm(vendor);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-slate-800">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">AI Security Vendor Directory</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vendors..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading && vendors.length === 0 ? (
        <p className="text-center text-slate-500">Loading vendors...</p>
      ) : (
        <div className="grid gap-4">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="border rounded-xl p-5 bg-white shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start transition-all hover:shadow-md">
              {editingId === vendor.id ? (
                <form onSubmit={handleUpdate} className="flex-1 w-full space-y-3">
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.name || ''}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                    required
                  />
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.website || ''}
                    onChange={e => setEditForm({...editForm, website: e.target.value})}
                    placeholder="Website URL"
                  />
                  <textarea
                    className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editForm.description || ''}
                    onChange={e => setEditForm({...editForm, description: e.target.value})}
                  />
                  <div className="flex gap-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 text-sm hover:bg-blue-700 font-medium">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded flex items-center gap-2 text-sm hover:bg-slate-200 font-medium">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-slate-900">{vendor.name}</h2>
                    {vendor.website && (
                      <a href={vendor.website.startsWith('http') ? vendor.website : `https://cybersectools.com${vendor.website}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline font-medium mt-1 inline-block">
                        {vendor.website}
                      </a>
                    )}
                    <p className="mt-3 text-slate-600 text-sm leading-relaxed">{vendor.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => startEdit(vendor)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleRefresh(vendor.id)} disabled={refreshingId === vendor.id} className={`p-2 rounded transition-colors ${refreshingId === vendor.id ? 'text-blue-500' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`} title="Refresh from live source">
                      <RefreshCw className={`w-5 h-5 ${refreshingId === vendor.id ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {vendors.length === 0 && !loading && (
            <p className="text-center text-slate-500 py-8">No vendors match your search.</p>
          )}
        </div>
      )}
    </div>
  );
}