'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/libs/supabase/server';

export type RegisterState = {
  errors?: {
    fullName?: string;
    email?: string;
    password?: string;
    global?: string;
  };
  info?: string;
};

export async function registerUser(_prevState: RegisterState, formData: FormData): Promise<RegisterState> {
  const fullName = (formData.get('full_name') as string | null)?.trim() ?? '';
  const email = (formData.get('email') as string | null)?.trim() ?? '';
  const password = (formData.get('password') as string | null) ?? '';

  const errors: NonNullable<RegisterState['errors']> = {};

  if (!fullName) errors.fullName = 'El nombre es obligatorio';

  if (!email) {
    errors.email = 'El correo es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ingresa un correo válido';
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
  }

  if (Object.keys(errors).length > 0) return { errors };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    const isExisting = (error as { code?: string }).code === 'user_already_exists' || error.status === 422;
    if (isExisting) {
      return { errors: { global: 'Este correo ya está registrado.' } };
    }
    return { errors: { global: error.message } };
  }

  if (!data.session) {
    return { info: 'Revisa tu correo para confirmar tu cuenta.' };
  }

  redirect('/');
}
