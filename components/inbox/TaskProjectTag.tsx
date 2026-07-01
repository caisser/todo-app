interface TaskProjectTagProps {
  name: string;
}

export function TaskProjectTag({ name }: TaskProjectTagProps) {
  return <span className="font-label-caps bg-brand-surface-container-low px-2 py-1 rounded text-brand-secondary">{name}</span>;
}
