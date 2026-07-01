interface GroupLabelProps {
  icon: string;
  label: string;
}

export function GroupLabel({ icon, label }: GroupLabelProps) {
  return (
    <h3 className="flex items-center gap-xs mb-sm px-xs font-label-caps text-brand-secondary uppercase">
      <span
        aria-hidden="true"
        className="material-symbols-outlined"
        style={{ fontSize: '16px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
      >
        {icon}
      </span>
      {label}
    </h3>
  );
}
