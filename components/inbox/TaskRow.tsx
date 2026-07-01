'use client';

import { useId, useState } from 'react';
import type { Task } from '@/app/(app)/inbox/data';
import { TaskCheckbox } from './TaskCheckbox';
import { TaskDueDate } from './TaskDueDate';
import { TaskProjectTag } from './TaskProjectTag';
import { TaskTitle } from './TaskTitle';

interface TaskRowProps {
  task: Task;
}

export function TaskRow({ task }: TaskRowProps) {
  const [checked, setChecked] = useState(task.completed);
  const id = useId();

  return (
    <div className="flex items-start gap-sm py-sm px-xs border-b border-brand-outline-variant bg-brand-surface-bright rounded-sm transition-all duration-200 ease hover:bg-brand-surface-container-low hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-px">
      <div className="mt-1">
        <TaskCheckbox id={id} checked={checked} onChange={setChecked} />
      </div>
      <div className="flex-1 flex flex-col gap-xs">
        <TaskTitle id={id} title={task.title} completed={checked} />
        <div className="flex items-center gap-sm">
          <TaskDueDate dueDate={task.dueDate} />
          <TaskProjectTag name={task.projectName} />
        </div>
      </div>
    </div>
  );
}
