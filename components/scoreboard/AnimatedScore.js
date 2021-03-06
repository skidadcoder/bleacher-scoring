import React from "react";
import { Animated, Easing, View } from "react-native";
import Colors from "../../constants/Colors";
import { human, iOSColors } from "react-native-typography";

export default class AnimatedScore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flipAnimatedValue: new Animated.Value(0),
      colorAnimatedValue: new Animated.Value(0)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.score !== nextProps.score) {
      this.state.flipAnimatedValue.setValue(0);
      Animated.timing(this.state.flipAnimatedValue, {
        toValue: 360,
        duration: 700,
        easing: Easing.bounce
      }).start();

      this.state.colorAnimatedValue.setValue(0);
      Animated.timing(this.state.colorAnimatedValue, {
        toValue: 150,
        duration: 700
      }).start();
    }
  }

  render() {
    const { score, style } = this.props;

    const textFlip = this.state.flipAnimatedValue.interpolate({
      inputRange: [0, 90, 360],
      outputRange: ["0deg", "180deg", "360deg"]
    });

    const colorShift = this.state.colorAnimatedValue.interpolate({
      inputRange: [0, 10, 145, 150],
      outputRange: [
        Colors.scoreColorWhite,
        Colors.scoreColorYellow,
        Colors.scoreColorYellow,
        Colors.scoreColorWhite
      ]
    });

    return (
      <View style={{
        backgroundColor: Colors.primaryDarkColor,
        borderColor: iOSColors.white,
        borderWidth: 2,
        borderRadius: 8,
        margin: 4,
        paddingBottom: 8,
        paddingTop: 8
      }}>
        <Animated.Text
          style={[
            {
              color: iOSColors.white,
              backfaceVisibility: "hidden",
              textAlign: "center",
              //transform: [{ rotateY: textFlip }, { perspective: 1000 }]
            },
            style
          ]}
        >
          {score}
        </Animated.Text>
      </View>
    );
  }
}
