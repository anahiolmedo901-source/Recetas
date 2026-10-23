import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="page-shell flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-peach/25 text-coral"><SearchX size={28} /></span>
      <p className="eyebrow mt-6">Página no encontrada</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.06em] text-ink">Aquí no hay migas.</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-ink/55">La página que buscas no existe o se ha movido a otra mesa.</p>
      <Link to="/" className="button-primary mt-7"><ArrowLeft size={17} /> Volver al inicio</Link>
    </div>
  );
}
