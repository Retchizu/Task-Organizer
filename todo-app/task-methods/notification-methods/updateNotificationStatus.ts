import { Router } from "expo-router";
import { handleUnauthorizedAccess } from "../auth-methods/handleUnauthorizedAccess";
import { updateNotificationStatusApi } from "./updateNotificationStatusApi";

export const updateNotificationStatus = async (
  notificationId: String,
  notificationStatus: boolean,
  accessToken: string,
  router: Router
) => {
  try {
    const result = await updateNotificationStatusApi(
      notificationId,
      notificationStatus,
      accessToken
    );

    console.log(result.status, result.data);
  } catch (error) {
    const axiosError = await handleUnauthorizedAccess(error);
    if (axiosError) {
      router.replace("authentication/logIn");
    } else {
      const result = await updateNotificationStatusApi(
        notificationId,
        notificationStatus,
        accessToken
      );

      console.log(result.status, result.data);
      if (result.status === 401) {
        console.log("Session Expired, Log in again");
        router.replace("authentication/logIn");
      }
    }
  }
};
