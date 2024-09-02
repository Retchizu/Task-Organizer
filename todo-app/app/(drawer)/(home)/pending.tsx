import { Platform, View } from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import TaskList from "../../../components/TaskList";
import { useTaskContext } from "../../../context/TaskContext";
import axios, { AxiosResponse } from "axios";
import { getTaskUrl } from "../../../url";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AddTask from "../../../components/AddTask";
import { useAddTaskModalContext } from "../../../context/AddTaskModalContext";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { handleUnauthorizedAccess } from "../../../task-methods/auth-methods/handleUnauthorizedAccess";
import { addTaskApi } from "../../../task-methods/addTask";
import { taskSearchFilterOnGoing } from "../../../task-methods/taskSearchFilter";
import { useNotifcationContext } from "../../../context/NotificationContext";
import { calendarDisplaySeparator } from "../../../task-methods/calendarDisplaySeparator";
import NotificationModal from "../../../components/NotificationModal";

const task = () => {
  const { tasks, setTaskList } = useTaskContext();
  const router = useRouter();
  const [task, setTask] = useState({
    taskLabel: "",
    taskDescription: "",
  });
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [filteredTaskList, setFilteredTaskList] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isAddVisible, toggleAddVisible } = useAddTaskModalContext();
  const { schedulePushNotification } = useNotifcationContext();
  const [isDateVisibleInIos, setIsDateVisibleInIos] = useState(false);

  const handleTaskInfoChange = (label: string, value: string) => {
    setTask((prevInfo) => ({
      ...prevInfo,
      [label]: value,
    }));
  };

  const resetAddTaskModalFormAndClose = () => {
    setTask({
      taskLabel: "",
      taskDescription: "",
    });
    setDeadlineDate(new Date());
    removeSetMark();
    toggleAddVisible();
  };

  const confirmFunction = async () => {
    try {
      const accessToken = SecureStore.getItem("accessToken");
      let response: AxiosResponse | null = null;
      if (accessToken)
        response = await addTaskApi(accessToken, task, deadlineDate);

      if (response?.status === 201) {
        console.log("response for args", response.data);

        if (deadlineDate) {
          schedulePushNotification(response.data);
        }

        resetAddTaskModalFormAndClose();
        console.log(response.status, "Added Successfully");
      }
    } catch (error) {
      const axiosError = await handleUnauthorizedAccess(error);
      if (axiosError) {
        resetAddTaskModalFormAndClose();
        router.replace("authentication/logIn");
      } else {
        const accessToken = SecureStore.getItem("accessToken");
        let response: AxiosResponse | null = null;
        if (accessToken)
          response = await addTaskApi(accessToken, task, deadlineDate);
        if (response?.status === 201) {
          if (deadlineDate) {
            schedulePushNotification(response.data);
          }
          resetAddTaskModalFormAndClose();
          console.log(response.status, "Added Successfully in error");
        } else {
          console.log((error as Error).message);
        }
      }
    }
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;

    if (Platform.OS === "ios") {
      setDeadlineDate(currentDate ? currentDate : new Date());
    }
    if (Platform.OS === "android") {
      if (mode === "date" && event.type !== "dismissed") {
        setDeadlineDate(currentDate ? currentDate : new Date());
        setIsDatePickerVisible(false);
      }
      if (mode === "time" && event.type !== "dismissed") {
        setDeadlineDate(currentDate ? currentDate : new Date());
        setIsDatePickerVisible(false);
      }
    }
    if (Platform.OS === "android") {
      setIsDatePickerVisible(false);
    }
  };

  const showMode = (mode: "date" | "time") => {
    setMode(mode);
    setIsDatePickerVisible(true);
  };
  const removeSetMark = () => {
    setDeadlineDate(null);
  };

  useEffect(() => {
    const setTask = async () => {
      try {
        const accesssToken = SecureStore.getItem("accessToken");
        const result = await axios.get(getTaskUrl, {
          headers: {
            Authorization: `${accesssToken}`,
          },
        });
        const filteredResult: Task[] = result.data.map((task: any) => ({
          id: task._id,
          userId: task.userId,
          taskLabel: task.taskLabel,
          taskDescription: task.taskDescription,
          taskStatus: task.taskStatus,
          taskDeadline: task.taskDeadline ? new Date(task.taskDeadline) : null,
        }));

        setTaskList(filteredResult);

        setFilteredTaskList(filteredResult);
      } catch (error) {
        const axiosError = await handleUnauthorizedAccess(error);
        if (axiosError) {
          const newAccessToken = SecureStore.getItem("accessToken");
          if (newAccessToken) {
            await axios.get(getTaskUrl, {
              headers: {
                Authorization: `${newAccessToken}`,
              },
            });
          } else {
            router.replace("authentication/logIn");
          }
        }
      }
    };
    setTask();
  }, [task]);

  useEffect(() => {
    setFilteredTaskList(taskSearchFilterOnGoing(searchQuery, tasks));
  }, [searchQuery, tasks]);

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <TaskList tasks={filteredTaskList} screenName={"pending"} />
      <AddTask
        handleAction={handleTaskInfoChange}
        confirmFunction={confirmFunction}
        isAddTaskModalVisible={isAddVisible}
        setIsAddTaskModalVisible={toggleAddVisible}
        showMode={showMode}
        removeSet={removeSetMark}
        deadlineDate={deadlineDate}
        modalMode={"add"}
        value={task}
        deadlineForIos={deadlineDate}
        onChangeForIos={onChange}
        isDateVisibleInIos={isDateVisibleInIos}
        setIsDateVisibleInIos={setIsDateVisibleInIos}
        deadlineSetter={setDeadlineDate}
      />
      {isDatePickerVisible && Platform.OS === "android" && (
        <DateTimePicker
          value={deadlineDate ? deadlineDate : new Date()}
          mode={mode}
          display={calendarDisplaySeparator(mode)}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default task;
