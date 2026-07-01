interface TaskTitleProps {
  id: string;
  title: string;
  completed: boolean;
}

export function TaskTitle({ id, title, completed }: TaskTitleProps) {
  return (
    <label htmlFor={id} className={`font-body-lg text-brand-primary block cursor-pointer ${completed ? 'line-through opacity-50' : ''}`}>
      {title}
    </label>
  );
}
