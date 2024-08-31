import axios from "axios";
import { updateTaskUrl } from "../url";
import * as SecureStore from "expo-secure-store";

export const updateTaskStatus = async (status: string, taskSelected: Task) => {
  const accessToken = await SecureStore.getItemAsync("accessToken");
  return axios.put(
    `${updateTaskUrl}/${taskSelected!.id}`,
    { taskStatus: status },
    { headers: { Authorization: `${accessToken}` } }
  );
};
