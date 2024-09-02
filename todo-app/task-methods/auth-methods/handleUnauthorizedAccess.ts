import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { refreshToken } from "./refreshToken";

export const handleUnauthorizedAccess = async (
  error: any
): Promise<boolean> => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      const newAccessToken = await refreshToken();
      console.log("new ", newAccessToken);
      if (newAccessToken === 401 || !newAccessToken) {
        console.log("Sessions Exipred, Log in again");
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        return true;
      }
    }
  }
  return false;
};
