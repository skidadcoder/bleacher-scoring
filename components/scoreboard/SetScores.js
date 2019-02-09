import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { material, iOSColors } from "react-native-typography";
import Colors from "../../constants/Colors";

export default class SetScores extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSets() {
    const { game, reversed } = this.props;
    const { currentSet } = game;
    const _currentSet = currentSet === "Final" ? 6 : currentSet;

    return game.sets.map(function (set, i) {
      const leftScore = reversed ? set.awayTeamScore : set.homeTeamScore;
      const rightScore = !reversed ? set.awayTeamScore : set.homeTeamScore;
      const borderColor = i === _currentSet ? iOSColors.white : Colors.primaryLightColor;
      const backgroundColor = i === _currentSet ? Colors.primaryLightColor : Colors.primaryColor;

      return (
        <View key={i} style={{ justifyContent: "center", alignItems: "center", marginLeft: 2 }}>
          <Text style={[material.body1White, { textAlign: "center", marginBottom: 5 }]}>Set {i}</Text>
          <View
            style={[
              {
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 2,
                borderRadius: 4,
                padding: 4,
                paddingLeft: 2,
                paddingRight: 2,
                width: 72
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

  render() {
    return <View style={{
      flex: 1, 
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 8, 
      marginBottom: 16, 
      //borderTopColor: iOSColors.midGray, 
      //borderTopWidth: 2, 
      paddingTop: 8
    }}>{this.renderSets()}</View>;
  }
}

const styles = StyleSheet.create({});
