import { handleUnauthorizedAccess } from "../auth-methods/handleUnauthorizedAccess";
import { Router } from "expo-router";
import { storeNotificationApi } from "./storeNotificationApi";
import * as SecureStore from "expo-secure-store";
import { AxiosResponse } from "axios";
import { useUserContext } from "../../context/UserContext";

export const storeNotification = async (
  userId: string,
  taskId: string,
  notificationMessage: string,
  router: Router
) => {
  try {
    const accessToken = SecureStore.getItem("accessToken");

    let result: AxiosResponse | null = null;
    if (accessToken) {
      result = await storeNotificationApi(
        userId,
        taskId,
        notificationMessage,
        false,
        accessToken
      );
    } else {
      router.replace("authentication/logIn");
    }

    if (result?.status === 201) {
      console.log("notifications stored successfully", result.data);
      return result?.data;
    }
  } catch (error) {
    const axiosError = await handleUnauthorizedAccess(error);
    if (axiosError) {
      router.replace("authentication/logIn");
    } else {
      const accessToken = SecureStore.getItem("accessToken");
      let result: AxiosResponse | null = null;
      if (accessToken) {
        result = await storeNotificationApi(
          userId,
          taskId,
          notificationMessage,
          false,
          accessToken
        );
      } else {
        router.replace("authentication/logIn");
      }
      if (result?.status === 201) {
        console.log("notifications stored successfully", result.data);
        return result.data;
      } else {
        console.log((error as Error).message);
      }
    }
  }
};
