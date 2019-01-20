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
      orientation: "portrait"
    };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    Linking.getInitialURL().then(url => {
      this.navigate(url);
    });

    Linking.addEventListener("url", this.handleOpenURL);
  }

  componentWillUnmount() {
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

  onDimensionChange = dimensions => {
    this.setOrientation(dimensions.window);
  };

  setOrientation = window => {
    const { height, width } = window;

    if (height >= width) {
      this.setState({ orientation: "portrait" });
    } else {
      this.setState({ orientation: "landscape" });
    }
  };

  render() {
    const { orientation } = this.state;

    return (
      <View style={[GlobalStyles.screenRootView]}>
        <StatusBar barStyle="light-content" />

        <View style={{ flex: 1 }}>
          <View style={{ flex: 3 }}>
            {orientation === "portrait" && (
              <ImageBackground
                style={{
                  flex: 1,
                  width: null,
                  height: null,
                  justifyContent: "center",
                  alignContent: "center",
                  padding: 20
                }}
                source={require("../assets/images/home-screen.png")}
              />
            )}

            {orientation === "landscape" && (
              <ImageBackground
                style={{
                  flex: 1,
                  width: null,
                  height: null,
                  justifyContent: "center",
                  alignContent: "center",
                  padding: 20
                }}
                source={require("../assets/images/home-screen-landscape.png")}
              />
            )}
          </View>

          <View style={{ flex: 1 }}>
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
        </View>
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
