
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KanbanState, Project, Task, TaskStatus } from '../types';

const STORAGE_KEY = 'kanban-storage';

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      projects: [],
      tasks: [],
      activeProjectId: null,

      addProject: (name) => {
        const newProject: Project = {
          id: crypto.randomUUID(),
          name,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          activeProjectId: state.activeProjectId || newProject.id,
        }));
      },

      renameProject: (id, name) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, name } : project
          ),
        }));
      },

      deleteProject: (id) => {
        const { projects, tasks, activeProjectId } = get();
        
        // Remove all tasks belonging to this project
        const filteredTasks = tasks.filter((task) => task.projectId !== id);
        
        // Find next active project
        let nextActiveProject = activeProjectId;
        if (activeProjectId === id) {
          const remainingProjects = projects.filter((p) => p.id !== id);
          nextActiveProject = remainingProjects.length > 0 ? remainingProjects[0].id : null;
        }

        set({
          projects: projects.filter((project) => project.id !== id),
          tasks: filteredTasks,
          activeProjectId: nextActiveProject,
        });
      },

      setActiveProject: (id) => {
        set({ activeProjectId: id });
      },

      addTask: (projectId, title, description = '', status = 'todo') => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          description,
          status,
          createdAt: new Date().toISOString(),
          projectId,
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      moveTask: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
