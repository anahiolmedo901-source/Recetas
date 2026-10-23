import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addFavorite, listFavoriteIds, removeFavorite } from '../services/favorites';
import { signOutUser } from '../services/auth';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [areFavoritesLoading, setAreFavoritesLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthLoading(false);
      return undefined;
    }

    let mounted = true;
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user || null);
      setIsAuthLoading(false);
    };

    loadSession().catch(() => {
      if (mounted) setIsAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user || null);
      setIsAuthLoading(false);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    if (!user || !supabase) {
      setFavoriteIds(new Set());
      setAreFavoritesLoading(false);
      return () => {
        mounted = false;
      };
    }

    setAreFavoritesLoading(true);
    listFavoriteIds(user.id)
      .then((ids) => {
        if (mounted) setFavoriteIds(new Set(ids));
      })
      .catch(() => {
        if (mounted) setFavoriteIds(new Set());
      })
      .finally(() => {
        if (mounted) setAreFavoritesLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  const toggleFavorite = async (recipe) => {
    if (!user || !supabase) return { requiresAuth: true };

    const recipeId = String(recipe.id);
    const wasFavorite = favoriteIds.has(recipeId);
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (wasFavorite) next.delete(recipeId);
      else next.add(recipeId);
      return next;
    });

    try {
      if (wasFavorite) await removeFavorite(user.id, recipeId);
      else await addFavorite(user.id, recipe);
      return { isFavorite: !wasFavorite };
    } catch (error) {
      setFavoriteIds((current) => {
        const next = new Set(current);
        if (wasFavorite) next.add(recipeId);
        else next.delete(recipeId);
        return next;
      });
      throw error;
    }
  };

  const value = useMemo(() => ({
    session,
    user,
    isAuthLoading,
    favoriteIds,
    areFavoritesLoading,
    toggleFavorite,
    signOut: signOutUser,
  }), [session, user, isAuthLoading, favoriteIds, areFavoritesLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
