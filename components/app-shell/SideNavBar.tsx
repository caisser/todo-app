import { NavItem } from './NavItem';
import { NewProjectButton } from './NewProjectButton';
import { SideNavBranding } from './SideNavBranding';
import { SignOutButton } from './SignOutButton';

const NAV_ITEMS = [
  { href: '/inbox', icon: 'inbox', label: 'Inbox' },
  { href: '#', icon: 'today', label: 'Today' },
  { href: '#', icon: 'event_upcoming', label: 'Upcoming' },
  { href: '#', icon: 'folder', label: 'Projects' },
];

export function SideNavBar() {
  return (
    <nav
      aria-label="Primary"
      className="hidden md:flex fixed top-0 left-0 h-screen w-64 flex-col bg-brand-surface-container-lowest border-r border-brand-outline-variant p-md"
    >
      <SideNavBranding />
      <ul className="flex flex-col gap-[4px]">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.label} href={item.href} icon={item.icon} label={item.label} />
        ))}
      </ul>
      <div className="mt-auto flex flex-col">
        <SignOutButton />
        <NewProjectButton />
      </div>
    </nav>
  );
}
