import { Stack } from "expo-router";
import { ThemeProvider } from "@/app/context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: true }} />
    </ThemeProvider>
  );
}
