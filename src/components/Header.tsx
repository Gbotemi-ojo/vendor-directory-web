import { Search } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Header({ searchTerm, onSearchChange }: HeaderProps) {
  return (
    <header className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          AI Security Directory
        </h1>
        <p className="text-slate-500 font-medium">Manage and monitor vendor intelligence</p>
      </div>
      <div className="relative w-full md:w-80 shrink-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search vendors..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm transition-all placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </header>
  );
}
