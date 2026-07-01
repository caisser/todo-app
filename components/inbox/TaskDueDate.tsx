interface TaskDueDateProps {
  dueDate: Date;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDueDate(date: Date, today: Date): string {
  if (isSameDay(date, today)) return 'Today';
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (isSameDay(date, tomorrow)) return 'Tomorrow';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function TaskDueDate({ dueDate }: TaskDueDateProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueToday = isSameDay(dueDate, today);
  const label = formatDueDate(dueDate, today);

  return (
    <span className={`inline-flex items-center gap-1 font-body-md ${dueToday ? 'text-brand-error' : 'text-brand-secondary'}`}>
      <span
        aria-hidden="true"
        className="material-symbols-outlined"
        style={{ fontSize: '14px', fontVariationSettings: "'FILL' 0, 'wght' 300" }}
      >
        event
      </span>
      {label}
    </span>
  );
}
