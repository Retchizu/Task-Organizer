import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Entypo from "@expo/vector-icons/Entypo";

type FormProps = {
  formLabel: string;
  handleAction: (label: string, value: string) => void;
  label: string;
  isFormPassword: boolean;
  isPasswordVisible?: boolean;
  setIsPasswordVisible?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Form: React.FC<FormProps> = ({
  formLabel,
  handleAction,
  label,
  isFormPassword,
  isPasswordVisible,
  setIsPasswordVisible,
}) => {
  return (
    <View>
      <View style={styles.formContainer}>
        <Text
          style={{
            flex: wp(0.05),
            fontFamily: "Inconsolata-Regular",
            fontSize: hp(2.2),
          }}
        >{`${formLabel}:`}</Text>
        {isFormPassword ? (
          <View
            style={{
              borderColor: "black",
              borderWidth: wp(0.5),
              flex: 1,
              flexDirection: "row",
              borderRadius: wp(2),
              paddingHorizontal: wp(2),
            }}
          >
            <TextInput
              style={styles.formInputStyle}
              onChangeText={(text) => handleAction(label, text)}
              secureTextEntry={isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => {
                if (setIsPasswordVisible)
                  setIsPasswordVisible(!isPasswordVisible);
              }}
            >
              {!isPasswordVisible ? (
                <Entypo name="eye-with-line" size={24} color="black" />
              ) : (
                <Entypo name="eye" size={24} color="black" />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              borderColor: "black",
              borderWidth: wp(0.5),
              flex: 1,
              flexDirection: "row",
              borderRadius: wp(2),
              paddingHorizontal: wp(2),
            }}
          >
            <TextInput
              style={styles.formInputStyle}
              onChangeText={(text) => handleAction(label, text)}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Form;

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: "row",
    marginHorizontal: wp(15),
    marginVertical: hp(0.5),
    alignItems: "center",
  },
  formInputStyle: {
    flex: 1,
  },
});
