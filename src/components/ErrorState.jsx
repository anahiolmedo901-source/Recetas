import { RefreshCw, WifiOff } from 'lucide-react';

export default function ErrorState({ message = 'Algo ha fallado al cargar las recetas.', onRetry }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-[28px] border border-coral/20 bg-coral/5 px-6 text-center" role="alert">
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-soft-white text-coral shadow-card">
        <WifiOff size={22} />
      </span>
      <h3 className="font-display text-lg font-bold text-ink">No hemos llegado a la cocina</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink/60">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="button-secondary mt-5">
          <RefreshCw size={16} />
          Intentar de nuevo
        </button>
      )}
    </div>
  );
}
