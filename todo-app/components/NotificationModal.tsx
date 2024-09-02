import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { useNotificationModalContext } from "../context/NotificationModalContext";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useNotifcationContext } from "../context/NotificationContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { getNotificationUrl } from "../url";
import * as SecureStore from "expo-secure-store";
import { handleUnauthorizedAccess } from "../task-methods/auth-methods/handleUnauthorizedAccess";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTaskContext } from "../context/TaskContext";
import {
  readableDateDay,
  readableDateTime,
} from "../task-methods/readableDate";
import * as Notifications from "expo-notifications";

const NotificationModal = () => {
  const { isNotificationModalVisible, toggleNotificationModalVisibility } =
    useNotificationModalContext();
  const { notificationList, setNotificationList } = useNotifcationContext();
  const { tasks } = useTaskContext();
  const router = useRouter();

  type NotificationData = {
    _id: string;
    userId: string;
    taskId: string;
    isRead: boolean;
    notificationMessage: string;
  };

  const getNotificationList = async () => {
    const accesssToken = SecureStore.getItem("accessToken");
    try {
      const result = await axios.get(getNotificationUrl, {
        headers: {
          Authorization: `${accesssToken}`,
        },
      });
      const filteredResult: TaskNotification[] = result.data.flatMap(
        (item: NotificationData) => {
          const filteredTaskList = tasks.filter(
            (task) => item.taskId === task.id
          );
          const result = filteredTaskList.map((filteredTask) => ({
            _id: item._id,
            userId: item.userId,
            isRead: item.isRead,
            notificationMessage: item.notificationMessage,
            task: filteredTask,
          }));
          return result;
        }
      );

      console.log(filteredResult);
      setNotificationList(filteredResult);
    } catch (error) {
      const axiosError = await handleUnauthorizedAccess(error);
      if (axiosError) {
        router.replace("authentication/logIn");
        return;
      } else {
        const result = await axios.get(getNotificationUrl, {
          headers: {
            Authorization: `${accesssToken}`,
          },
        });

        if (result.status === 200) {
        } else {
          console.log((error as Error).message);
        }
      }
    }
  };

  useEffect(() => {
    getNotificationList();
  }, [tasks]);

  return (
    <Modal
      isVisible={isNotificationModalVisible}
      onBackButtonPress={() => toggleNotificationModalVisibility()}
      hideModalContentWhileAnimating
      presentationStyle="overFullScreen"
    >
      <View style={styles.ModalParentContainer}>
        <View style={styles.ModalContentContainer}>
          <TouchableOpacity
            onPress={() => toggleNotificationModalVisibility()}
            style={{ padding: wp(2) }}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Inconsolata-SemiBold",
              fontSize: wp(7),
              marginLeft: wp(2),
            }}
          >
            Notifications
          </Text>
          <FlatList
            data={notificationList}
            renderItem={({ item }) => (
              <View style={styles.notificationContainer}>
                <Text style={styles.notificationHeader}>
                  {item.notificationMessage}
                </Text>
                <Text style={styles.notificationDescription}>
                  Your task "{item.task.taskLabel}" is due on{" "}
                  {readableDateDay(item.task.taskDeadline)}{" "}
                  {readableDateTime(item.task.taskDeadline)}. Don't forget to
                  complete it on time!
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default NotificationModal;

const styles = StyleSheet.create({
  ModalContentContainer: {
    backgroundColor: "white",
    width: wp(70),
    height: hp(80),
    borderRadius: wp(2),
  },
  ModalParentContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingTop: Platform.OS === "android" ? hp(6) : hp(9),
  },
  notificationContainer: {
    borderBottomWidth: wp(0.2),
    borderColor: "#929AAB",
  },
  notificationHeader: {
    fontFamily: "Inconsolata-Bold",
    fontSize: wp(5),
    marginLeft: wp(2),
  },
  notificationDescription: {
    fontFamily: "Inconsolata-Regular",
    fontSize: wp(3.8),
    marginLeft: wp(4),
  },
});
