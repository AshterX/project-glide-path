
import { ReactNode } from 'react';
import ProjectSidebar from './ProjectSidebar';
import { useKanbanStore } from '../../store/kanbanStore';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { projects, activeProjectId } = useKanbanStore();
  
  return (
    <div className="flex h-screen overflow-hidden">
      <ProjectSidebar />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {projects.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-semibold mb-2">No projects yet</h2>
              <p className="text-muted-foreground mb-6">
                Create a new project to get started with your kanban board.
              </p>
            </div>
          </div>
        ) : !activeProjectId ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-semibold mb-2">Select a project</h2>
              <p className="text-muted-foreground mb-6">
                Choose a project from the sidebar or create a new one.
              </p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};

export default MainLayout;
