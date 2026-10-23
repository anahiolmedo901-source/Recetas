import RecipeCard from './RecipeCard';
import ErrorState from './ErrorState';
import LoadingSpinner from './LoadingSpinner';

function RecipeSkeleton() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-sage/10 bg-soft-white">
      <div className="aspect-[1.12] animate-pulse bg-sand" />
      <div className="space-y-3 p-5">
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-sand" />
        <div className="h-4 w-2/5 animate-pulse rounded-full bg-sand" />
      </div>
    </div>
  );
}

export default function RecipeGrid({ recipes, isLoading, error, onRetry }) {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => <RecipeSkeleton key={index} />)}
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={onRetry} />;

  if (!recipes.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-sage/20 bg-soft-white px-6 py-16 text-center">
        <p className="font-display text-xl font-bold text-ink">No encontramos esa combinación.</p>
        <p className="mt-2 text-sm text-ink/55">Prueba con otro ingrediente, categoría o plato.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
    </div>
  );
}
