import axios from "axios";
import { updateTaskUrl } from "../url";
import * as SecureStore from "expo-secure-store";

export const updateTaskApi = async (
  id: String,
  task: {
    taskLabel: string;
    taskDescription: string;
  },
  deadlineDate: Date,
  taskStatus?: string
) => {
  const accessToken = SecureStore.getItem("accessToken");
  return await axios.put(
    `${updateTaskUrl}/${id}`,
    {
      taskLabel: task.taskLabel,
      taskDescription: task.taskDescription,
      taskDeadline: deadlineDate,
      taskStatus: taskStatus,
    },
    {
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );
};
