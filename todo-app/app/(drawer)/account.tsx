import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AccountCredentials from "../../components/AccountCredentials";
import { useUserContext } from "../../context/UserContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTaskContext } from "../../context/TaskContext";

const account = () => {
  const { user } = useUserContext();
  const { tasks } = useTaskContext();
  const [completedTaskLength, setCompletedTaskLength] = useState("");
  const [onGoingTaskLength, setOnGoingTaskLength] = useState("");

  useEffect(() => {
    setCompletedTaskLength(
      tasks.filter((item) => item.taskStatus === "finished").length.toString()
    );
    setOnGoingTaskLength(
      tasks.filter((item) => item.taskStatus === "ongoing").length.toString()
    );
  }, [tasks]);

  return (
    <View style={{ flex: 1, margin: hp(2) }}>
      <View style={styles.imageContainer}>
        <TouchableOpacity activeOpacity={0.5}>
          <Image
            source={require(".././../assets/ambatukam.jpg")}
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
});
