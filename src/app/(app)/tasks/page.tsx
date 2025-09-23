import { PageHeader } from "@/components/page-header";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { MOCK_TASKS } from "@/lib/data";

export default function TasksPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Tasks" description="Manage your team's tasks with the Kanban board." />
      <div className="flex-1 mt-8">
        <KanbanBoard initialTasks={MOCK_TASKS} />
      </div>
    </div>
  );
}
