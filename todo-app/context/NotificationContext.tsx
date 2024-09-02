import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import { storeNotification } from "../task-methods/notification-methods/storeNotification";
import { useRouter } from "expo-router";
import { getCurrentUser } from "../task-methods/auth-methods/currentUser";

type NotificationContextValue = {
  expoPushToken: string;
  schedulePushNotification: (task: Task) => Promise<void>;
  notificationList: TaskNotification[];
  setNotificationList: React.Dispatch<React.SetStateAction<TaskNotification[]>>;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notificationList, setNotificationList] = useState<TaskNotification[]>(
    []
  );
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const router = useRouter();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const registerForPushNotificationAsync = async () => {
    let token;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "task-notification",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      try {
        const projectId =
          Constants?.expoConfig?.extra?.eas.projectId ??
          Constants?.easConfig?.projectId;
        if (projectId) {
          token = (
            await Notifications.getExpoPushTokenAsync({
              projectId,
            })
          ).data;
          console.log("token", token);
        }
      } catch (error) {
        token = `${error}`;
      }
    } else {
      console.log("Must use physical device for Push Notifications");
    }
    return token;
  };

  const schedulePushNotification = async (task: Task) => {
    const now = new Date().getTime();
    const taskDeadline = new Date(task.taskDeadline).getTime();
    const taskMidPoint = now + (taskDeadline - now) / 2;

    if (taskMidPoint > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder!",
          body: `${task.taskLabel} is halfway to its deadline`,
          data: { task: task },
        },
        trigger: { seconds: (taskMidPoint - now) / 1000 },
      });
    }
  };

  useEffect(() => {
    registerForPushNotificationAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        console.log(
          "Notification received:",
          notification.request.content.data
        );
        const user = await getCurrentUser(router);
        const task: Task = notification.request.content.data.task;
        if (user) {
          const result = await storeNotification(
            user.id,
            task.id.toString(),
            "Upcoming deadline!",
            router
          );
          setNotificationList((prev) => [
            ...prev,
            {
              _id: result._id,
              userId: result.userId,
              isRead: result.isRead,
              notificationMessage: result.notificationMessage,
              task: {
                id: task.id,
                userId: task.userId,
                taskLabel: task.taskLabel,
                taskDescription: task.taskDescription,
                taskStatus: task.taskStatus,
                taskDeadline: new Date(task.taskDeadline),
              },
            },
          ]);
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log("Notification response:", response.notification);
          const user = await getCurrentUser(router);

          const task: Task = response.notification.request.content.data.task; // returned as null when clicked outside the app, fix later
          if (user) {
            const result = await storeNotification(
              user.id,
              task.id.toString(),
              "Upcoming deadline!",
              router
            );

            setNotificationList((prev) => [
              ...prev,
              {
                _id: result._id,
                userId: result.userId,
                isRead: result.isRead,
                notificationMessage: result.notificationMessage,
                task: {
                  id: task.id,
                  userId: task.userId,
                  taskLabel: task.taskLabel,
                  taskDescription: task.taskDescription,
                  taskStatus: task.taskStatus,
                  taskDeadline: new Date(task.taskDeadline),
                },
              },
            ]);
          }
        }
      );

    return () => {
      if (notificationListener.current && responseListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);

        console.log("notification listener removed");
      }
    };
  }, [router]);

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        schedulePushNotification,
        notificationList,
        setNotificationList,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifcationContext = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "NotifcationContext must be used within the NotificationProvider"
    );
  }
  return context;
};
