import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { human } from "react-native-typography";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, icon, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress} style={{flex: 1}}>
        <View style={styles.menuButtonContainer}>
          <MaterialCommunityIcons
            name={icon}
            size={40}
            color={Colors.secondaryColor}
            style={{ alignSelf: "center", marginBottom: 10 }}
          />
          <Text style={[human.headlineWhite, { textAlign: "center" }]}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  menuButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center"
  }
});
