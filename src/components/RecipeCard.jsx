import { ArrowUpRight, Clock3, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  const { user, favoriteIds, toggleFavorite } = useAuth();
  const [favoriteError, setFavoriteError] = useState('');
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const isFavorite = favoriteIds.has(String(recipe.id));

  const handleFavorite = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    setFavoriteError('');

    if (!user) {
      navigate('/login', { state: { from: `/receta/${recipe.id}` } });
      return;
    }

    setIsUpdatingFavorite(true);
    try {
      await toggleFavorite(recipe);
    } catch {
      setFavoriteError('No se pudo guardar. Ejecuta el esquema SQL de Supabase.');
    } finally {
      setIsUpdatingFavorite(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-[26px] border border-sage/10 bg-soft-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[1.12] overflow-hidden bg-sage-light">
        <Link to={`/receta/${recipe.id}`} className="block h-full" aria-label={`Ver receta ${recipe.title}`}>
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-lg font-bold text-sage">miga.</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-70" />
          <span className="absolute left-4 top-4 rounded-full bg-soft-white/90 px-3 py-1.5 text-[11px] font-bold capitalize text-sage backdrop-blur-sm">
            {recipe.category}
          </span>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-soft-white">
            <span className="flex items-center gap-1.5 text-xs font-semibold">
              <Clock3 size={14} />
              {recipe.time || 'Tiempo variable'}
            </span>
            {recipe.area && <span className="text-xs font-medium opacity-80">{recipe.area}</span>}
          </div>
        </Link>
        <button
          type="button"
          onClick={handleFavorite}
          disabled={isUpdatingFavorite}
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-soft-white/90 backdrop-blur-sm transition hover:text-coral disabled:opacity-60 ${isFavorite ? 'text-coral' : 'text-ink/50'}`}
          aria-label={isFavorite ? `Quitar ${recipe.title} de favoritos` : `Guardar ${recipe.title} en favoritos`}
          aria-pressed={isFavorite}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <Link to={`/receta/${recipe.id}`} className="flex items-start justify-between gap-4 p-5">
        <h3 className="font-display text-lg font-bold leading-7 text-ink transition group-hover:text-sage">
          {recipe.title}
        </h3>
        <span className="mt-1 shrink-0 text-ink/35 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-coral">
          <ArrowUpRight size={19} />
        </span>
      </Link>
      {favoriteError && <p className="px-5 pb-4 text-xs font-semibold text-coral">{favoriteError}</p>}
    </article>
  );
}
