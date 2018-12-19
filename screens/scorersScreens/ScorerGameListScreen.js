import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { fetchUserGames, deleteGame, selectGame } from "../../actions/gameActions";
import { ActivityIndicator, Alert, Button, SafeAreaView, ScrollView, Text, View } from "react-native";
import firebase from "firebase";
import { human } from "react-native-typography";
import HeaderBar from "../../components/HeaderBar";
import GlobalStyles from "../styles";
import GameList from "../../components/scoreboard/GameList";

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
    this.props.fetchUserGames();
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
        { text: "NO", onPress: () => {} }
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
      <View style={{ margin: 20, justifyContent: "center", alignContent: "center" }}>
        <Text style={[human.body, { marginBottom: 10, textAlign: "center" }]}>
          You have not created any games. Click the "+" icon to create a game.
        </Text>
      </View>
    );
  };

  render() {
    const { userGames, userGamesFetchStart } = this.props;

    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar hideBack={true} title="My Games" navigateTo="CreateGame" navigateToIcon="add" />

        <ScrollView style={[GlobalStyles.scrollView]}>
          {userGamesFetchStart && this.renderLoading()}

          {!userGamesFetchStart && userGames && userGames.length === 0 && this.renderEmptyList()}

          {!userGamesFetchStart && userGames && userGames.length > 0 && (
            <GameList
              data={userGames}
              onGamePress={this.onGamePress}
              onGameDeletePress={this.onGameDeletePress}
              onGameEditPress={this.onGameEditPress}
            />
          )}
        </ScrollView>
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
    function(dateObj) {
      return new Date(dateObj.lastUpdate);
    }
  ).reverse();

  return { userGames, userGamesFetchStart, gameDeleteSucceeded };
};

export default connect(
  mapStateToProps,
  { fetchUserGames, selectGame, deleteGame }
)(ScorerGameListScreen);
