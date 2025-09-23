'use client';

import type { Task, TaskStatus } from '@/lib/types';
import { KanbanCard } from './kanban-card';
import { Card, CardHeader, CardTitle } from '../ui/card';

type KanbanColumnProps = {
  title: TaskStatus;
  tasks: Task[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
};

export function KanbanColumn({ title, tasks, onDrop, onDragStart }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Card 
      className="bg-muted/50 h-full flex flex-col"
      onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e, title)}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-normal bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">{tasks.length}</span>
        </CardTitle>
      </CardHeader>
      <div className="flex-1 p-4 pt-0 space-y-4 overflow-y-auto">
        {tasks.map(task => (
          <KanbanCard key={task.id} task={task} onDragStart={onDragStart} />
        ))}
      </div>
    </Card>
  );
}
