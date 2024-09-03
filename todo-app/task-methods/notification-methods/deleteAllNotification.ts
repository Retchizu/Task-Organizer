import { Router } from "expo-router";
import { handleUnauthorizedAccess } from "../auth-methods/handleUnauthorizedAccess";
import { deleteAllNotificationApi } from "./deleteAllNotificationApi";

export const deleteAllNotification = async (
  accessToken: string,
  router: Router
) => {
  try {
    const result = await deleteAllNotificationApi(accessToken);

    console.log("notification deleted successfully", result.status);
  } catch (error) {
    const axiosError = await handleUnauthorizedAccess(error);
    if (axiosError) {
      router.replace("authentication/logIn");
    } else {
      const result = await deleteAllNotificationApi(accessToken);

      console.log("notification deleted successfully in error", result.status);
      if (result.status === 401) {
        console.log("Session Expired, Log in again");
        router.replace("authentication/logIn");
      }
    }
  }
};
