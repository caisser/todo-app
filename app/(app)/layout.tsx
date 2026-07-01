import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { MainContent } from '@/components/app-shell/MainContent';
import { MobileFAB } from '@/components/app-shell/MobileFAB';
import { SideNavBar } from '@/components/app-shell/SideNavBar';
import { TopNavBar } from '@/components/app-shell/TopNavBar';
import { createClient } from '@/libs/supabase/server';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/login');
  }

  const avatarUrl = user.user_metadata?.avatar_url;
  const shellUser = {
    email: user.email ?? '',
    avatarUrl: typeof avatarUrl === 'string' ? avatarUrl : null,
  };

  return (
    <div className="min-h-screen flex bg-brand-background">
      <SideNavBar />
      <TopNavBar user={shellUser} />
      <MainContent>{children}</MainContent>
      <MobileFAB />
    </div>
  );
}
