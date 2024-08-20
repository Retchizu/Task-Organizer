import { Keyboard, TouchableOpacity } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";

const HomeLayout = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <Tabs
      initialRouteName="pending"
      screenOptions={{
        headerShown: false,
        tabBarStyle: isKeyboardVisible
          ? { display: "none" }
          : {
              marginHorizontal: wp(15),
              bottom: hp(2),
              borderRadius: wp(3),
              paddingBottom: hp(2),
              paddingVertical: hp(2),
              paddingHorizontal: wp(5),
            },
        tabBarActiveBackgroundColor: "#393E46",
        tabBarIconStyle: { display: "none" },
        title: "Pending",
        tabBarItemStyle: { justifyContent: "center" },
        tabBarLabelStyle: {
          fontSize: hp(2),
          fontFamily: "Inconsolata-Light",
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "black",
      }}
    >
      <Tabs.Screen name="pending" options={{}} />
      <Tabs.Screen
        name="finished"
        options={{ tabBarIconStyle: { display: "none" }, title: "Finished" }}
      />
    </Tabs>
  );
};

export default HomeLayout;
