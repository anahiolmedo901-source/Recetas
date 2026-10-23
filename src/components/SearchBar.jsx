import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="flex w-full items-center gap-2 rounded-2xl border border-sage/10 bg-soft-white p-2 shadow-card" role="search">
      <Search className="ml-3 shrink-0 text-ink/40" size={20} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="¿Qué te apetece cocinar hoy?"
        aria-label="Buscar recetas"
        className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-ink outline-none placeholder:text-ink/35"
      />
      <button type="submit" className="button-primary shrink-0 px-4 py-3 sm:px-5">
        <span className="hidden sm:inline">Buscar</span>
        <Search size={18} className="sm:hidden" />
      </button>
    </form>
  );
}
