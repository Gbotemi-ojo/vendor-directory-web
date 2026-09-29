import { Edit2, RefreshCw, Globe } from 'lucide-react';
import { VendorForm } from './VendorForm';
import type { Vendor } from '../types/vendor';

interface VendorCardProps {
  vendor: Vendor;
  isEditing: boolean;
  isUpdating: boolean;
  isRefreshing: boolean;
  onEditStart: () => void;
  onEditCancel: () => void;
  onSave: (id: string, data: Partial<Vendor>) => void;
  onRefresh: (id: string) => void;
}

export function VendorCard({ vendor, isEditing, isUpdating, isRefreshing, onEditStart, onEditCancel, onSave, onRefresh }: VendorCardProps) {
  return (
    <div
      className={`bg-white border border-slate-200/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start transition-all duration-300 ${
        isEditing ? 'shadow-lg ring-1 ring-slate-900/5 scale-[1.01]' : 'shadow-sm hover:shadow-md hover:border-slate-300/80'
      }`}
    >
      {isEditing ? (
        <VendorForm vendor={vendor} isUpdating={isUpdating} onSave={onSave} onCancel={onEditCancel} />
      ) : (
        <>
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-bold text-slate-900 truncate mb-1.5">{vendor.name}</h2>
            
            {vendor.website && (
              <a
                href={vendor.website.startsWith('http') ? vendor.website : `https://cybersectools.com${vendor.website}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 text-sm hover:text-blue-700 hover:underline font-medium mt-1 mb-4"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="truncate">{vendor.website}</span>
              </a>
            )}
            
            <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
              {vendor.description || <span className="italic text-slate-400">No description provided.</span>}
            </p>
          </div>

          <div className="flex md:flex-col gap-2 shrink-0 bg-slate-50/80 p-1.5 rounded-xl border border-slate-100">
            <button
              onClick={onEditStart}
              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
              title="Edit Vendor"
            >
              <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={() => onRefresh(vendor.id)}
              disabled={isRefreshing}
              className={`p-2.5 rounded-lg transition-colors group ${
                isRefreshing ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              title="Sync latest data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
