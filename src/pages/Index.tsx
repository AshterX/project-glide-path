
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import KanbanBoard from '@/components/kanban/KanbanBoard';
import TaskModal from '@/components/modals/task-modal';
import { useTaskModal } from '@/components/modals/use-task-modal';
import { useKanbanStore } from '@/store/kanbanStore';
import { Plus } from 'lucide-react';

const Index = () => {
  const { onOpen } = useTaskModal();
  const { activeProjectId, projects } = useKanbanStore();
  
  const handleAddTask = () => {
    if (activeProjectId) {
      onOpen({ projectId: activeProjectId });
    }
  };

  return (
    <MainLayout>
      {activeProjectId && (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {projects.find(p => p.id === activeProjectId)?.name}
            </h1>
            <Button onClick={handleAddTask}>
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
          <div className="flex-1 min-h-0">
            <KanbanBoard />
          </div>
          <TaskModal />
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
