
import { create } from 'zustand';
import { TaskStatus } from '../../types';

interface TaskModalData {
  taskId?: string;
  projectId?: string;
  initialStatus?: TaskStatus;
}

interface TaskModalStore {
  isOpen: boolean;
  data: TaskModalData;
  onOpen: (data: TaskModalData) => void;
  onClose: () => void;
}

export const useTaskModal = create<TaskModalStore>((set) => ({
  isOpen: false,
  data: {},
  onOpen: (data) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: {} }),
}));
