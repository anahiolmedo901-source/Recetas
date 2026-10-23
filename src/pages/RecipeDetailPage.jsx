import { ArrowLeft, Check, Clock3, ExternalLink, Flame, PlayCircle, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ErrorState from '../components/ErrorState';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRecipeById } from '../services/api';

const nutritionItems = [
  { key: 'calories', label: 'Calorías', icon: Flame },
  { key: 'protein', label: 'Proteínas', icon: null },
  { key: 'carbs', label: 'Carbohidratos', icon: null },
  { key: 'fat', label: 'Grasas', icon: null },
];

export default function RecipeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecipe() {
      setIsLoading(true);
      setError('');
      try {
        const data = await getRecipeById(id, { signal: controller.signal });
        setRecipe(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'No pudimos cargar esta receta.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadRecipe();
    return () => controller.abort();
  }, [id]);

  if (isLoading) {
    return <div className="page-shell py-16 sm:py-24"><LoadingSpinner label="Estamos preparando los detalles..." /></div>;
  }

  if (error || !recipe) {
    return <div className="page-shell py-16 sm:py-24"><ErrorState message={error || 'No encontramos esta receta.'} onRetry={() => navigate(0)} /></div>;
  }

  return (
    <div className="page-shell py-8 sm:py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-ink/55 transition hover:text-sage">
        <ArrowLeft size={17} /> Volver a explorar
      </Link>

      <article className="mt-8 overflow-hidden rounded-[34px] border border-sage/10 bg-soft-white shadow-soft sm:mt-10">
        <div className="grid lg:grid-cols-[.93fr_1.07fr]">
          <div className="relative min-h-[330px] bg-sage-light lg:min-h-[560px]">
            {recipe.image ? (
              <img src={recipe.image} alt={recipe.title} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center font-display text-2xl font-bold text-sage">miga.</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2 sm:bottom-8 sm:left-8 sm:right-8">
              {Array.from(new Set([recipe.category, recipe.area, ...(recipe.tags || [])].filter(Boolean))).slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-soft-white/90 px-3 py-1.5 text-xs font-bold capitalize text-sage backdrop-blur-sm">{tag}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <span className="eyebrow">Receta para disfrutar</span>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.06em] text-ink sm:text-5xl">
              {recipe.title}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-ink/60 sm:text-base">
              {recipe.summary || 'Una receta deliciosa para preparar en casa y compartir alrededor de la mesa.'}
            </p>
            <div className="mt-7 flex flex-wrap gap-3 border-y border-sage/10 py-5 text-sm font-semibold text-ink/60">
              <span className="flex items-center gap-2"><Clock3 size={17} className="text-coral" /> {recipe.time || 'Tiempo variable'}</span>
              {recipe.servings && <span className="flex items-center gap-2"><UsersRound size={17} className="text-coral" /> {recipe.servings} porciones</span>}
            </div>
            {(recipe.sourceUrl || recipe.youtube) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {recipe.sourceUrl && <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="button-secondary"><ExternalLink size={16} /> Fuente</a>}
                {recipe.youtube && <a href={recipe.youtube} target="_blank" rel="noreferrer" className="button-secondary"><PlayCircle size={16} /> Ver vídeo</a>}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-10 border-t border-sage/10 p-6 sm:p-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16 lg:p-14">
          <section aria-labelledby="ingredients-title">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="eyebrow">Lo que necesitas</span>
                <h2 id="ingredients-title" className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-ink">Ingredientes</h2>
              </div>
              <span className="rounded-full bg-sage-light px-3 py-1 text-xs font-bold text-sage">{recipe.ingredients.length} items</span>
            </div>
            <ul className="mt-6 divide-y divide-sage/10">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={`${ingredient.name}-${index}`} className="flex gap-3 py-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage-light text-sage"><Check size={13} strokeWidth={3} /></span>
                  <span className="flex-1 font-medium text-ink/75">{ingredient.name}</span>
                  {ingredient.measure && <span className="text-right text-ink/45">{ingredient.measure}</span>}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="steps-title">
            <span className="eyebrow">Manos a la obra</span>
            <h2 id="steps-title" className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-ink">Cómo prepararla</h2>
            <ol className="mt-6 space-y-6">
              {recipe.steps.map((step, index) => (
                <li key={`${step.number}-${index}`} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-peach/30 font-display text-sm font-extrabold text-coral">{index + 1}</span>
                  <p className="pt-1 text-sm leading-7 text-ink/65">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section className="border-t border-sage/10 bg-cream/60 p-6 sm:p-10 lg:p-14" aria-labelledby="nutrition-title">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Un vistazo rápido</span>
              <h2 id="nutrition-title" className="mt-2 font-display text-2xl font-extrabold tracking-[-0.04em] text-ink">Información nutricional</h2>
            </div>
            <p className="text-xs text-ink/45">Valores aproximados por receta</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {nutritionItems.map(({ key, label, icon: Icon }) => (
              <div key={key} className="rounded-2xl border border-sage/10 bg-soft-white p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-ink/40">
                  {Icon && <Icon size={14} className="text-coral" />}
                  {label}
                </div>
                <p className="mt-3 font-display text-xl font-extrabold text-ink">{recipe.nutrition[key] || 'N/D'}</p>
              </div>
            ))}
          </div>
          {!recipe.nutrition.calories && <p className="mt-4 text-xs leading-5 text-ink/45">La fuente de esta receta no proporciona información nutricional detallada.</p>}
        </section>
      </article>
    </div>
  );
}
