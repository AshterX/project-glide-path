
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useTaskModal } from './use-task-modal';
import { useKanbanStore } from '../../store/kanbanStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { TaskStatus } from '../../types';
import { getColumnTitle } from '../../lib/utils';

const TaskModal = () => {
  const { isOpen, onClose, data } = useTaskModal();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [titleError, setTitleError] = useState('');
  
  const { tasks, addTask, updateTask } = useKanbanStore();
  const { taskId, projectId, initialStatus } = data;
  
  const isEditMode = !!taskId;
  
  useEffect(() => {
    if (isOpen) {
      // If we're editing an existing task
      if (taskId) {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          setTitle(task.title);
          setDescription(task.description || '');
          setStatus(task.status);
        }
      } else if (initialStatus) {
        // If we're creating a new task with an initial status
        setStatus(initialStatus);
      }
    } else {
      // Reset form when modal closes
      setTitle('');
      setDescription('');
      setStatus('todo');
      setTitleError('');
    }
  }, [isOpen, taskId, tasks, initialStatus]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    if (isEditMode && taskId) {
      updateTask(taskId, { title, description, status });
    } else if (projectId) {
      addTask(projectId, title, description, status);
    }
    
    onClose();
  };
  
  const STATUSES: TaskStatus[] = ['todo', 'inProgress', 'done'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setTitleError('');
                }
              }}
              placeholder="Task title"
              className={titleError ? 'border-destructive' : ''}
            />
            {titleError && <p className="text-destructive text-sm">{titleError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as TaskStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((statusOption) => (
                  <SelectItem key={statusOption} value={statusOption}>
                    {getColumnTitle(statusOption)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Create Task'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
