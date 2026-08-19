import { supabase } from './supabase';

/** Authentication and authorization are deliberately separate. */
export async function getAdminAuthorization() {
  if (!supabase) return { session: null, isAdmin: false };
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { session: null, isAdmin: false };
  const { data, error } = await supabase.rpc('is_admin');
  return { session, isAdmin: !error && data === true };
}

export async function requireAdmin() {
  const authorization = await getAdminAuthorization();
  if (!authorization.isAdmin) await supabase?.auth.signOut();
  return authorization;
}
