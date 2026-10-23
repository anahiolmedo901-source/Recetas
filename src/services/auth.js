import { isSupabaseConfigured, supabase } from './supabase';

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase no esta configurado. Completa las variables del archivo .env.');
  }
}

export async function registerUser({ name, email, password }) {
  ensureSupabase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) throw error;
  return data;
}

export async function signInUser({ email, password }) {
  ensureSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  ensureSupabase();

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
