import { Router } from "expo-router";
import { deleteTask } from "./deleteTask";
import { refreshToken } from "./refreshToken";
import * as SecureStore from "expo-secure-store";
import { updateTaskStatus } from "./updateTaskStatus";
import axios from "axios";

export const toggleEditTaskModal = (
  toggleVisibility: () => void,
  toggleUpdateVisible: () => void
) => {
  toggleVisibility();
  setTimeout(() => toggleUpdateVisible(), 1000);
};
export const deleteTaskFromList = async (
  taskSelected: Task,
  router: Router,
  close: () => void
) => {
  const response = await deleteTask(taskSelected!.id);

  if (response === 500) {
    console.log("Something went wrong, try again later");
  }

  if (response === 401) {
    const newAccessToken = await refreshToken();
    if (newAccessToken === 200) {
      await deleteTask(taskSelected!.id);
      console.log("Deleted Successfully");
      close();
    }
    if (newAccessToken === 401) {
      console.log("Sessions Exipred, Log in again");
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      router.replace("authentication/logIn");
    }
  }
  if (response == 200) {
    console.log("Deleted Successfully");
    close();
  }
};

export const setTaskToFinished = async (
  taskSelected: Task,
  updateTask: (taskId: String, attribute: Partial<Task>) => void,
  router: Router,
  close: () => void
) => {
  if (taskSelected) {
    try {
      const response = await updateTaskStatus("finished", taskSelected);

      if (response.status === 201) {
        updateTask(taskSelected.id, {
          taskStatus: "finished",
        });
        console.log(`${taskSelected.taskLabel}, marked as done`);
        close();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          const newAccessToken = await refreshToken();

          if (taskSelected && newAccessToken === 200) {
            const response = await updateTaskStatus("finished", taskSelected);
            if (response?.status === 201) {
              updateTask(taskSelected.id, {
                taskStatus: "finished",
              });

              close();
              console.log(
                response.status,
                `${taskSelected.taskLabel}, marked as done in error`
              );
            }
          } else {
            console.log("Session expired, please log in again.");
            await SecureStore.deleteItemAsync("accessToken");
            await SecureStore.deleteItemAsync("refreshToken");
            router.replace("authentication/logIn");
            return;
          }
        }
      }
      console.log((error as Error).message);
      console.log("Session expired, please log in again.");
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      router.replace("authentication/logIn");
    }
  }
};

export const setTaskToOngoing = async (
  taskSelected: Task,
  updateTask: (taskId: String, attribute: Partial<Task>) => void,
  router: Router,
  close: () => void
) => {
  try {
    if (taskSelected) {
      const response = await updateTaskStatus("ongoing", taskSelected);
      if (response.status === 201) {
        updateTask(taskSelected?.id, {
          taskStatus: "ongoing",
        });
      }
      console.log(`${taskSelected.taskLabel} moved to ongoing`);
      close();
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        const newAccessToken = await refreshToken();

        if (taskSelected && newAccessToken === 200) {
          const response = await updateTaskStatus("ongoing", taskSelected);
          if (response?.status === 201) {
            updateTask(taskSelected.id, {
              taskStatus: "ongoing",
            });

            close();
            console.log(
              response.status,
              `${taskSelected.taskLabel}, moved to ongoing in error`
            );
          }
        } else {
          console.log("Session expired, please log in again.");
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          router.replace("authentication/logIn");
          return;
        }
      }
    }
    console.log((error as Error).message);
    console.log("Session expired, please log in again.");
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    router.replace("authentication/logIn");
  }
};
