import React from "react";
import {
  StyleSheet,
  Text,
  View
} from "react-native";
import {  material, iOSColors } from "react-native-typography";
import Colors from "../../constants/Colors";

export default class SetScores extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { game, isReversed } = this.props;
    const { currentSet } = game;
    const _currentSet = currentSet === "Final" ? 6 : currentSet;

    return game.sets.map(function(set, i) {
      const leftScore = isReversed ? set.awayTeamScore : set.homeTeamScore;
      const rightScore = !isReversed ? set.awayTeamScore : set.homeTeamScore;
      const borderColor =
        i === _currentSet ? iOSColors.white : Colors.primaryLightColor;
      const backgroundColor =
        i === _currentSet ? Colors.primaryLightColor : Colors.primaryColor;

      return (
        <View
          key={i}
          style={{
            justifyContent: "center",
            alignContent: "center",
            marginRight: 5
          }}
        >
          <Text
            style={[
              material.body1White,
              {
                textAlign: "center",
                marginBottom: 5
              }
            ]}
          >
            Set {i}
          </Text>
          <View
            style={[
              {
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 2,
                borderRadius: 5,
                padding: 5,
                width: 65
              }
            ]}
          >
            <Text style={[material.body2White, { textAlign: "center" }]}>
              {leftScore} - {rightScore}
            </Text>
          </View>
        </View>
      );
    });
  }
}

const styles = StyleSheet.create({
  
});