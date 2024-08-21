import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Entypo from "@expo/vector-icons/Entypo";
import { deleteTask } from "../task-methods/deleteTask";
import { useTaskContext } from "../context/TaskContext";
import axios, { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { refreshToken } from "../task-methods/refreshToken";
import {
  readableDateDay,
  readableDateTime,
} from "../task-methods/readableDate";
import isOnGoing from "../task-methods/isOnGoing";
import { useAddTaskModalContext } from "../context/AddTaskModalContext";
import { updateTaskUrl } from "../url";

type TaskModalProp = {
  isTaskModalVisible: boolean;
  toggleVisibility: () => void;
  taskSelected: Task | null;
  screenName: string;
};

const TaskModal: React.FC<TaskModalProp> = ({
  isTaskModalVisible,
  toggleVisibility,
  taskSelected,
  screenName,
}) => {
  const { tasks, setTaskList, updateTask } = useTaskContext();
  const { toggleUpdate } = useAddTaskModalContext();
  const router = useRouter();

  const taskSettingsChoices = [
    {
      id: 0,
      settingName: "Edit Task",
    },
    {
      id: 1,
      settingName: "Delete Task",
    },
    {
      id: 2,
      settingName: "Finish Task",
    },
    {
      id: 3,
      settingName: "Undo Task",
    },
  ];

  const iconSeparator = (taskSettingChoice: {
    id: number;
    settingName: string;
  }) => {
    switch (taskSettingChoice.id) {
      case 0:
        return (
          <Entypo
            name="pencil"
            size={24}
            color="black"
            style={styles.iconSetting}
          />
        );
      case 1:
        return (
          <Entypo
            name="cog"
            size={24}
            color="black"
            style={styles.iconSetting}
          />
        );
      case 2:
        return (
          <Entypo
            name="flag"
            size={24}
            color="black"
            style={styles.iconSetting}
          />
        );
      case 3:
        return (
          <Entypo
            name="back"
            size={24}
            color="black"
            style={styles.iconSetting}
          />
        );
      default:
        return null;
    }
  };
  const filterTaskListAndClose = () => {
    setTaskList(tasks.filter((item) => item.id !== taskSelected!.id));
    toggleVisibility();
  };

  const methodSeparator = (taskSettingChoice: {
    id: number;
    settingName: string;
  }) => {
    switch (taskSettingChoice.id) {
      case 0:
        return () => {
          toggleVisibility();
          toggleUpdate();
        };
      case 1:
        return async () => {
          const response = await deleteTask(taskSelected!.id);

          if (response === 500) {
            console.log("Something went wrong, try again later");
          }

          if (response === 401) {
            const newAccessToken = await refreshToken();
            if (newAccessToken === 200) {
              await deleteTask(taskSelected!.id);
              console.log("Deleted Successfully");
              filterTaskListAndClose();
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
            filterTaskListAndClose();
          }
        };
      case 2:
        return taskSelected?.taskStatus === "finished"
          ? () => {}
          : async () => {
              if (taskSelected) {
                const accessToken = SecureStore.getItem("accessToken");
                try {
                  const response = await axios.put(
                    `${updateTaskUrl}/${taskSelected.id}`,
                    {
                      taskStatus: "finished",
                    },
                    {
                      headers: {
                        Authorization: `${accessToken}`,
                      },
                    }
                  );

                  if (response.status === 201) {
                    updateTask(taskSelected.id, {
                      taskStatus: "finished",
                    });
                    console.log(`${taskSelected.taskLabel}, marked as done`);
                    filterTaskListAndClose();
                  }
                } catch (error) {
                  if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                      const newAccessToken = await refreshToken();

                      if (taskSelected && newAccessToken === 200) {
                        const response = await axios.put(
                          `${updateTaskUrl}/${taskSelected.id}`,
                          {
                            taskStatus: "finished",
                          },
                          {
                            headers: {
                              Authorization: `${newAccessToken}`,
                            },
                          }
                        );
                        if (response?.status === 201) {
                          updateTask(taskSelected.id, {
                            taskStatus: "finished",
                          });

                          filterTaskListAndClose();
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
      case 3:
        return async () => {
          try {
            if (taskSelected) {
              const accessToken = SecureStore.getItem("accessToken");
              const response = await axios.put(
                `${updateTaskUrl}/${taskSelected?.id}`,
                {
                  taskStatus: "ongoing",
                },
                {
                  headers: {
                    Authorization: `${accessToken}`,
                  },
                }
              );
              if (response.status === 201) {
                updateTask(taskSelected?.id, {
                  taskStatus: "ongoing",
                });
              }
              console.log(`${taskSelected.taskStatus} moved to ongoing`);
              filterTaskListAndClose();
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 401) {
                const newAccessToken = await refreshToken();

                if (taskSelected && newAccessToken === 200) {
                  const response = await axios.put(
                    `${updateTaskUrl}/${taskSelected.id}`,
                    {
                      taskStatus: "ongoing",
                    },
                    {
                      headers: {
                        Authorization: `${newAccessToken}`,
                      },
                    }
                  );
                  if (response?.status === 201) {
                    updateTask(taskSelected.id, {
                      taskStatus: "finished",
                    });

                    filterTaskListAndClose();
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
    }
  };

  console.log(taskSelected);
  return (
    <View>
      <Modal
        isVisible={isTaskModalVisible}
        onBackButtonPress={() => toggleVisibility()}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        animationInTiming={700}
        animationOutTiming={700}
        hideModalContentWhileAnimating
      >
        <View style={styles.parentModalContainer}>
          <View style={styles.modalContainer}>
            <Text style={styles.taskTitle} numberOfLines={2}>
              {taskSelected?.taskLabel}
            </Text>
            {taskSelected?.taskDeadline && screenName === "pending" && (
              <View>
                <Text
                  style={[
                    styles.taskDeadline,
                    {
                      color: isOnGoing(taskSelected.taskDeadline)
                        ? "black"
                        : "red",
                    },
                  ]}
                >
                  {`${readableDateDay(
                    taskSelected.taskDeadline
                  )}, ${readableDateTime(taskSelected.taskDeadline)}`}
                </Text>
                <Text
                  style={[
                    styles.taskDeadline,
                    {
                      color: isOnGoing(taskSelected.taskDeadline)
                        ? "black"
                        : "red",
                    },
                  ]}
                >
                  {taskSelected.taskStatus}
                </Text>
              </View>
            )}
            {taskSelected && !taskSelected.taskDeadline && (
              <Text
                style={[
                  styles.taskDeadline,
                  {
                    color: "black",
                  },
                ]}
              >
                {taskSelected.taskStatus}
              </Text>
            )}
            {taskSelected?.taskStatus === "finished"
              ? taskSettingsChoices
                  .filter((item) => item.id !== 2)
                  .map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.choicesStyle}
                      onPress={methodSeparator(item)}
                    >
                      {iconSeparator(item)}
                      <Text style={styles.textChoiceStyle}>
                        {item.settingName}
                      </Text>
                    </TouchableOpacity>
                  ))
              : taskSettingsChoices
                  .filter((item) => item.id !== 3)
                  .map((item) => (
                    <TouchableOpacity
                      key={item.id}
                      style={styles.choicesStyle}
                      onPress={methodSeparator(item)}
                    >
                      {iconSeparator(item)}
                      <Text style={styles.textChoiceStyle}>
                        {item.settingName}
                      </Text>
                    </TouchableOpacity>
                  ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskModal;

const styles = StyleSheet.create({
  parentModalContainer: {
    flex: 1,
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    width: wp(90),
    maxHeight: "auto",
    borderRadius: wp(5),
    padding: wp(5),
  },
  taskTitle: {
    fontFamily: "Inconsolata-SemiBold",
    fontSize: hp(3.5),
    textAlign: "center",
  },
  taskDeadline: {
    textAlign: "center",
    fontFamily: "Inconsolata-Light",
    fontSize: hp(2),
    marginTop: hp(1),
  },
  choicesStyle: {
    marginVertical: hp(2),
    borderBottomWidth: wp(0.2),
    borderBottomColor: "#929AAB",
    flexDirection: "row",
  },
  textChoiceStyle: {
    fontFamily: "Inconsolata-Regular",
    fontSize: hp(2.5),
  },
  iconSetting: {
    marginRight: wp(2),
  },
});
