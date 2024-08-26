import { View, Text, Image } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppTitle, DrawerLabel, UserName } from "./DrawerLabelComponent";
import { useUserContext } from "../context/UserContext";
import { logOutUser } from "../task-methods/logOutuser";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const CustomDrawerComponent = (props: any) => {
  const { user, deleteUser } = useUserContext();
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppTitle text="Retchi" />
      <Image
        source={
          user?.displayPicture
            ? { uri: `data:image/png;base64,${user.displayPicture}` }
            : require("../assets/ambatukam.jpg")
        }
        style={{
          width: 100,
          height: 100,
          alignSelf: "center",
          borderRadius: 100 / 2,
          overflow: "hidden",
          marginTop: hp(2),
        }}
      />
      <UserName text={user ? user.userName.toString() : ""} />
      <DrawerContentScrollView scrollEnabled={false}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={{ marginBottom: hp(3) }}>
        <DrawerItem
          label={() => <DrawerLabel text="Log out" />}
          onPress={async () => {
            const result = await logOutUser();
            if (result === 200) {
              deleteUser(user!);
              await SecureStore.deleteItemAsync("accessToken");
              await SecureStore.deleteItemAsync("refreshToken");
              router.replace("authentication/logIn");
              console.log("Logged Out Sucessfully");
            } else {
              deleteUser(user!);
              await SecureStore.deleteItemAsync("accessToken");
              await SecureStore.deleteItemAsync("refreshToken");
              router.replace("authentication/logIn");
              console.log("Error:", result);
            }
          }}
          icon={() => <Ionicons name="exit-outline" size={24} color="black" />}
        />
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawerComponent;
