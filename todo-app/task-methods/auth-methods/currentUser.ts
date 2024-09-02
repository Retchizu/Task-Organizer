import axios from "axios";
import { currentUserUrl } from "../../url";
import * as SecureStore from "expo-secure-store";
import { handleUnauthorizedAccess } from "./handleUnauthorizedAccess";
import { Router } from "expo-router";

export const getCurrentUser = async (router: Router) => {
  const accessToken = SecureStore.getItem("accessToken");
  try {
    const result = await axios.get(currentUserUrl, {
      headers: { Authorization: accessToken },
    });

    return result.data;
  } catch (error) {
    const axiosError = await handleUnauthorizedAccess(error);
    if (axiosError) {
      router.replace("authentication/logIn");
    } else {
      const result = await axios.get(currentUserUrl, {
        headers: { Authorization: accessToken },
      });

      return result.data;
    }
    console.log((error as Error).message);
    return;
  }
};
