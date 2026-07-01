import type { Task } from '@/app/(app)/inbox/data';
import { GroupLabel } from './GroupLabel';
import { TaskList } from './TaskList';
import { TaskRow } from './TaskRow';

interface TaskGroupProps {
  label: string;
  icon: string;
  tasks: Task[];
}

export function TaskGroup({ label, icon, tasks }: TaskGroupProps) {
  return (
    <section className="mb-xl">
      <GroupLabel icon={icon} label={label} />
      <TaskList>
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </TaskList>
    </section>
  );
}
