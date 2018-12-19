import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { human, iOSColors } from "react-native-typography";
import Colors from "../constants/Colors";

export class AppButton extends React.Component {
  render() {
    const { disabled, icon, isLoading, label, onPress, textStyle } = this.props;

    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View
          style={[
            styles.button,
            disabled ? styles.disabledButton : styles.activeButton,
            this.props.style
          ]}
        >
          { isLoading && <ActivityIndicator />}

          <Ionicons
            name={icon}
            size={22}
            style={
              disabled ? styles.disabledButtonText : styles.activeButtonText
            }
          />

          <Text
            style={[
              styles.buttonText,
              human.body,
              disabled ? styles.disabledButtonText : styles.activeButtonText,
              textStyle
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center"
  },
  activeButton: {
    backgroundColor: Colors.secondaryColor
  },
  disabledButton: {
    backgroundColor: Colors.buttonDisabledBackgroundColor
  },
  buttonText: {
    marginLeft: 10,
    textAlign: "center"
  },
  activeButtonText: {
    color: iOSColors.white
  },
  disabledButtonText: {
    color: iOSColors.gray
  }
});
