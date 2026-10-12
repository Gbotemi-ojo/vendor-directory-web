import { useState, type FormEvent } from 'react';
import { Save, X, Loader2, Building2, Globe, AlignLeft } from 'lucide-react';
import type { VendorFormProps } from '../types/components';
import type { Vendor } from '../types/vendor';

export function VendorForm({ vendor, isUpdating, onSave, onCancel }: VendorFormProps) {
  const [formData, setFormData] = useState<Partial<Vendor>>(vendor);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const website = formData.website?.trim() ?? '';
    let normalizedWebsite: string | null = null;
    if (website) {
      const candidate = /^https?:\/\//i.test(website) ? website : `https://${website}`;
      try {
        const parsedUrl = new URL(candidate);
        if (!['http:', 'https:'].includes(parsedUrl.protocol) || !parsedUrl.hostname) {
          throw new Error('Invalid website URL.');
        }
        normalizedWebsite = parsedUrl.toString();
      } catch {
        setError('Enter a valid website URL, such as https://example.com.');
        return;
      }
    }

    try {
      await onSave(vendor.id, {
        name: formData.name,
        slug: formData.slug,
        website: normalizedWebsite,
        description: formData.description?.trim() || null,
      });
    } catch (saveError: unknown) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save vendor.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 w-full space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
          <Building2 className="w-3.5 h-3.5" /> Vendor Name
        </label>
        <input
          type="text"
          disabled={isUpdating}
          className="w-full border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all disabled:opacity-50"
          value={formData.name || ''}
          onChange={e => {
            setError(null);
            setFormData({ ...formData, name: e.target.value });
          }}
          required
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
          <Globe className="w-3.5 h-3.5" /> Website URL
        </label>
        <input
          disabled={isUpdating}
          className="w-full border border-slate-200 bg-slate-50 focus:bg-white px-4 py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all disabled:opacity-50"
          value={formData.website || ''}
          onChange={e => {
            setError(null);
            setFormData({ ...formData, website: e.target.value });
          }}
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
          <AlignLeft className="w-3.5 h-3.5" /> Description
        </label>
        <textarea
          disabled={isUpdating}
          className="w-full border border-slate-200 bg-slate-50 focus:bg-white px-4 py-3 rounded-xl h-28 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none disabled:opacity-50 leading-relaxed"
          value={formData.description || ''}
          onChange={e => {
            setError(null);
            setFormData({ ...formData, description: e.target.value });
          }}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:bg-blue-700 font-semibold shadow-sm shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          disabled={isUpdating}
          onClick={onCancel}
          className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm hover:bg-slate-50 font-semibold transition-all active:scale-95 disabled:opacity-50"
        >
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </form>
  );
}
