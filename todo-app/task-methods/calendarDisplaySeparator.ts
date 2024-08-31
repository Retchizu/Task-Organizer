import { Platform } from "react-native";

export const calendarDisplaySeparator = (
  mode: "date" | "time"
): "calendar" | "clock" | "spinner" | undefined => {
  switch (true) {
    case mode === "date" && Platform.OS === "android":
      return "calendar";
    case mode === "time" && Platform.OS === "android":
      return "clock";
    case mode === "date" || (mode === "time" && Platform.OS === "ios"):
      return "spinner";
  }
};
