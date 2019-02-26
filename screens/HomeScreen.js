import _ from "lodash";
import React from "react";
import { Dimensions, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import { Linking } from "expo";
import MenuItem from "../components/MenuItem";
import GlobalStyles from "./styles";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orientation: "portrait",
      height: undefined,
      width: undefined
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    Linking.getInitialURL().then(url => {
      this.navigate(url);
    });

    this.navListeners = [this.props.navigation.addListener("willFocus", this.componentWillFocus)];
    Linking.addEventListener("url", this.handleOpenURL);
  }

  componentWillFocus = () => {
    Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);    
  };

  componentWillUnmount() {
    this.navListeners.forEach(navListener => navListener.remove());    
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  handleOpenURL = event => {
    this.navigate(event.url);
  };

  navigate = url => {
    const { queryParams } = Expo.Linking.parse(url);
    if (!_.isEmpty(queryParams)) {
      this.props.navigation.navigate("Scoreboard", queryParams);
    }
  };

  render() {
    const { orientation } = this.state;
    return (
      <View style={[GlobalStyles.screenRootView]}>
        <StatusBar barStyle="light-content" />

        <ImageBackground
          style={{
            flex: 1
          }}
          imageStyle={{ width: undefined, height: undefined }}
          source={require("../assets/images/home-screen.png")}
          resizeMode="contain"
        >
          <View style={{ flex: 1 }} />
          <View style={{ height: 150 }}>
            <View style={styles.menuButtonRow}>
              <MenuItem
                icon="counter"
                text="WATCH A GAME"
                onPress={() => this.props.navigation.navigate("GameSearchList")}
              />
              <MenuItem
                icon="clipboard-flow"
                text="KEEP SCORE"
                onPress={() => this.props.navigation.navigate("ScorerGameList")}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menuButtonRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center"
  }
});
