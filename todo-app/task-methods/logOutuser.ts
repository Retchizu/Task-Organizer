import axios from "axios";
import { logOutUrl } from "../url";
import * as SecureStore from "expo-secure-store";

export const logOutUser = async () => {
  try {
    const result = await axios.get(logOutUrl, {
      headers: {
        Authorization: `${SecureStore.getItem("accessToken")}`,
      },
    });

    return result.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    return 500;
  }
};
