
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskStatus } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

export const getColumnTitle = (status: TaskStatus): string => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'inProgress':
      return 'In Progress';
    case 'done':
      return 'Done';
    default:
      return 'Unknown';
  }
};

export const getColumnColor = (status: TaskStatus): string => {
  switch (status) {
    case 'todo':
      return 'bg-slate-100';
    case 'inProgress':
      return 'bg-blue-50';
    case 'done':
      return 'bg-green-50';
    default:
      return 'bg-slate-100';
  }
};
