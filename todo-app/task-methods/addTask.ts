import axios from "axios";
import { addTaskUrl } from "../url";

export const addTaskApi = async (
  accessToken: string,
  task: {
    taskLabel: string;
    taskDescription: string;
  },
  deadlineDate: Date | null
) => {
  return await axios.post(
    addTaskUrl,
    {
      taskLabel: task.taskLabel,
      taskDescription: task.taskDescription,
      taskDeadline: deadlineDate,
    },
    {
      headers: {
        Authorization: `${accessToken}`,
      },
    }
  );
};
