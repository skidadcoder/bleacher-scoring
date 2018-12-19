import React from "react";
import { StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import firebase from "firebase";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./store";
import AppContainer from "./navigation/AppNavigator";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false
    };
  }

  componentDidMount() {
    Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.ALL);

    //Google Place API: AIzaSyDMoSbI-QRLp7llUH_Gqrwz4WnI-IXGjlY
    const config = {
      apiKey: "AIzaSyBx0dQOFs7EW0O4Fx5fu1LKCDDGFmfl9LQ",
      authDomain: "bleacher-scoring.firebaseapp.com",
      databaseURL: "https://bleacher-scoring.firebaseio.com",
      projectId: "bleacher-scoring",
      storageBucket: "bleacher-scoring.appspot.com",
      messagingSenderId: "843005735895"
    };
    firebase.initializeApp(config);
  }

  componentWillUnmount() {}

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <PersistGate loading={<AppLoading />} persistor={persistor}>
              <AppContainer />
          </PersistGate>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require("./assets/images/home-screen.png"),
        require("./assets/images/home-screen-landscape.png"),
        require("./assets/images/logo-light-blue.png"),
        require("./assets/images/scoring-walkthrough-end.png"),
        require("./assets/images/scoring-walkthrough-pin.png"),
        require("./assets/images/scoring-walkthrough-score.png"),
        require("./assets/images/scoring-walkthrough-swap.png")
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        ...Icon.MaterialIcons.font,
        ...Icon.MaterialCommunityIcons.font,
        scoreboard: require("./assets/fonts/scoreboard.ttf")
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});