import { Text } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

type CustomLabelProp = {
  text: string;
};

const DrawerLabel: React.FC<CustomLabelProp> = ({ text }) => (
  <Text style={{ fontFamily: "Inconsolata-Regular", fontSize: hp(2.5) }}>
    {text}
  </Text>
);

const AppTitle: React.FC<CustomLabelProp> = ({ text }) => (
  <Text
    style={{
      fontFamily: "Inconsolata-ExtraBold",
      fontSize: hp(6),
      textAlign: "center",
    }}
  >
    {text}
  </Text>
);

const UserName: React.FC<CustomLabelProp> = ({ text }) => (
  <Text
    style={{
      fontFamily: "Inconsolata-ExtraLight",
      fontSize: hp(1.8),
      textAlign: "center",
      marginTop: hp(1),
    }}
  >
    {text}
  </Text>
);

export { DrawerLabel, AppTitle, UserName };
