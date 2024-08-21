import { View } from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import TaskList from "../../../components/TaskList";
import { useTaskContext } from "../../../context/TaskContext";
import axios, { AxiosResponse } from "axios";
import { getTaskUrl } from "../../../url";
import { useFocusEffect, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import AddTask from "../../../components/AddTask";
import { useAddTaskModalContext } from "../../../context/AddTaskModalContext";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { handleUnauthorizedAccess } from "../../../task-methods/handleUnauthorizedAccess";
import { addTaskApi } from "../../../task-methods/addTask";
import { taskSearchFilterOnGoing } from "../../../task-methods/taskSearchFilter";

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
  const [isDeadlineSetted, setIsDeadlineSetted] = useState(false);
  const [filteredTaskList, setFilteredTaskList] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, toggleModal } = useAddTaskModalContext();

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
    toggleModal();
  };

  const confirmFunction = async () => {
    try {
      const accessToken = SecureStore.getItem("accessToken");
      let response: AxiosResponse | null = null;
      if (accessToken)
        response = await addTaskApi(accessToken, task, deadlineDate);

      if (response?.status === 201) {
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

  const showMode = (mode: "date" | "time") => {
    setMode(mode);
    setIsDatePickerVisible(true);
  };
  const removeSetMark = () => {
    setDeadlineDate(null);
    setIsDeadlineSetted(false);
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
        isAddTaskModalVisible={isOpen}
        setIsAddTaskModalVisible={toggleModal}
        showMode={showMode}
        set={isDeadlineSetted}
        removeSet={removeSetMark}
        deadlineDate={deadlineDate}
        modalMode={"add"}
        value={task}
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

export default task;
