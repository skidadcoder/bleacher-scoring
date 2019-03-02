import React from "react";
import { StyleSheet, YellowBox } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import firebase from "firebase";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { persistor, store } from "./store";
import AppContainer from "./navigation/AppNavigator";
import getEnvVars from "./environment";
 
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false
    };
  }

  componentDidMount() {
    YellowBox.ignoreWarnings(['Setting a timer']);    
    Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);

    const config = {
      apiKey: "AIzaSyBfskI7Ziimj-JwCushuVthGfWh1JMKtPs",
      authDomain: "bleacher-tech.firebaseapp.com",
      databaseURL: getEnvVars.databaseUrl,
      projectId: "bleacher-tech",
      storageBucket: "bleacher-tech.appspot.com",
      //messagingSenderId: "843005735895"
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
        require("./assets/images/f-logo.png"),
        require("./assets/images/g-logo.png"),
        require("./assets/images/home-screen.png"),
        require("./assets/images/logo-light-blue.png"),
        require("./assets/images/scoring-walkthrough-end.png"),
        require("./assets/images/scoring-walkthrough-pin.png"),
        require("./assets/images/scoring-walkthrough-score.png"),
        require("./assets/images/scoring-walkthrough-swap.png"),
        require("./assets/sounds/whistle-short.mp3")
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
