import { LoaderCircle } from 'lucide-react';

export default function LoadingSpinner({ label = 'Cargando recetas...' }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-[28px] border border-sage/10 bg-soft-white px-6 text-center" role="status" aria-live="polite">
      <LoaderCircle className="animate-spin text-coral" size={30} strokeWidth={2.2} />
      <span className="text-sm font-semibold text-ink/60">{label}</span>
    </div>
  );
}
