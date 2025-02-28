import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  useAnimatedValue,
} from "react-native";
import { Habit } from "@/types/habit.interface";
import { useState, useRef } from "react";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/app/context/ThemeContext";

type HabitEntryProps = {
  habit: Habit;
  onComplete: (habitId: number, completed: boolean) => void;
  isCompleted: boolean;
};

export default function HabitEntry({
  habit,
  onComplete,
  isCompleted,
}: HabitEntryProps) {
  const { theme } = useTheme();

  const [tapCount, setTapCount] = useState(0);
  const progressAnim = useAnimatedValue(0);
  const scaleAnim = useAnimatedValue(1);
  const opacityAnim = useAnimatedValue(1);
  const tapTimer = useRef<NodeJS.Timeout>();

  const PRESS_DURATION = 1000;
  const DOUBLE_TAP_DELAY = 300;

  const animateScale = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetProgress = () => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressIn = () => {
    if (isCompleted) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      animateScale();
      setTapCount((prev) => prev + 1);

      if (tapCount === 0) {
        tapTimer.current = setTimeout(() => {
          setTapCount(0);
        }, DOUBLE_TAP_DELAY);
      } else if (tapCount === 1) {
        clearTimeout(tapTimer.current);
        onComplete(habit.id, false);
        setTapCount(0);
        resetProgress();
      }
      return;
    }

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: PRESS_DURATION,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        animateScale();
        onComplete(habit.id, true);
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    });
  };

  const handlePressOut = () => {
    if (!isCompleted) {
      resetProgress();
    }
  };

  const containerStyle = {
    ...styles.container,
    backgroundColor: progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.cardBackground, theme.completedBackground],
    }),
    transform: [{ scale: scaleAnim }],
  };

  const disabledStyle = {
    opacity: opacityAnim,
  };

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        style={styles.habitInsideContainer}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.habitIconContainer,
            disabledStyle,
            { backgroundColor: theme.iconBackground },
          ]}
        >
          <Text style={styles.habitIcon}>{habit.icon}</Text>
        </Animated.View>
        <Animated.View style={[styles.habitTextContainer, disabledStyle]}>
          <View>
            <Text style={[styles.habitNameText, { color: theme.text }]}>
              {habit.name}
            </Text>
          </View>
          <View>
            <Text
              style={[
                styles.habitDescriptionText,
                { color: theme.textSecondary },
              ]}
            >
              {habit.description}
            </Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.habitScoreContainer, disabledStyle]}>
          <Text style={[styles.habitScoreText, { color: theme.textSecondary }]}>
            {habit.score}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  habitInsideContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  habitTextContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  habitIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  habitIcon: {
    fontSize: 40,
  },
  habitNameText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  habitDescriptionText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  habitScoreText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "bold",
    marginTop: 4,
  },
  habitScoreContainer: {
    marginLeft: "auto",
    padding: 4,
    borderRadius: 4,
  },
});
