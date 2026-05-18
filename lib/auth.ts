// Real Supabase Auth — replaces lib/mock-auth.ts
"use client";

import { createClient } from "@/lib/supabase/client";

// ─── Sign Up ─────────────────────────────────────────────────────────────────

export async function signUp({
  email,
  password,
  name,
  phone,
  role,
  companyName,
}: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: "embarcador" | "transportista";
  companyName?: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone: phone ?? null,
        role,
        company_name: companyName ?? null,
      },
    },
  });

  if (error) throw error;
  return data;
}

// ─── Sign In ─────────────────────────────────────────────────────────────────

export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// ─── Get current session user (client side) ─────────────────────────────────

export async function getUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ─── Get full profile from profiles table ────────────────────────────────────

export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

// ─── Password reset ───────────────────────────────────────────────────────────

export async function sendPasswordReset(email: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/update-password`,
  });
  if (error) throw error;
}
