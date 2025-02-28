import { useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  useAnimatedValue,
  Text,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "@/app/context/ThemeContext";

interface HabitCircleProps {
  progress: number; // Value between 0-100 representing percentage of habits completed
  size?: number;
  strokeWidth?: number;
  circleColor?: string;
  progressColor?: string;
}

export default function HabitCircle({
  progress = 0,
  size = 200,
  strokeWidth = 15,
  circleColor,
  progressColor,
}: HabitCircleProps) {
  const { theme } = useTheme();

  // Use provided colors or fallback to theme colors
  const finalCircleColor = circleColor || theme.circleBackground;
  const finalProgressColor = progressColor || theme.primary;

  // Animation value
  const animatedValue = useAnimatedValue(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  // Calculate the stroke-dashoffset based on progress
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  // Animate when progress changes
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  // Convert Animated.Value to AnimatedComponent for SVG
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={finalCircleColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={finalProgressColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.textContainer}>
        <Text style={[styles.progressText, { color: theme.text }]}>
          {Math.round(progress)}%
        </Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Completed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    color: "#666",
  },
});
