const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';
const MEALDB_API_KEY = import.meta.env.VITE_MEALDB_API_KEY?.trim() || '1';
const MEALDB_BASE_URL = `https://www.themealdb.com/api/json/v1/${MEALDB_API_KEY}`;
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY?.trim();

export const API_PROVIDER = SPOONACULAR_API_KEY ? 'spoonacular' : 'mealdb';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 402 || response.status === 401) {
      throw new ApiError('La clave de la API no es válida o ha alcanzado su límite.', response.status);
    }

    throw new ApiError('No hemos podido conectar con el servicio de recetas.', response.status);
  }

  return response.json();
}

function cleanText(value = '') {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function splitInstructions(value = '') {
  const normalized = String(value ?? '').replace(/\r/g, '').trim();
  if (!normalized) return [];

  const lines = normalized
    .split(/\n+/)
    .map((line) => cleanText(line).replace(/^\d+[.)-]?\s*/, '').trim())
    .filter(Boolean);

  if (lines.length > 1) return lines;

  return (lines[0].match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [lines[0]])
    .map((step) => step.trim())
    .filter(Boolean);
}

function normalizeSpoonacularRecipe(recipe) {
  const ingredients = (recipe.extendedIngredients || []).map((ingredient) => ({
    name: cleanText(ingredient.name || ingredient.originalName || ''),
    measure: cleanText(ingredient.original || `${ingredient.amount || ''} ${ingredient.unit || ''}`),
  })).filter((ingredient) => ingredient.name || ingredient.measure);

  const steps = (recipe.analyzedInstructions || [])
    .flatMap((section) => section.steps || [])
    .map((step) => ({ number: step.number, text: cleanText(step.step) }))
    .filter((step) => step.text);

  if (!steps.length && recipe.instructions) {
    splitInstructions(recipe.instructions).forEach((text, index) => {
      steps.push({ number: index + 1, text });
    });
  }

  const nutrients = recipe.nutrition?.nutrients || [];
  const getNutrient = (names) => {
    const nutrient = nutrients.find((item) => names.includes(item.name?.toLowerCase()));
    return nutrient ? `${Math.round(nutrient.amount)}${nutrient.unit || ''}` : null;
  };

  return {
    id: String(recipe.id),
    title: cleanText(recipe.title) || 'Receta sin título',
    image: recipe.image || '',
    category: recipe.dishTypes?.[0] || recipe.cuisines?.[0] || 'Receta',
    area: recipe.cuisines?.[0] || '',
    time: recipe.readyInMinutes ? `${recipe.readyInMinutes} min` : null,
    minutes: recipe.readyInMinutes || null,
    servings: recipe.servings || null,
    summary: cleanText(recipe.summary),
    ingredients,
    steps,
    nutrition: {
      calories: getNutrient(['calories']),
      protein: getNutrient(['protein']),
      carbs: getNutrient(['carbohydrates']),
      fat: getNutrient(['fat']),
    },
    tags: [...(recipe.dishTypes || []), ...(recipe.diets || [])].slice(0, 3),
    sourceUrl: recipe.sourceUrl || '',
    youtube: '',
  };
}

function getMealDbIngredients(meal) {
  return Array.from({ length: 20 }, (_, index) => index + 1)
    .map((index) => ({
      name: meal[`strIngredient${index}`]?.trim() || '',
      measure: meal[`strMeasure${index}`]?.trim() || '',
    }))
    .filter((ingredient) => ingredient.name);
}

function normalizeMealDbRecipe(recipe) {
  const tags = recipe.strTags ? recipe.strTags.split(',').map((tag) => tag.trim()).filter(Boolean) : [];

  return {
    id: String(recipe.idMeal),
    title: recipe.strMeal || 'Receta sin título',
    image: recipe.strMealThumb || '',
    category: recipe.strCategory || 'Receta',
    area: recipe.strArea || '',
    time: null,
    minutes: null,
    servings: null,
    summary: `Una receta de ${recipe.strArea || 'cocina casera'} para preparar y disfrutar sin complicaciones.`,
    ingredients: getMealDbIngredients(recipe),
    steps: splitInstructions(recipe.strInstructions).map((text, index) => ({ number: index + 1, text })),
    nutrition: {
      calories: null,
      protein: null,
      carbs: null,
      fat: null,
    },
    tags: [recipe.strCategory, recipe.strArea, ...tags].filter(Boolean).slice(0, 3),
    sourceUrl: recipe.strSource || '',
    youtube: recipe.strYoutube || '',
  };
}

async function getSpoonacularRecipes(query, signal) {
  const params = new URLSearchParams({
    apiKey: SPOONACULAR_API_KEY,
    number: '12',
    addRecipeInformation: 'true',
    instructions: 'true',
    fillIngredients: 'true',
    sort: query ? 'popularity' : 'random',
  });

  if (query) params.set('query', query);

  const data = await fetchJson(`${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`, { signal });
  return (data.results || []).map(normalizeSpoonacularRecipe);
}

async function getMealDbRecipes(query, signal) {
  if (query) {
    const data = await fetchJson(`${MEALDB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`, { signal });
    return (data.meals || []).map(normalizeMealDbRecipe);
  }

  const categories = ['Chicken', 'Beef', 'Dessert', 'Vegetarian'];
  const responses = await Promise.all(
    categories.map((category) => fetchJson(`${MEALDB_BASE_URL}/filter.php?c=${category}`, { signal })),
  );
  const meals = responses.flatMap((response) => response.meals || []);
  const uniqueMeals = Array.from(new Map(meals.map((meal) => [meal.idMeal, meal])).values());

  return uniqueMeals
    .sort(() => Math.random() - 0.5)
    .slice(0, 12)
    .map(normalizeMealDbRecipe);
}

export async function getRecipes({ query = '', signal } = {}) {
  return API_PROVIDER === 'spoonacular'
    ? getSpoonacularRecipes(query.trim(), signal)
    : getMealDbRecipes(query.trim(), signal);
}

export async function getRecipeById(id, { signal } = {}) {
  if (API_PROVIDER === 'spoonacular') {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      includeNutrition: 'true',
    });
    const data = await fetchJson(`${SPOONACULAR_BASE_URL}/recipes/${encodeURIComponent(id)}/information?${params}`, { signal });
    return normalizeSpoonacularRecipe(data);
  }

  const data = await fetchJson(`${MEALDB_BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`, { signal });
  const meal = data.meals?.[0];
  if (!meal) throw new ApiError('No encontramos esta receta.', 404);
  return normalizeMealDbRecipe(meal);
}
