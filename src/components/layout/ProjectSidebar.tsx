
import { useState } from 'react';
import { useKanbanStore } from '../../store/kanbanStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { formatDate } from '../../lib/utils';
import { 
  Plus, 
  Edit, 
  Trash2,
  X,
  Check,
  FolderPlus
} from 'lucide-react';
import { cn } from '../../lib/utils';

const ProjectSidebar = () => {
  const { 
    projects, 
    activeProjectId,
    addProject, 
    renameProject, 
    deleteProject, 
    setActiveProject 
  } = useKanbanStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName('');
      setIsCreating(false);
    }
  };

  const handleRenameProject = (id: string) => {
    if (editName.trim()) {
      renameProject(id, editName.trim());
      setEditingId(null);
    }
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  return (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold flex items-center">
          <span className="text-primary">Projects</span>
        </h2>
      </div>
      
      <div className="flex-1 overflow-auto p-3">
        {projects.length === 0 && !isCreating && (
          <div className="text-center py-8 text-muted-foreground">
            <FolderPlus className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
            <p>No projects yet</p>
            <p className="text-sm">Create your first project to get started</p>
          </div>
        )}
        
        <ul className="space-y-1">
          {projects.map((project) => (
            <li key={project.id} className="relative">
              {editingId === project.id ? (
                <div className="flex items-center space-x-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRenameProject(project.id)}
                    autoFocus
                    className="h-8 text-sm py-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRenameProject(project.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setEditingId(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className={cn(
                    "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium",
                    project.id === activeProjectId
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-slate-200 text-foreground"
                  )}
                >
                  <button
                    className="flex-1 text-left truncate"
                    onClick={() => setActiveProject(project.id)}
                  >
                    {project.name}
                  </button>
                  <div className={cn(
                    "flex items-center space-x-1",
                    project.id === activeProjectId ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <Button
                      variant={project.id === activeProjectId ? "secondary" : "ghost"}
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(project.id, project.name);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant={project.id === activeProjectId ? "secondary" : "ghost"}
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-slate-200">
        {isCreating ? (
          <div className="space-y-2">
            <Input
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              autoFocus
              className="h-9 text-sm"
            />
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="w-full text-xs"
                onClick={handleCreateProject}
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-xs"
                onClick={() => {
                  setIsCreating(false);
                  setNewProjectName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectSidebar;
