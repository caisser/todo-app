import type { ReactNode } from 'react';

export function TaskList({ children }: { children: ReactNode }) {
  return <div className="flex flex-col">{children}</div>;
}
