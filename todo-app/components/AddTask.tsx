import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Button } from "@rneui/base";
import {
  readableDateDay,
  readableDateTime,
} from "../task-methods/readableDate";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AntDesign from "@expo/vector-icons/AntDesign";

type AddTaskProps = {
  handleAction: (label: string, value: string) => void;
  confirmFunction: () => Promise<void>;
  isAddTaskModalVisible: boolean;
  setIsAddTaskModalVisible: () => void;
  showMode: (currentMode: "date" | "time") => void;
  removeSet: () => void;
  deadlineDate: Date | null;
  value?: { taskLabel: string; taskDescription: string };
  modalMode: string;
  deadlineSetter?: React.Dispatch<React.SetStateAction<Date | null>>;
  deadlineForIos?: Date | null;
  onChangeForIos?: (event: DateTimePickerEvent, selectedDate?: Date) => void;
  setIsDateVisibleInIos: React.Dispatch<React.SetStateAction<boolean>>;
  isDateVisibleInIos: boolean;
};

const AddTask: React.FC<AddTaskProps> = ({
  handleAction,
  confirmFunction,
  isAddTaskModalVisible,
  setIsAddTaskModalVisible,
  showMode,
  removeSet,
  deadlineDate,
  value,
  modalMode,
  deadlineSetter,
  setIsDateVisibleInIos,
  isDateVisibleInIos,
  onChangeForIos,
}) => {
  const [removeDateInAndroid, setRemoveDateInAndroid] = useState(false);
  return (
    <Modal
      isVisible={isAddTaskModalVisible}
      onBackButtonPress={() => {
        setIsAddTaskModalVisible();
        removeSet();
      }}
      animationIn={"fadeInDown"}
      animationInTiming={1000}
      animationOutTiming={1000}
    >
      <View style={styles.modalStyle}>
        <View style={styles.contentViewStyle}>
          <Text style={styles.modalTitle}>
            {modalMode === "add" ? "Add" : "Update"} a task
          </Text>
          <Text style={styles.labelStyle}>Title:</Text>
          <TextInput
            style={styles.titleTextInputStyle}
            placeholder="task title..."
            onChangeText={(text) => handleAction("taskLabel", text)}
            maxLength={30}
            value={value?.taskLabel}
          />
          <Text style={styles.labelStyle}>Description:</Text>
          <View style={styles.descriptionTextInputContainerStyle}>
            <TextInput
              style={{ padding: wp(1), fontFamily: "Inconsolata-Regular" }}
              placeholder="task description..."
              multiline
              onChangeText={(text) => handleAction("taskDescription", text)}
              value={value?.taskDescription}
            />
          </View>
          {Platform.OS === "android" && (
            <View style={styles.setDeadlineContainerStyle}>
              {removeDateInAndroid && (
                <TouchableOpacity
                  onPress={() => {
                    setRemoveDateInAndroid(false);
                    if (deadlineSetter) deadlineSetter(null);
                  }}
                >
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={{ marginRight: wp(1) }}
                onPress={() => {
                  setRemoveDateInAndroid(true);
                  if (!deadlineDate && deadlineSetter) {
                    deadlineSetter(new Date());
                  }
                  showMode("date");
                }}
              >
                <Text style={styles.labelStyle}>
                  {deadlineDate ? readableDateDay(deadlineDate) : "Set Date"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginLeft: wp(1) }}
                onPress={() => {
                  setRemoveDateInAndroid(true);
                  if (!deadlineDate && deadlineSetter) {
                    deadlineSetter(new Date());
                  }
                  showMode("time");
                }}
              >
                <Text style={styles.labelStyle}>
                  {deadlineDate ? readableDateTime(deadlineDate) : "Set Time"}
                </Text>
              </TouchableOpacity>
              <FontAwesome
                name="calendar-plus-o"
                size={24}
                color="black"
                style={{ marginLeft: wp(2) }}
              />
            </View>
          )}
          {Platform.OS === "ios" && !isDateVisibleInIos && (
            <View style={styles.setDeadlineContainerStyle}>
              <TouchableOpacity
                style={{ marginRight: wp(1) }}
                onPress={() => {
                  if (!deadlineDate && deadlineSetter) {
                    setIsDateVisibleInIos(true);
                    deadlineSetter(new Date());
                  } else {
                    setIsDateVisibleInIos(true);
                  }
                }}
              >
                <Text style={styles.labelStyle}>
                  {deadlineDate ? readableDateDay(deadlineDate) : "Set Date"}
                </Text>
              </TouchableOpacity>

              <FontAwesome
                name="calendar-plus-o"
                size={24}
                color="black"
                style={{ marginLeft: wp(2) }}
              />
            </View>
          )}
          {isDateVisibleInIos && Platform.OS === "ios" && (
            <View
              style={{
                alignItems: "center",
                marginTop: hp(2),
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  if (modalMode === "add") {
                    setIsDateVisibleInIos(false);
                    if (deadlineSetter) deadlineSetter(null);
                  } else {
                    setIsDateVisibleInIos(false);
                    if (deadlineSetter) deadlineSetter(deadlineDate);
                  }
                }}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <DateTimePicker
                value={deadlineDate ? deadlineDate : new Date()}
                mode={"datetime"}
                onChange={onChangeForIos}
              />
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={"Cancel"}
              buttonStyle={styles.confirmButtonStyle}
              titleStyle={styles.confirmButtonTitleStyle}
              onPress={() => {
                setIsDateVisibleInIos(false);
                setIsAddTaskModalVisible();
                removeSet();
              }}
            />
            <Button
              title={"Confirm"}
              buttonStyle={styles.confirmButtonStyle}
              titleStyle={styles.confirmButtonTitleStyle}
              onPress={() => confirmFunction()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddTask;

const styles = StyleSheet.create({
  contentViewStyle: {
    backgroundColor: "white",
    width: wp(90),
    maxWidth: wp(90),
    borderRadius: wp(5),
    padding: wp(5),
  },
  modalStyle: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalTitle: {
    textAlign: "center",
    fontFamily: "Inconsolata-SemiBold",
    fontSize: hp(4),
  },
  titleTextInputStyle: {
    borderBottomWidth: wp(0.2),
    borderBottomColor: "#929AAB",
    fontFamily: "Inconsolata-Regular",
    marginHorizontal: wp(1),
  },
  labelStyle: {
    fontFamily: "Inconsolata-Bold",
    fontSize: hp(2.8),
  },
  descriptionTextInputContainerStyle: {
    borderWidth: wp(0.2),
    borderColor: "#929AAB",
    height: hp(20),
  },
  setDeadlineContainerStyle: {
    justifyContent: "center",
    marginTop: hp(2),
    flexDirection: "row",
  },
  confirmButtonStyle: {
    backgroundColor: "#929AAB",
    borderRadius: wp(2),
    marginTop: hp(3),
  },
  confirmButtonTitleStyle: {
    fontFamily: "Inconsolata-Medium",
    fontSize: hp(2),
  },
  buttonContainer: {
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
});
