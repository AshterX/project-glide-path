
import { useDraggable } from '@dnd-kit/core';
import { Task } from '../../types';
import { Card, CardContent, CardHeader } from '../ui/card';
import { formatDate } from '../../lib/utils';
import { Button } from '../ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useTaskModal } from '../modals/use-task-modal';
import { useKanbanStore } from '../../store/kanbanStore';
import { cn } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });
  
  const { onOpen } = useTaskModal();
  const deleteTask = useKanbanStore((state) => state.deleteTask);
  
  const handleEdit = () => {
    onOpen({ taskId: task.id });
  };
  
  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <div 
      className={cn(
        "task-card touch-none", 
        isDragging && "opacity-50"
      )}
    >
      <Card 
        className="cursor-grab active:cursor-grabbing"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
      >
        <CardHeader className="p-3 pb-0">
          <div className="text-sm font-medium">{task.title}</div>
        </CardHeader>
        
        {task.description && (
          <CardContent className="p-3 pt-1">
            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          </CardContent>
        )}
        
        <div className="p-3 pt-0 flex items-center justify-between text-xs text-muted-foreground">
          <div>Created {formatDate(task.createdAt)}</div>
          
          <div className="opacity-0 group-hover:opacity-100 flex">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskCard;
