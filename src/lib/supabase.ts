import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Dummy client for when env vars are missing
const dummyClient = {
  from: () => ({
    select: () => ({ order: () => Promise.resolve({ data: [] }) }),
    insert: () =>
      Promise.resolve({
        data: null,
        error: { message: "Supabase not configured" },
      }),
    update: () =>
      Promise.resolve({
        data: null,
        error: { message: "Supabase not configured" },
      }),
    delete: () =>
      Promise.resolve({
        data: null,
        error: { message: "Supabase not configured" },
      }),
  }),
  auth: {
    signInWithPassword: () =>
      Promise.resolve({
        data: null,
        error: { message: "Supabase not configured" },
      }),
    signOut: () => Promise.resolve(),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: (callback: any) => ({
      data: { subscription: null },
      error: null,
    }),
  },
};

let supabase: any = dummyClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Server-side Supabase client with service role
export const createServerSupabaseClient = async () => {
  if (!supabaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  const { createClient: createServerClient } =
    await import("@supabase/supabase-js");

  return createServerClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
};
