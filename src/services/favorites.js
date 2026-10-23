import { supabase } from './supabase';

export async function listFavoriteIds(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('recipe_id')
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []).map((favorite) => String(favorite.recipe_id));
}

export async function addFavorite(userId, recipe) {
  const { error } = await supabase.from('favorites').insert({
    user_id: userId,
    recipe_id: String(recipe.id),
    title: recipe.title,
    image: recipe.image || null,
    category: recipe.category || null,
  });

  if (error) throw error;
}

export async function removeFavorite(userId, recipeId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('recipe_id', String(recipeId));

  if (error) throw error;
}
