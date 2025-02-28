import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import HabitEntry from "@/components/HabitEntry";
import { Habit, HabitPriority } from "@/types/habit.interface";
import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState, useEffect } from "react";
import HabitCircle from "@/components/HabitCircle";
import {
  calculateHabitScores,
  calculateOverallProgress,
} from "@/utils/habitCalculations";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/app/context/ThemeContext";

export default function Index() {
  const { theme } = useTheme();

  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: "Habit 1",
      icon: "🔥",
      description: "Habit 1 description",
      completed: false,
      streak: 0,
      priority: HabitPriority.LOW,
      score: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Habit 2",
      icon: "🔥",
      description: "Habit 2 description",
      completed: false,
      streak: 0,
      priority: HabitPriority.MEDIUM,
      score: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const [habitCircleProgress, setHabitCircleProgress] = useState(0);

  useEffect(() => {
    const scoredHabits = calculateHabitScores(habits);
    setHabits(scoredHabits);
  }, []);

  const handleHabitComplete = (habitId: number, completed: boolean) => {
    const updatedHabits = habits.map((habit) =>
      habit.id === habitId ? { ...habit, completed } : habit
    );
    setHabits(updatedHabits);
    setHabitCircleProgress(calculateOverallProgress(updatedHabits));
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Daily Habits",
          headerTitleStyle: {
            fontSize: 26,
            fontWeight: "bold",
            color: theme.primary,
          },
          headerRight: () => (
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: theme.primaryLight },
              ]}
              onPress={() => {
                /* Add new habit functionality */
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Plus size={24} color={theme.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.circleContainer}>
          <HabitCircle
            progress={habitCircleProgress}
            size={220}
            strokeWidth={18}
            progressColor={theme.primary}
            circleColor={theme.circleBackground}
          />
        </View>

        <View style={[styles.habitsContainer, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your Habits
          </Text>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text
                style={[styles.emptyStateText, { color: theme.textSecondary }]}
              >
                No habits yet. Add your first habit!
              </Text>
            </View>
          ) : (
            <FlatList
              data={habits}
              renderItem={({ item }) => (
                <HabitEntry
                  habit={item}
                  onComplete={handleHabitComplete}
                  isCompleted={item.completed}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.habitsList}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: 16,
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
  },
  circleContainer: {
    width: "100%",
    height: 280,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 20,
  },
  habitsContainer: {
    flex: 1,
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 25,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  habitsList: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
  },
});
