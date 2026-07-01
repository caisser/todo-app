'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
}

export function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        className={`flex items-center gap-sm px-sm py-xs rounded-lg transition-all duration-200 active:translate-x-1 ${
          isActive
            ? 'bg-brand-surface-container-high text-brand-primary font-bold'
            : 'text-brand-secondary hover:bg-brand-surface-container-low'
        }`}
      >
        <span
          aria-hidden="true"
          className="material-symbols-outlined"
          style={{
            fontSize: '24px',
            fontVariationSettings: `'FILL' ${isActive ? 1 : 0}, 'wght' 300`,
          }}
        >
          {icon}
        </span>
        <span className="font-body-md">{label}</span>
      </Link>
    </li>
  );
}
