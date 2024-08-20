import axios from "axios";

import * as SecureStore from "expo-secure-store";
import { deleteTaskUrl } from "../url";

export const deleteTask = async (id: String) => {
  try {
    const accessToken = SecureStore.getItem("accessToken");

    const result = await axios.delete(`${deleteTaskUrl}/${id}`, {
      headers: {
        Authorization: `${accessToken}`,
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
