'use client';

import { useState, useEffect } from 'react';
import type { Task, TaskStatus } from '@/lib/types';
import { KanbanColumn } from './kanban-column';

type KanbanBoardProps = {
  initialTasks: Task[];
};

export function KanbanBoard({ initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Record<TaskStatus, Task[]>>({
    'To Do': [],
    'In Progress': [],
    'Done': [],
  });

  useEffect(() => {
    const categorizedTasks: Record<TaskStatus, Task[]> = {
      'To Do': [],
      'In Progress': [],
      'Done': [],
    };
    initialTasks.forEach(task => {
      categorizedTasks[task.status].push(task);
    });
    setTasks(categorizedTasks);
  }, [initialTasks]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      let taskToMove: Task | undefined;
      let originalStatus: TaskStatus | undefined;

      // Find and remove task from its original column
      for (const status in newTasks) {
        const foundIndex = newTasks[status as TaskStatus].findIndex(t => t.id === taskId);
        if (foundIndex > -1) {
          taskToMove = newTasks[status as TaskStatus][foundIndex];
          originalStatus = status as TaskStatus;
          newTasks[status as TaskStatus].splice(foundIndex, 1);
          break;
        }
      }

      // Add task to the new column
      if (taskToMove && originalStatus) {
        taskToMove.status = newStatus;
        newTasks[newStatus].push(taskToMove);
      }
      
      return newTasks;
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 h-full items-start">
      <KanbanColumn 
        title="To Do" 
        tasks={tasks['To Do']} 
        onDrop={handleDrop} 
        onDragStart={handleDragStart} 
      />
      <KanbanColumn 
        title="In Progress" 
        tasks={tasks['In Progress']} 
        onDrop={handleDrop} 
        onDragStart={handleDragStart} 
      />
      <KanbanColumn 
        title="Done" 
        tasks={tasks['Done']} 
        onDrop={handleDrop} 
        onDragStart={handleDragStart} 
      />
    </div>
  );
}
