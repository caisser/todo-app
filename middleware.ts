import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import { environment } from '@/libs/env';

const PROTECTED_PREFIXES = ['/inbox', '/today', '/upcoming', '/projects'];
const AUTH_PAGES = new Set(['/login', '/register']);

function redirectWithCookies(request: NextRequest, path: string, response: NextResponse) {
  const redirect = NextResponse.redirect(new URL(path, request.url));
  for (const { name, value } of response.cookies.getAll()) {
    redirect.cookies.set(name, value);
  }
  return redirect;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(environment.supabaseUrl, environment.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  const isAuthPage = AUTH_PAGES.has(path);

  if (!user && isProtected) {
    return redirectWithCookies(request, '/login', response);
  }

  if (user && isAuthPage) {
    return redirectWithCookies(request, '/inbox', response);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)'],
};
