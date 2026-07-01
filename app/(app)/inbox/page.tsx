import { InboxCanvas } from '@/components/inbox/InboxCanvas';
import { PageHeader } from '@/components/inbox/PageHeader';
import { TaskGroup } from '@/components/inbox/TaskGroup';
import { getInboxTasks } from './data';

export default async function InboxPage() {
  const tasks = await getInboxTasks();
  const highPriority = tasks.filter((t) => t.priority === 'high');
  const otherTasks = tasks.filter((t) => t.priority === 'other');

  return (
    <InboxCanvas>
      <PageHeader />
      <TaskGroup label="High Priority" icon="flag" tasks={highPriority} />
      <TaskGroup label="Other Tasks" icon="reorder" tasks={otherTasks} />
    </InboxCanvas>
  );
}
