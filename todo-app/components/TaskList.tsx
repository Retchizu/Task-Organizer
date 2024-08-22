import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import dateFormatter from "../task-methods/dateFormatter";
import Fontisto from "@expo/vector-icons/Fontisto";
import isOnGoing from "../task-methods/isOnGoing";

import TaskModal from "./TaskModal";
import AddTask from "./AddTask";
import { AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";
import { updateTaskApi } from "../task-methods/updateTask";
import { useRouter } from "expo-router";
import { handleUnauthorizedAccess } from "../task-methods/handleUnauthorizedAccess";
import { useAddTaskModalContext } from "../context/AddTaskModalContext";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useTaskContext } from "../context/TaskContext";

type TaskListProp = {
  tasks: Task[];
  screenName: string;
};

const TaskList: React.FC<TaskListProp> = ({ tasks, screenName }) => {
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [selectedTaskInfo, setSelectedTaskInfo] = useState({
    taskLabel: "",
    taskDescription: "",
  });

  const { isUpdate, toggleUpdate } = useAddTaskModalContext();
  const [mode, setMode] = useState<"date" | "time">("date");
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [isDeadlineSetted, setIsDeadlineSetted] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const { updateTask } = useTaskContext();

  const router = useRouter();

  const showMode = (currentMode: "date" | "time") => {
    setMode(currentMode);
    setIsDatePickerVisible(true);
  };

  const handleTaskModalVisibility = () => {
    setIsTaskModalVisible(!isTaskModalVisible);
  };

  const handleTaskInfoChange = (label: string, value: string) => {
    setSelectedTaskInfo((prevInfo) => ({
      ...prevInfo,
      [label]: value,
    }));
  };
  const removeSetMark = () => {
    setSelectedTaskInfo({
      taskLabel: "",
      taskDescription: "",
    });
    setDeadlineDate(null);
    setSelectedTask(null);
    setIsDeadlineSetted(false);
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;

    if (mode === "date" && event.type !== "dismissed") {
      setDeadlineDate(currentDate ? currentDate : new Date());
      setIsDatePickerVisible(false);
      setIsDeadlineSetted(true);
    }
    if (mode === "time" && event.type !== "dismissed") {
      setDeadlineDate(currentDate ? currentDate : new Date());
      setIsDatePickerVisible(false);
      setIsDeadlineSetted(true);
    }
    setIsDatePickerVisible(false);
  };

  const confirmFunction = async () => {
    try {
      if (selectedTask) {
        const accessToken = SecureStore.getItem("accessToken");
        let response: AxiosResponse | null = null;
        if (accessToken)
          response = await updateTaskApi(
            selectedTask.id,
            selectedTaskInfo,
            selectedTask.taskDeadline
          );

        if (response?.status === 201) {
          updateTask(selectedTask?.id, {
            taskLabel: selectedTaskInfo.taskLabel,
            taskDescription: selectedTaskInfo.taskDescription
              ? selectedTaskInfo.taskDescription
              : selectedTask.taskDescription,
            taskDeadline: deadlineDate
              ? deadlineDate
              : selectedTask.taskDeadline,
          });
          removeSetMark();
          toggleUpdate();
          console.log(response.status, "Updated Successfully");
        }
      }
    } catch (error) {
      const axiosError = await handleUnauthorizedAccess(error);
      if (axiosError) {
        toggleUpdate();
        router.replace("authentication/logIn");
        return;
      } else {
        const accessToken = SecureStore.getItem("accessToken");
        let response: AxiosResponse | null = null;
        if (accessToken && selectedTask)
          response = await updateTaskApi(
            selectedTask.id,
            selectedTaskInfo,
            selectedTask.taskDeadline
          );
        if (response?.status === 201) {
          if (selectedTask) {
            updateTask(selectedTask?.id, {
              taskLabel: selectedTaskInfo.taskLabel,
              taskDescription: selectedTaskInfo.taskDescription
                ? selectedTaskInfo.taskDescription
                : selectedTask.taskDescription,
              taskDeadline: deadlineDate
                ? deadlineDate
                : selectedTask.taskDeadline,
            });
          }
          removeSetMark();
          toggleUpdate();
          console.log(response.status, "Updated Successfully in error");
        } else {
          console.log((error as Error).message);
        }
      }
    }
  };

  useEffect(() => {
    if (selectedTask) {
      setSelectedTaskInfo({
        taskLabel: selectedTask.taskLabel.toString(),
        taskDescription: selectedTask.taskDescription?.toString(),
      });
      setDeadlineDate(selectedTask.taskDeadline);
    }
  }, [selectedTask, isTaskModalVisible]);

  useEffect(() => {
    if (!isTaskModalVisible && !isUpdate) {
      setSelectedTaskInfo({
        taskLabel: "",
        taskDescription: "",
      });
      setDeadlineDate(null);
    }
  }, [isTaskModalVisible]);

  useEffect(() => {
    console.log("render list");
  }, [tasks]);
  return (
    <View style={styles.taskListContainer}>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              borderBottomColor: "#929AAB",
              borderBottomWidth: wp(0.3),
              paddingBottom: wp(1),
            }}
            onPress={() => {
              setIsTaskModalVisible(true);
              setSelectedTask(item);
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.taskTitle} numberOfLines={1}>
                {item.taskLabel}
              </Text>
              {screenName === "pending" ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={[
                      styles.taskDeadline,
                      {
                        color: item.taskDeadline
                          ? isOnGoing(item.taskDeadline)
                            ? "black"
                            : "red"
                          : "black",
                      },
                    ]}
                  >
                    {item.taskDeadline ? dateFormatter(item.taskDeadline) : ""}
                  </Text>

                  {item.taskDeadline && (
                    <Fontisto
                      name="date"
                      size={16}
                      color="black"
                      style={{ margin: wp(1) }}
                    />
                  )}
                </View>
              ) : null}
            </View>

            <Text style={styles.taskDescription} numberOfLines={1}>
              {item.taskDescription ? item.taskDescription : ""}
            </Text>
          </TouchableOpacity>
        )}
      />
      <TaskModal
        isTaskModalVisible={isTaskModalVisible}
        toggleVisibility={handleTaskModalVisibility}
        taskSelected={selectedTask}
        screenName={screenName}
      />
      <AddTask
        confirmFunction={confirmFunction}
        handleAction={handleTaskInfoChange}
        deadlineDate={deadlineDate}
        isAddTaskModalVisible={isUpdate}
        removeSet={removeSetMark}
        set={isDeadlineSetted}
        setIsAddTaskModalVisible={toggleUpdate}
        showMode={showMode}
        modalMode="update"
        value={selectedTaskInfo}
        deadlineSetter={setDeadlineDate}
      />
      {isDatePickerVisible && (
        <DateTimePicker
          value={deadlineDate ? deadlineDate : new Date()}
          mode={mode}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default TaskList;

const styles = StyleSheet.create({
  taskListContainer: {
    marginHorizontal: wp(3),
    marginTop: hp(1),
    flex: 1,
  },
  taskTitle: {
    fontFamily: "Inconsolata-SemiBold",
    fontSize: hp(3),
    flex: 1,
  },
  taskDescription: {
    fontFamily: "Inconsolata-Light",
    maxWidth: wp(70),
    marginLeft: wp(2),
  },
  taskStatus: {
    fontFamily: "Inconsolata-ExtraLight",
    fontSize: hp(1.8),
    marginRight: wp(1),
  },
  taskDeadline: {
    fontFamily: "Inconsolata-Light",
    marginLeft: wp(1),
  },
});
