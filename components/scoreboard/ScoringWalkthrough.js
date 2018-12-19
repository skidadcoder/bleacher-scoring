import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { iOSColors } from "react-native-typography";
import Swiper from "../Swiper";
import Colors from "../../constants/Colors";

export default class ScoringWalkthrough extends React.PureComponent {
  render() {
    const { onSkipPressed } = this.props;

    return (
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        dotColor={iOSColors.white}
        activeDotColor={Colors.primaryColor}
        loop={false}
        onIndexChanged={this.onIndexChanged}
        onSkipPressed={onSkipPressed}
      >
        <View style={styles.slide}>
          <Image style={styles.image} source={require("../../assets/images/scoring-walkthrough-pin.png")} />
        </View>
        <View style={styles.slide}>
          <Image style={styles.image} source={require("../../assets/images/scoring-walkthrough-score.png")} />
        </View>
        <View style={styles.slide}>
          <Image style={styles.image} source={require("../../assets/images/scoring-walkthrough-swap.png")} />
        </View>
        <View style={styles.slide}>
          <Image style={styles.image} source={require("../../assets/images/scoring-walkthrough-end.png")} />
        </View>
      </Swiper>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
    backgroundColor: Colors.secondaryColor
  },
  image: {
    flex: 1,
    width: null,
    resizeMode: "contain"
  }
});
