import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Modal from "react-native-modal";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Entypo from "@expo/vector-icons/Entypo";
import { useTaskContext } from "../context/TaskContext";
import { useRouter } from "expo-router";
import {
  readableDateDay,
  readableDateTime,
} from "../task-methods/readableDate";
import isOnGoing from "../task-methods/isOnGoing";
import { useAddTaskModalContext } from "../context/AddTaskModalContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  deleteTaskFromList,
  setTaskToFinished,
  setTaskToOngoing,
  toggleEditTaskModal,
} from "../task-methods/methodSeparator";

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
  const { updateTask, setTaskList, tasks } = useTaskContext();
  const { toggleUpdateVisible } = useAddTaskModalContext();
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
    toggleVisibility();
    setTaskList(tasks.filter((task) => task.id !== taskSelected!.id));
  };

  const methodSeparator = (taskSettingChoice: {
    id: number;
    settingName: string;
  }) => {
    switch (taskSettingChoice.id) {
      case 0:
        return () => toggleEditTaskModal(toggleVisibility, toggleUpdateVisible);
      case 1:
        return async () => {
          if (taskSelected)
            await deleteTaskFromList(
              taskSelected,
              router,
              filterTaskListAndClose
            );
        };

      case 2:
        return taskSelected?.taskStatus === "finished"
          ? () => {}
          : async () =>
              await setTaskToFinished(
                taskSelected!,
                updateTask,
                router,
                toggleVisibility
              );
      case 3:
        return async () =>
          await setTaskToOngoing(
            taskSelected!,
            updateTask,
            router,
            toggleVisibility
          );
    }
  };

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
            <TouchableOpacity onPress={() => toggleVisibility()}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

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
