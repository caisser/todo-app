import type { ReactNode } from 'react';

export function MainContent({ children }: { children: ReactNode }) {
  return <main className="flex-grow md:ml-64 relative">{children}</main>;
}
