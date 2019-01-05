import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { human, iOSColors } from "react-native-typography";
import Colors from "../constants/Colors";

export class AppButton extends React.Component {
  render() {
    const { disabled, icon, isLoading, label, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View
          style={[
            styles.button,
            disabled ? styles.disabledButton : styles.activeButton,
            this.props.style,
            { justifyContent: "center" }
          ]}
        >
          {isLoading && <ActivityIndicator />}

          {!!icon && (
            <Ionicons name={icon} size={22} style={disabled ? styles.disabledButtonText : styles.activeButtonText} />
          )}

          <Text style={[styles.buttonText, human.body, disabled ? styles.disabledButtonText : styles.activeButtonText]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export class BrandedButton extends React.Component {
  render() {
    const { buttonColor, disabled, imageSource, label, onPress, textColor } = this.props;

    return (
      <TouchableOpacity onPress={onPress} disabled={disabled}>
        <View style={[styles.button, this.props.style, { backgroundColor: buttonColor }]}>
          <Image
            source={imageSource}
            style={{ alignSelf: "center", width: 18, height: 18, marginRight: 24 }}
            resizeMode="contain"
          />

          <Text style={[human.body, { color: textColor }]}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    paddingLeft: 8,
    borderRadius: 5,
    flexDirection: "row",
    height: 40,
    alignItems: "center"
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
