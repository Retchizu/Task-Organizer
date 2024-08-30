import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Form from "../../components/Form";
import { useRouter } from "expo-router";
import { Button } from "@rneui/base";
import axios from "axios";
import { baseUrl, registerUrl } from "../../url";

const signUp = () => {
  const router = useRouter();

  const [userRegistrationInfo, setUserRegistrationInfo] = useState({
    userEmail: "",
    userName: "",
    userPassword: "",
    userConfirmPassword: "",
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(true);
  const handleUserInfoChange = (label: string, value: string) => {
    setUserRegistrationInfo((prevInfo) => ({
      ...prevInfo,
      [label]: value,
    }));
  };

  const registerUser = async () => {
    if (
      userRegistrationInfo.userPassword ===
      userRegistrationInfo.userConfirmPassword
    ) {
      try {
        const response = await axios.post(registerUrl, {
          userName: userRegistrationInfo.userName,
          email: userRegistrationInfo.userEmail,
          password: userRegistrationInfo.userPassword,
        });
        setUserRegistrationInfo({
          userEmail: "",
          userName: "",
          userPassword: "",
          userConfirmPassword: "",
        });

        router.replace("authentication/logIn");
        console.log("registered successfully");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        console.log((error as Error).message);
      }
    } else {
      console.log("Password do not match");
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          alignSelf: "center",
          fontSize: hp(3),
          fontFamily: "Inconsolata-SemiBold",
          marginBottom: hp(3),
        }}
      >
        Register a Retchi account
      </Text>

      <Form
        formLabel="Email"
        label="userEmail"
        handleAction={handleUserInfoChange}
        isFormPassword={false}
      />
      <Form
        formLabel="Username"
        label="userName"
        handleAction={handleUserInfoChange}
        isFormPassword={false}
      />
      <Form
        formLabel="Password"
        label="userPassword"
        handleAction={handleUserInfoChange}
        isFormPassword={true}
        isPasswordVisible={isPasswordVisible}
        setIsPasswordVisible={setIsPasswordVisible}
      />
      <Form
        formLabel="Confirm Password"
        label="userConfirmPassword"
        handleAction={handleUserInfoChange}
        isFormPassword={true}
        setIsPasswordVisible={setIsConfirmPasswordVisible}
        isPasswordVisible={isConfirmPasswordVisible}
      />

      <Button
        title={"Sign up"}
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.buttonTextStyle}
        onPress={() => registerUser()}
      />

      <Text
        style={{ alignSelf: "center", color: "#0000EE", marginTop: hp(2) }}
        onPress={() => router.replace("authentication/logIn")}
      >
        Already have an account? Sign In
      </Text>
    </View>
  );
};

export default signUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  registerMessage: {
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
