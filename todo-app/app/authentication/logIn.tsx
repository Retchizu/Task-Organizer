import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Form from "../../components/Form";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { Button } from "@rneui/base";
import { getUser, logInUser } from "../../task-methods/auth-methods/logInUser";
import { useUserContext } from "../../context/UserContext";

const logIn = () => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const { signUser, user } = useUserContext();

  const handleUserInfoChange = (label: string, value: string) => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [label]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          alignSelf: "center",
          fontSize: wp(6),
          fontFamily: "Inconsolata-SemiBold",
          marginBottom: hp(3),
        }}
      >
        Retchi's Task Organizer
      </Text>

      <Form
        formLabel={"Email"}
        label="userEmail"
        handleAction={handleUserInfoChange}
        isFormPassword={false}
      />
      <Form
        formLabel={"Password"}
        label="userPassword"
        handleAction={handleUserInfoChange}
        isFormPassword={true}
        isPasswordVisible={isPasswordVisible}
        setIsPasswordVisible={setIsPasswordVisible}
      />

      <Button
        title={"Log in"}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonTextStyle}
        onPress={async () => {
          const result = await logInUser(
            userInfo.userEmail.toLowerCase(),
            userInfo.userPassword
          );
          if (result === 200) {
            const currentUser = await getUser();
            signUser(currentUser);

            router.replace("(drawer)/(home)/pending");
          } else {
            console.log("Error occured, try again", result);
          }
        }}
      />
      <Text
        style={{ alignSelf: "center", color: "#0000EE", marginTop: hp(2) }}
        onPress={() => router.replace("authentication/signUp")}
      >
        Do not have an account? Sign Up
      </Text>
    </View>
  );
};

export default logIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  buttonStyle: {
    marginHorizontal: wp(30),
    backgroundColor: "#929AAB",
    borderRadius: wp(3),
    marginTop: hp(1),
  },
  buttonTextStyle: { fontFamily: "Inconsolata-Medium", fontSize: wp(4) },
});
