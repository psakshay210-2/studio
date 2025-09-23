'use client';

import type { Task } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEvents } from '@/contexts/event-context';


type KanbanCardProps = {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
};

export function KanbanCard({ task, onDragStart }: KanbanCardProps) {
  const { events } = useEvents();
  const eventName = events.find(e => e.id === task.eventId)?.name;

  return (
    <div 
      draggable 
      onDragStart={(e) => onDragStart(e, task.id)}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{task.title}</CardTitle>
          <CardDescription>{eventName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{task.description}</p>
          {task.assignee && (
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-muted-foreground">Assigned to</span>
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
