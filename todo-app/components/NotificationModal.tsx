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
import { useEffect } from "react";
import { useTaskContext } from "../context/TaskContext";
import {
  readableDateDay,
  readableDateTime,
} from "../task-methods/readableDate";
import Octicons from "@expo/vector-icons/Octicons";
import { updateNotificationStatus } from "../task-methods/notification-methods/updateNotificationStatus";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { deleteAllNotification } from "../task-methods/notification-methods/deleteAllNotification";

const NotificationModal = () => {
  const { isNotificationModalVisible, toggleNotificationModalVisibility } =
    useNotificationModalContext();
  const { notificationList, setNotificationList, updateNotification } =
    useNotifcationContext();
  const { tasks } = useTaskContext();
  const router = useRouter();
  const accessToken = SecureStore.getItem("accessToken");

  type NotificationData = {
    _id: string;
    userId: string;
    taskId: string;
    isRead: boolean;
    notificationMessage: string;
    createdAt: Date;
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
            createdAt: new Date(item.createdAt),
            task: filteredTask,
          }));
          return result;
        }
      );

      setNotificationList(
        filteredResult.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        )
      );
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

  const renderBoldTaskLabel = (taskTitle: String) => (
    <Text style={{ fontFamily: "Inconsolata-Bold" }}>{taskTitle}</Text>
  );
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
          <View style={styles.notificationHeaderIcon}>
            <TouchableOpacity
              onPress={() => toggleNotificationModalVisibility()}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                if (accessToken) {
                  await deleteAllNotification(accessToken, router);
                  setNotificationList([]);
                } else {
                  console.log("accessToken not found");
                  router.replace("authentication/logIn");
                }
              }}
            >
              <MaterialIcons name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontFamily: "Inconsolata-SemiBold",
              fontSize: wp(7),
              marginLeft: wp(2),
              marginBottom: hp(1),
            }}
          >
            Notifications
          </Text>
          <FlatList
            data={notificationList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.notificationContainer}
                activeOpacity={0.6}
                onPress={async () => {
                  if (accessToken) {
                    await updateNotificationStatus(
                      item._id,
                      true,
                      accessToken,
                      router
                    );

                    updateNotification(item._id, { isRead: true });
                  } else {
                    console.log("accessToken not found");
                    router.replace("authentication/logIn");
                  }
                }}
              >
                <View style={styles.notificationTitle}>
                  <Text style={styles.notificationHeader}>
                    {item.notificationMessage}
                  </Text>
                  {!item.isRead && (
                    <Octicons
                      name="dot-fill"
                      size={24}
                      color="red"
                      style={{ marginRight: wp(2) }}
                    />
                  )}
                </View>
                <View style={styles.notificationChildren}>
                  <Text style={styles.notificationDescription}>
                    Your task "{renderBoldTaskLabel(item.task.taskLabel)}" is
                    due on{" "}
                    {item.task.taskDeadline &&
                      readableDateDay(item.task.taskDeadline)}{" "}
                    {item.task.taskDeadline &&
                      readableDateTime(item.task.taskDeadline)}
                    . Don't forget to complete it on time!
                  </Text>
                </View>
              </TouchableOpacity>
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
    width: wp(80),
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
  notificationChildren: {
    flexDirection: "row",
  },
  notificationTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notificationHeaderIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
    alignItems: "center",
    paddingHorizontal: wp(2),
  },
});
