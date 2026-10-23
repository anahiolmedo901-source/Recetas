import { ArrowRight, ChevronDown, Leaf, Sparkles, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import RecipeGrid from '../components/RecipeGrid';
import SearchBar from '../components/SearchBar';
import { getRecipes } from '../services/api';

const quickSearches = ['Pasta', 'Pollo', 'Postres'];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(searchQuery);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    setQuery(searchQuery);
    const controller = new AbortController();

    async function loadRecipes() {
      setIsLoading(true);
      setError('');

      try {
        const data = await getRecipes({ query: searchQuery, signal: controller.signal });
        setRecipes(data);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'No pudimos cargar las recetas.');
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadRecipes();
    return () => controller.abort();
  }, [searchQuery, retryToken]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextQuery = query.trim();
    setSearchParams(nextQuery ? { q: nextQuery } : {});
  };

  const handleQuickSearch = (value) => {
    setQuery(value);
    setSearchParams({ q: value });
  };

  const clearSearch = () => {
    setQuery('');
    setSearchParams({});
  };

  return (
    <>
      <section className="relative overflow-hidden bg-hero-radial pb-16 pt-12 sm:pb-24 sm:pt-16 lg:pt-20">
        <div className="page-shell relative grid items-center gap-12 lg:grid-cols-[1.03fr_.97fr] lg:gap-20">
          <div className="relative z-10">
            <span className="eyebrow"><Sparkles size={15} /> Cocina con intención</span>
            <h1 className="mt-6 max-w-2xl font-display text-[clamp(2.9rem,7vw,5.8rem)] font-extrabold leading-[.98] tracking-[-0.07em] text-ink">
              Recetas que hacen espacio para <span className="text-coral">lo importante.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-ink/60 sm:text-lg">
              Ideas honestas, ingredientes cotidianos y ese pequeño empujón que faltaba para cocinar algo rico hoy.
            </p>
            <div className="mt-8 max-w-xl">
              <SearchBar value={query} onChange={setQuery} onSubmit={handleSubmit} />
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink/45">
                <span className="mr-1">Quizá buscas:</span>
                {quickSearches.map((item) => (
                  <button key={item} type="button" onClick={() => handleQuickSearch(item)} className="rounded-full border border-sage/15 px-3 py-1.5 transition hover:border-coral/40 hover:bg-soft-white hover:text-coral">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-ink/55">
              <span className="flex items-center gap-2"><Leaf size={16} className="text-sage" /> Ingredientes reales</span>
              <span className="hidden items-center gap-2 sm:flex"><UsersRound size={16} className="text-sage" /> Para compartir</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[510px] lg:mx-0 lg:justify-self-end">
            <div className="absolute -right-4 top-3 h-24 w-24 rounded-full bg-peach/50 blur-2xl sm:-right-8 sm:h-40 sm:w-40" />
            <div className="absolute -bottom-8 left-1 h-28 w-28 rounded-full bg-sage/20 blur-2xl sm:left-8 sm:h-44 sm:w-44" />
            <div className="relative rotate-2 rounded-[42px] bg-sage p-3 shadow-soft sm:p-4">
              <div className="overflow-hidden rounded-[32px] bg-sage-light">
                <img
                  src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
                  alt="Cuenco de comida fresca con verduras"
                  className="aspect-[.9] w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 flex max-w-[220px] items-center gap-3 rounded-2xl border border-sage/10 bg-soft-white px-4 py-3 shadow-card sm:-left-8">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-peach/30 text-coral"><Sparkles size={19} /></span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.15em] text-ink/40">La receta del día</p>
                  <p className="mt-0.5 font-display text-sm font-bold text-ink">Sabor sin complicarse</p>
                </div>
              </div>
            </div>
            <span className="absolute -right-2 top-1/2 flex h-14 w-14 -rotate-12 items-center justify-center rounded-full border-4 border-cream bg-coral font-display text-xs font-extrabold uppercase leading-3 text-soft-white shadow-card sm:-right-7">
              rico<br />rico
            </span>
          </div>
        </div>
        <div className="page-shell mt-16 flex justify-center sm:mt-20">
          <a href="#recetas" className="flex flex-col items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-ink/40 transition hover:text-coral">
            Descubre
            <ChevronDown size={17} className="animate-bounce" />
          </a>
        </div>
      </section>

      <section id="recetas" className="page-shell scroll-mt-8 pb-4 pt-8 sm:pt-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">{searchQuery ? 'Tu búsqueda' : 'Para empezar con ganas'}</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold tracking-[-0.05em] text-ink sm:text-4xl">
              {searchQuery ? <>Resultados para <span className="text-coral">“{searchQuery}”</span></> : <>Una mesa llena de <span className="text-sage">posibilidades.</span></>}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/55">
              {searchQuery ? 'Hemos buscado algo que encaje con tu antojo.' : 'Recetas seleccionadas para que encuentres tu próxima favorita.'}
            </p>
          </div>
          {searchQuery ? (
            <button type="button" onClick={clearSearch} className="button-secondary self-start sm:self-auto">Ver todas</button>
          ) : (
            <Link to="/registro" className="group inline-flex items-center gap-2 self-start text-sm font-bold text-sage sm:self-auto">
              Guarda tus favoritas <ArrowRight size={17} className="transition group-hover:translate-x-1" />
            </Link>
          )}
        </div>
        <RecipeGrid recipes={recipes} isLoading={isLoading} error={error} onRetry={() => setRetryToken((token) => token + 1)} />
      </section>
    </>
  );
}
