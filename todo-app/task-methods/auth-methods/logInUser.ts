import axios from "axios";
import { currentUserUrl, logInUrl } from "../../url";
import * as SecureStore from "expo-secure-store";

export const logInUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(logInUrl, {
      email,
      password,
    });
    SecureStore.setItem("accessToken", response.data.accessToken);
    SecureStore.setItem("refreshToken", response.data.refreshToken);

    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    return 500;
  }
};

export const getUser = async () => {
  try {
    const accessToken = SecureStore.getItem("accessToken");
    const response = await axios.get(currentUserUrl, {
      headers: {
        Authorization: `${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    return 500;
  }
};
