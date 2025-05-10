
import { useMemo } from 'react';
import { useKanbanStore } from '../../store/kanbanStore';
import { getColumnTitle, getColumnColor } from '../../lib/utils';
import TaskColumn from './TaskColumn';
import { TaskStatus } from '../../types';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useState } from 'react';
import TaskCard from './TaskCard';

const COLUMN_STATUSES: TaskStatus[] = ['todo', 'inProgress', 'done'];

const KanbanBoard = () => {
  const { tasks, activeProjectId, projects, moveTask } = useKanbanStore();
  const [activeTask, setActiveTask] = useState<string | null>(null);
  
  const activeProject = useMemo(() => {
    return projects.find(project => project.id === activeProjectId);
  }, [projects, activeProjectId]);
  
  const projectTasks = useMemo(() => {
    return tasks.filter((task) => task.projectId === activeProjectId);
  }, [tasks, activeProjectId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveTask(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const taskId = active.id as string;
    const columnId = over.id as TaskStatus;
    
    // Update the task's status in the store
    if (columnId && COLUMN_STATUSES.includes(columnId)) {
      moveTask(taskId, columnId);
    }
    
    setActiveTask(null);
  };

  const draggedTask = activeTask ? tasks.find(task => task.id === activeTask) : null;
  
  if (!activeProjectId || !activeProject) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6">{activeProject.name}</h1>
      
      <div className="flex-1 min-h-0">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
            {COLUMN_STATUSES.map((status) => (
              <TaskColumn
                key={status}
                status={status}
                title={getColumnTitle(status)}
                columnColor={getColumnColor(status)}
                tasks={projectTasks.filter((task) => task.status === status)}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeTask && draggedTask ? (
              <div className="w-[calc(100%-2rem)] md:w-64">
                <TaskCard task={draggedTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
