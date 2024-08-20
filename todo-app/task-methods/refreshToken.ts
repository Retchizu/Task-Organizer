import axios from "axios";
import { refreshTokenUrl } from "../url";
import * as SecureStore from "expo-secure-store";

export const refreshToken = async (): Promise<any> => {
  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!refreshToken) {
      return;
    }

    const response = await axios.post(refreshTokenUrl, {
      refreshToken: refreshToken,
    });

    SecureStore.setItem("accessToken", response.data.newAccessToken);
    SecureStore.setItem("refreshToken", response.data.newRefreshToken);

    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    return error as Error;
  }
};
