
import { useDroppable } from '@dnd-kit/core';
import { Button } from '../ui/button';
import { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { useTaskModal } from '../modals/use-task-modal';
import { useKanbanStore } from '../../store/kanbanStore';
import { cn } from '../../lib/utils';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  columnColor: string;
}

const TaskColumn = ({ title, status, tasks, columnColor }: TaskColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });
  
  const { onOpen } = useTaskModal();
  const activeProjectId = useKanbanStore((state) => state.activeProjectId);
  
  const handleAddTask = () => {
    if (activeProjectId) {
      onOpen({ projectId: activeProjectId, initialStatus: status });
    }
  };

  return (
    <div
      className={cn(
        'task-column flex flex-col rounded-lg p-3 h-full',
        columnColor,
        isOver && 'ring-2 ring-primary ring-inset'
      )}
      ref={setNodeRef}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm">
          {title} <span className="text-muted-foreground ml-1">({tasks.length})</span>
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7 rounded-full hover:bg-black/10"
          onClick={handleAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-2 flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
