import type { ReactNode } from 'react';

export function InboxCanvas({ children }: { children: ReactNode }) {
  return <div className="pt-[80px] pb-xl px-sm md:px-lg max-w-container-max mx-auto mt-lg">{children}</div>;
}
