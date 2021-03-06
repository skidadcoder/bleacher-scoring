import _ from "lodash";
import React from "react";
import firebase from "firebase";
import { ActivityIndicator, Alert, SafeAreaView, Text, View } from "react-native";
import { connect } from "react-redux";
import { AdMobBanner } from "expo";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { fetchUserGames, deleteGame, selectGame } from "../../actions/gameActions";
import { human, iOSColors } from "react-native-typography";
import HeaderBar from "../../components/HeaderBar";
import GlobalStyles from "../styles";
import GameList from "../../components/scoreboard/GameList";
import getEnvVars from "../../environment";

const initialState = { data: null, fetchError: null };

class ScorerGameListScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.authFirebaseListener = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        return this.props.navigation.navigate("Login");
      }
    });

    this.navListeners = [this.props.navigation.addListener("willFocus", this.componentWillFocus)];
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.gameDeleteSucceeded && nextProps.gameDeleteSucceeded) {
      this.props.fetchUserGames();
    }
  }

  componentWillFocus = () => {
    Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);
    const { currentUser } = firebase.auth();

    if (currentUser) {
      this.props.fetchUserGames();
    } else {
      this.props.navigation.navigate("Login");
    }
  };

  componentWillUnmount() {
    this.authFirebaseListener && this.authFirebaseListener();
    this.navListeners.forEach(navListener => navListener.remove());
  }

  onGamePress = game => e => {
    this.props.selectGame({ game });
    this.props.navigation.navigate("Scoring");
  };

  onGameDeletePress = game => {
    Alert.alert(
      "Are you sure?",
      "Deleting a game is permanent. This action cannot be undone.",
      [
        {
          text: "YES",
          onPress: () => {
            const { gameUid } = game;
            this.props.deleteGame({ gameUid });
          }
        },
        { text: "NO", onPress: () => { } }
      ],
      { cancelable: false }
    );
  };

  onGameEditPress = game => {
    this.props.selectGame({ game });
    this.props.navigation.navigate("EditGame");
  };

  renderLoading = () => {
    return (
      <View
        style={{
          margin: 20,
          justifyContent: "center",
          alignContent: "center"
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={[human.title3, { textAlign: "center", marginTop: 20 }]}>Fetching your games...</Text>
      </View>
    );
  };

  renderEmptyList = () => {
    return (
      <View
        style={{
          flex: 1,
          marginLeft: 20,
          marginRight: 20,
          justifyContent: "center",
          alignContent: "center"
        }}
      >
        <Text style={[human.title1, { marginBottom: 32, textAlign: "center" }]}>
          No games...yet!
        </Text>

        <Text style={[human.body, { lineHeight: 24, marginBottom: 16, textAlign: "center" }]}>
          To create a new game, tap the <MaterialIcons name="add" size={18} /> icon above.
        </Text>
      </View>
    );
  };

  render() {
    const { userGames, userGamesFetchStart } = this.props;
    const { hasAd } = this.state;

    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar hideBack={true} title="My Games" navigateTo="CreateGame" navigateToIcon="add" />

        <View style={[GlobalStyles.scrollView]}>
          {userGamesFetchStart && this.renderLoading()}

          {!userGamesFetchStart && userGames && userGames.length === 0 && this.renderEmptyList()}

          {!userGamesFetchStart && userGames && userGames.length > 0 && (
            <GameList
              data={userGames}
              disableRightSwipe={true}
              disableLeftSwipe={false}
              onGamePress={this.onGamePress}
              onGameDeletePress={this.onGameDeletePress}
              onGameEditPress={this.onGameEditPress}
            />
          )}
        </View>

        <View style={{ backgroundColor: iOSColors.white }}>
          <AdMobBanner
            bannerSize="smartBannerPortrait"
            adUnitID={getEnvVars.adMobUnitIDScorerGameList}
            testDeviceID="EMULATOR"
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { userGamesFetchStart } = state.userGames;
  const { gameDeleteSucceeded } = state.deleteGame;

  const userGames = _.sortBy(
    _.map(state.userGames.data, (val, uid) => {
      return { ...val, gameUid: uid };
    }),
    function (dateObj) {
      return new Date(dateObj.lastUpdate);
    }
  ).reverse();

  return { userGames, userGamesFetchStart, gameDeleteSucceeded };
};

export default connect(
  mapStateToProps,
  { fetchUserGames, selectGame, deleteGame }
)(ScorerGameListScreen);
