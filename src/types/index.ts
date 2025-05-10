
export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string; // ISO string
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string; // ISO string
}

export interface KanbanState {
  projects: Project[];
  tasks: Task[];
  activeProjectId: string | null;
  
  // Project actions
  addProject: (name: string) => void;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string) => void;
  
  // Task actions
  addTask: (projectId: string, title: string, description?: string, status?: TaskStatus) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus) => void;
}
