import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AccountCredentials from "../../components/AccountCredentials";
import { useUserContext } from "../../context/UserContext";
import { useTaskContext } from "../../context/TaskContext";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { updateDisplayPictureUrl } from "../../url";
import * as SecureStore from "expo-secure-store";
import { handleUnauthorizedAccess } from "../../task-methods/auth-methods/handleUnauthorizedAccess";
import { useRouter } from "expo-router";

const account = () => {
  const { user } = useUserContext();
  const { tasks } = useTaskContext();
  const router = useRouter();
  const [completedTaskLength, setCompletedTaskLength] = useState("");
  const [onGoingTaskLength, setOnGoingTaskLength] = useState("");
  const [editConfirmationModal, setEditConfirmationModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      console.log("result:", result);
      setSelectedImage(result.assets[0].uri);
    } else {
      console.log("Did not select any image");
    }
  };

  const convertToBase64 = async (uri: string) => {
    return await FileSystem.readAsStringAsync(uri, { encoding: "base64" });
  };

  const updateUserImage = async () => {
    if (selectedImage) {
      try {
        const base64Converted = await convertToBase64(selectedImage);
        const response = await axios.put(
          updateDisplayPictureUrl,
          {
            displayPicture: base64Converted,
          },
          {
            headers: {
              Authorization: `${SecureStore.getItem("accessToken")}`,
            },
          }
        );
        console.log(response.data, "Updated successfully");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = await handleUnauthorizedAccess(error);
          if (axiosError) {
            const newAccessToken = SecureStore.getItem("accessToken");
            if (newAccessToken) {
              const base64Converted = await convertToBase64(selectedImage);
              const response = await axios.put(
                updateDisplayPictureUrl,
                { displayPicture: base64Converted },
                {
                  headers: {
                    Authorization: `${newAccessToken}`,
                  },
                }
              );
              console.log(response.data, "updated successfully in error");
            } else {
              router.replace("authentication/logIn");
            }
          }
          console.log(`${(error as Error).message}, 500`);
        }
      }
    }
  };

  const toggleEditProfilePictureVisibility = () => {
    setEditConfirmationModal(!editConfirmationModal);
  };

  useEffect(() => {
    setCompletedTaskLength(
      tasks.filter((item) => item.taskStatus === "finished").length.toString()
    );
    setOnGoingTaskLength(
      tasks.filter((item) => item.taskStatus === "ongoing").length.toString()
    );
  }, [tasks]);

  useEffect(() => {
    console.log(selectedImage);
    if (selectedImage) updateUserImage();
  }, [selectedImage]);
  return (
    <View style={{ flex: 1, margin: hp(2) }}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => toggleEditProfilePictureVisibility()}
        >
          <Image
            source={
              user?.displayPicture
                ? { uri: `data:image/png;base64,${user.displayPicture}` }
                : selectedImage
                ? { uri: `${selectedImage}` }
                : require(".././../assets/ambatukam.jpg")
            }
            style={styles.imageStyle}
          />
        </TouchableOpacity>
        <Text style={styles.labelStyle}>Profile Picture</Text>
      </View>

      <View
        style={{
          flex: 1,
          borderRadius: wp(2),
          padding: wp(2),
        }}
      >
        <AccountCredentials
          label="Username"
          userInfo={user ? user.userName.toString() : ""}
        />
        <AccountCredentials
          label="Email"
          userInfo={user ? user.email.toString() : ""}
        />
        <AccountCredentials label="Password" userInfo={"********"} />
        <View style={styles.taskCounterContainer}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.labelStyle}>Task Completed</Text>
            <Text style={styles.infoStyle}>{completedTaskLength}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.labelStyle}>Ongoing Task</Text>
            <Text style={styles.infoStyle}>{onGoingTaskLength}</Text>
          </View>
        </View>
      </View>

      <Modal
        isVisible={editConfirmationModal}
        onBackButtonPress={() => toggleEditProfilePictureVisibility()}
      >
        <View style={styles.confirmationModalParent}>
          <View style={styles.confirmationModalContainer}>
            <Text
              style={{
                fontFamily: "Inconsolata-SemiBold",
                fontSize: hp(2.5),
                textAlign: "center",
              }}
            >
              Edit your profile picture?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: wp(25),
                marginTop: hp(2),
              }}
            >
              <TouchableOpacity
                onPress={() => toggleEditProfilePictureVisibility()}
              >
                <Text style={styles.confirmationModalButtons}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await pickImageAsync();
                  toggleEditProfilePictureVisibility();
                }}
              >
                <Text style={styles.confirmationModalButtons}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default account;

const styles = StyleSheet.create({
  imageStyle: {
    width: hp(20),
    height: hp(20),
    borderRadius: hp(20) / 2,
    alignSelf: "center",
  },
  labelStyle: {
    fontFamily: "Inconsolata-SemiBold",
    fontSize: hp(3),
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: hp(5),
  },
  infoStyle: {
    fontFamily: "Inconsolata-Light",
    fontSize: hp(2.5),
  },
  taskCounterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2),
  },
  confirmationModalParent: {
    flex: 1,
    justifyContent: "center",
  },
  confirmationModalContainer: {
    backgroundColor: "white",
    maxHeight: hp(20),
    padding: wp(2),
    borderRadius: wp(5),
  },
  confirmationModalButtons: {
    fontFamily: "Inconsolata-Medium",
    fontSize: hp(2.2),
  },
});
