export function hasSupabasePublicEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function hasSupabaseAdminEnv() {
  return hasSupabasePublicEnv() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
