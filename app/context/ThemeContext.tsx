import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

// Define theme types
export type ThemeType = "light" | "dark";

// Define theme colors interface
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  circleBackground: string;
  cardBackground: string;
  iconBackground: string;
  completedBackground: string;
}

// Define theme context type
interface ThemeContextType {
  theme: ThemeColors;
  themeType: ThemeType;
  isDarkMode: boolean;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Define theme colors for light and dark modes
const lightTheme: ThemeColors = {
  primary: "#3498db",
  primaryLight: "rgba(52, 152, 219, 0.1)",
  background: "#f8f9fa",
  card: "#ffffff",
  text: "#2c3e50",
  textSecondary: "#95a5a6",
  circleBackground: "#e6e6e6",
  cardBackground: "white",
  iconBackground: "#f0f0f0",
  completedBackground: "#91ffaf",
};

const darkTheme: ThemeColors = {
  primary: "#3498db",
  primaryLight: "rgba(52, 152, 219, 0.2)",
  background: "#121212",
  card: "#1e1e1e",
  text: "#ffffff",
  textSecondary: "#a0a0a0",
  circleBackground: "#2c2c2c",
  cardBackground: "#1e1e1e",
  iconBackground: "#2c2c2c",
  completedBackground: "#2a4d38",
};

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>(
    colorScheme === "dark" ? "dark" : "light"
  );

  // Update theme when system theme changes
  useEffect(() => {
    setThemeType(colorScheme === "dark" ? "dark" : "light");
  }, [colorScheme]);

  const theme = themeType === "dark" ? darkTheme : lightTheme;
  const isDarkMode = themeType === "dark";

  return (
    <ThemeContext.Provider value={{ theme, themeType, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
