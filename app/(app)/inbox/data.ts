export type Task = {
  id: string;
  title: string;
  dueDate: Date;
  projectName: string;
  priority: 'high' | 'other';
  completed: boolean;
};

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

export async function getInboxTasks(): Promise<Task[]> {
  return [
    {
      id: '1',
      title: 'Finalize Q3 Marketing Budget',
      dueDate: daysFromNow(0),
      projectName: 'Marketing',
      priority: 'high',
      completed: false,
    },
    {
      id: '2',
      title: 'Review Design System Updates',
      dueDate: daysFromNow(1),
      projectName: 'Design',
      priority: 'high',
      completed: false,
    },
    {
      id: '3',
      title: 'Draft Engineering All-Hands Agenda',
      dueDate: daysFromNow(5),
      projectName: 'Engineering',
      priority: 'other',
      completed: false,
    },
    {
      id: '4',
      title: 'Approve Contractor Invoices',
      dueDate: daysFromNow(8),
      projectName: 'Finance',
      priority: 'other',
      completed: false,
    },
  ];
}
