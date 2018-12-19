import React from "react";
import { Animated, Easing, Text } from "react-native";
import { human } from "react-native-typography";

export default class AnimatedTeamName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flipAnimatedValue: new Animated.Value(0)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.teamName !== nextProps.teamName) {
      this.state.flipAnimatedValue.setValue(0);
      Animated.timing(this.state.flipAnimatedValue, {
        toValue: 360,
        duration: 700,
        easing: Easing.bounce,
        useNativeDriver: true
      }).start();
    }
  }

  render() {
    const { teamName } = this.props;

    const textFlip = this.state.flipAnimatedValue.interpolate({
      inputRange: [0, 90, 360],
      outputRange: ["0deg", "180deg", "360deg"]
    });

    return (
      <Animated.Text
        numberOfLines={2}
        style={[
          human.headlineWhite,
          {
            backfaceVisibility: "hidden",
            textAlign: "center",
            transform: [{ rotateY: textFlip }]
          }
        ]}
      >
        {teamName}
      </Animated.Text>
    );
  }
}
