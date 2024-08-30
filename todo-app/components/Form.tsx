import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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
  const [iconLabel, setIconLabel] = useState<"eye" | "eye-with-line">(
    "eye-with-line"
  );
  useEffect(() => {
    if (isPasswordVisible) {
      setIconLabel("eye");
    } else {
      setIconLabel("eye-with-line");
    }
  }, [isPasswordVisible]);
  return (
    <View>
      <View style={styles.formContainer}>
        <Text
          style={{
            flex: 0.5,
            fontFamily: "Inconsolata-Regular",
            fontSize: wp(3.5),
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
              style={{ justifyContent: "center" }}
              onPress={() => {
                if (setIsPasswordVisible)
                  setIsPasswordVisible(!isPasswordVisible);
              }}
            >
              <Entypo name={iconLabel} color="black" />
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
    fontSize: wp(3.5),
  },
});
