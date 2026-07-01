interface UserAvatarProps {
  email: string;
  avatarUrl: string | null;
}

function getInitials(email: string): string {
  const [local] = email.split('@');
  if (!local) return '?';
  const parts = local.split(/[._-]/).filter(Boolean);
  const chars = parts.length >= 2 ? `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}` : (local.charAt(0) ?? '');
  return chars.toUpperCase();
}

export function UserAvatar({ email, avatarUrl }: UserAvatarProps) {
  const initials = getInitials(email);

  return (
    <div className="h-8 w-8 rounded-full border border-brand-outline-variant overflow-hidden bg-brand-surface-container-low flex items-center justify-center">
      {avatarUrl ? (
        // biome-ignore lint/performance/noImgElement: avatar URLs come from arbitrary providers; skipping next/image remote config for now
        <img src={avatarUrl} alt="User profile" className="h-full w-full object-cover" />
      ) : (
        <span aria-hidden="true" className="font-label-caps font-medium text-brand-on-surface">
          {initials}
        </span>
      )}
    </div>
  );
}
