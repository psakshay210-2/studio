'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { MOCK_TASKS } from '@/lib/data';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreateTaskDialog } from '@/components/kanban/create-task-dialog';
import { useRole } from '@/contexts/role-context';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [isCreateTaskOpen, setCreateTaskOpen] = useState(false);
  const { role } = useRole();

  const handleAddTask = (newTask: Omit<Task, 'id' | 'status' | 'assignee'>) => {
    const taskToAdd: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      status: 'To Do',
    };
    setTasks((prevTasks) => [...prevTasks, taskToAdd]);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Tasks"
        description="Manage your team's tasks with the Kanban board."
      >
        {role === 'Organizer' && (
          <Button onClick={() => setCreateTaskOpen(true)}>
            <PlusCircle />
            Add Task
          </Button>
        )}
      </PageHeader>
      <div className="flex-1 mt-8">
        <KanbanBoard initialTasks={tasks} />
      </div>
      <CreateTaskDialog
        isOpen={isCreateTaskOpen}
        onOpenChange={setCreateTaskOpen}
        onTaskCreate={handleAddTask}
      />
    </div>
  );
}
