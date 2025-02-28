import { Habit, HabitPriority } from "@/types/habit.interface";

// Priority weights
export const PRIORITY_WEIGHTS = {
  [HabitPriority.LOW]: 1,
  [HabitPriority.MEDIUM]: 2,
  [HabitPriority.HIGH]: 3,
};

/**
 * Calculate scores for each habit based on priority weights
 */
export const calculateHabitScores = (habits: Habit[]): Habit[] => {
  // Calculate total weight
  const totalWeight = habits.reduce(
    (sum, habit) => sum + PRIORITY_WEIGHTS[habit.priority],
    0
  );

  // Prevent division by zero
  if (totalWeight === 0) return habits;

  // Calculate score for each habit
  return habits.map((habit) => ({
    ...habit,
    score: Math.round((PRIORITY_WEIGHTS[habit.priority] / totalWeight) * 100),
  }));
};

/**
 * Calculate overall progress based on completed habits
 */
export const calculateOverallProgress = (habits: Habit[]): number => {
  if (habits.length === 0) return 0;

  let score = 0;
  for (const habit of habits) {
    if (habit.completed) {
      score += habit.score || 0;
    }
  }
  return score;
};

// When you add Supabase, you can add database-related functions here:
/*
export async function updateHabitInSupabase(
  habitId: number, 
  completed: boolean
): Promise<void> {
  // Supabase update logic will go here
}
*/
