import { AddTaskButton } from './AddTaskButton';
import { DesktopSearch } from './DesktopSearch';
import { MobileBrand } from './MobileBrand';
import { MobileHamburger } from './MobileHamburger';
import { MobileSearchIcon } from './MobileSearchIcon';
import { UserAvatar } from './UserAvatar';

interface TopNavBarProps {
  user: {
    email: string;
    avatarUrl: string | null;
  };
}

export function TopNavBar({ user }: TopNavBarProps) {
  return (
    <header className="fixed top-0 left-0 md:left-64 h-[64px] w-full md:w-[calc(100%-16rem)] border-b border-brand-outline-variant bg-brand-surface-container-lowest z-50 flex items-center px-md py-sm">
      {/* Mobile */}
      <div className="md:hidden flex w-full items-center justify-between gap-sm">
        <MobileHamburger />
        <MobileBrand />
        <MobileSearchIcon />
      </div>

      {/* Desktop */}
      <div className="hidden md:flex w-full items-center justify-between gap-md">
        <DesktopSearch />
        <div className="flex items-center gap-sm">
          <AddTaskButton />
          <UserAvatar email={user.email} avatarUrl={user.avatarUrl} />
        </div>
      </div>
    </header>
  );
}
