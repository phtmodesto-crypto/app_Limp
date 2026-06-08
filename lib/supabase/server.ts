import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./types";

// Cliente para uso em Server Components e Route Handlers
// Usa o anon key (respeita RLS)
export function createSupabaseServerClient() {
  // Next.js 14: cookies() é síncrono; Next.js 15+: assíncrono (await opcional)
  const cookieStore = cookies() as ReturnType<typeof cookies> & {
    getAll(): { name: string; value: string }[];
    set(name: string, value: string, options?: Record<string, unknown>): void;
  };

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll chamado em Server Component — ignorar
          }
        },
      },
    }
  );
}

// Cliente administrativo com service_role — NUNCA use no cliente
// Ignora RLS: acesso total ao banco (equivalente ao Prisma server-side)
export function createSupabaseAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
