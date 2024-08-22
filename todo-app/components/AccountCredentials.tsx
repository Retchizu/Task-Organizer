import { StyleSheet, Text } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native-gesture-handler";

type AccountCredentialsProps = {
  label: string;
  userInfo: string;
};

const AccountCredentials: React.FC<AccountCredentialsProps> = ({
  label,
  userInfo,
}) => {
  return (
    <TouchableOpacity
      style={{ borderBottomWidth: wp(0.2), borderBottomColor: "#929AAB" }}
    >
      <Text style={styles.labelStyle}>{label}</Text>
      <Text style={styles.userInfoStyle}>{userInfo}</Text>
    </TouchableOpacity>
  );
};

export default AccountCredentials;

const styles = StyleSheet.create({
  labelStyle: {
    fontFamily: "Inconsolata-SemiBold",
    fontSize: hp(3.5),
  },
  userInfoStyle: {
    fontFamily: "Inconsolata-Light",
    fontSize: hp(3),
  },
});
