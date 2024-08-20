import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Entypo from "@expo/vector-icons/Entypo";

type SearchBarProp = TextInputProps;

const SearchBar: React.FC<SearchBarProp> = (props) => {
  return (
    <View style={styles.searchBarContainer}>
      <Entypo
        name="magnifying-glass"
        size={24}
        color="black"
        style={{ marginHorizontal: wp(2) }}
      />
      <TextInput
        style={styles.textInputStyle}
        placeholder="Search a task..."
        {...props}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchBarContainer: {
    marginHorizontal: wp(10),
    marginVertical: hp(2),
    borderRadius: wp(2),
    flexDirection: "row",
    alignItems: "center",
    padding: wp(0.5),
    borderWidth: wp(0.5),
    borderColor: "black",
  },
  textInputStyle: {
    marginHorizontal: wp(3),
    fontFamily: "Inconsolata-Light",
    fontSize: hp(2.5),
    width: "auto",

    flex: 1,
  },
});
