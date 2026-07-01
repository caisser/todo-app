'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/libs/supabase/server';

export type LoginState = {
  error?: string;
};

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const password = (formData.get('password') as string | null) ?? '';

  if (!email || !password) {
    return { error: 'Ingresa tu correo y contraseña.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Correo o contraseña incorrectos.' };
  }

  redirect('/inbox');
}
