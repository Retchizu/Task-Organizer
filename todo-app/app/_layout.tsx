import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { TaskProvider } from "../context/TaskContext";
import { UserProvider } from "../context/UserContext";
import { AddTaskModalProvider } from "../context/AddTaskModalContext";
import { NotificationModalProvider } from "../context/NotificationModalContext";
import { NotificationProvider } from "../context/NotificationContext";
import NotificationModal from "../components/NotificationModal";

const Layout = () => {
  const [loaded] = useFonts({
    "Inconsolata-Medium": require("../assets/fonts/Inconsolata-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <NotificationProvider>
        <NotificationModalProvider>
          <AddTaskModalProvider>
            <TaskProvider>
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: "#393E46",
                  },
                  headerShown: true,
                  headerTitleStyle: {
                    color: "white",
                    fontFamily: "Inconsolata-Medium",
                  },

                  headerBackVisible: false,
                }}
              >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen
                  name="authentication/logIn"
                  options={{ title: "Log In" }}
                />
                <Stack.Screen
                  name="authentication/signUp"
                  options={{ title: "Sign Up" }}
                />
                <Stack.Screen
                  name="(drawer)"
                  options={{ headerShown: false }}
                />
              </Stack>
              <NotificationModal />
            </TaskProvider>
          </AddTaskModalProvider>
        </NotificationModalProvider>
      </NotificationProvider>
    </UserProvider>
  );
};

export default Layout;
