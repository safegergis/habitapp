export enum HabitPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

export interface Habit {
  id: number;
  icon: string;
  name: string;
  description: string;
  completed: boolean;
  streak: number;
  priority: HabitPriority;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}
