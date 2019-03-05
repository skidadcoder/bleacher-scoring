import _ from "lodash";
import firebase from "firebase";
import React from "react";
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { AdMobBanner } from "expo";
import { fetchFavoriteGames, fetchFavoriteScorekeeperGames, saveGame, saveScorekeeper, selectGame, unSaveScorekeeper, unSaveGame } from "../../actions/gameActions";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { human, iOSColors } from "react-native-typography";
import HeaderBar from "../../components/HeaderBar";
import GameList from "../../components/scoreboard/GameList";
import Colors from "../../constants/Colors";
import GlobalStyles from "../styles";
import getEnvVars from "../../environment";

class SavedGameListScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.navListeners = [this.props.navigation.addListener("willFocus", this.componentWillFocus)];

    const gameUids = this.props.savedGames.map(g => g.gameUid);
    const uniqGameUids = _.uniq(gameUids);
    this.props.fetchFavoriteGames(uniqGameUids);

    const scorekeeperIds = this.props.savedScorekeepers.map(s => s.userId);
    const uniqScorekeeperIds = _.uniq(scorekeeperIds);
    this.props.fetchFavoriteScorekeeperGames(uniqScorekeeperIds);
  }

  componentWillFocus = () => {
    Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);
  };

  componentWillUnmount() {
    this.navListeners.forEach(navListener => navListener.remove());

    firebase
      .database()
      .ref(`/games`)
      .off();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.savedGames.length !== nextProps.savedGames.length) {
      const gameUids = nextProps.savedGames.map(g => g.gameUid);
      const uniqGameUids = _.uniq(gameUids);
      this.props.fetchFavoriteGames(uniqGameUids);
    }

    if (this.props.savedScorekeepers.length !== nextProps.savedScorekeepers.length) {
      const scorekeeperIds = nextProps.savedScorekeepers.map(s => s.userId);
      const uniqScorekeeperIds = _.uniq(scorekeeperIds);
      this.props.fetchFavoriteScorekeeperGames(uniqScorekeeperIds);
    }
  }

  onGamePress = game => e => {
    this.props.selectGame({ game });
    this.props.navigation.navigate("Scoreboard");
  };

  onGameFavoritePress = game => {
    this.props.saveGame({ game });
  };

  onGameUnfavoritePress = game => {
    const { gameUid } = game;
    this.props.unSaveGame({ gameUid });
  };

  onScorekeeperFavoritePress = game => {
    const { userId, displayName } = game;
    const scorekeeper = { userId: userId, displayName: displayName };
    this.props.saveScorekeeper({ scorekeeper });
  }

  onScorekeeperUnfavoritePress = game => {
    const { userId } = game;
    this.props.unSaveScorekeeper({ userId });
  }

  renderList = () => {
    const { games, favoriteGamesFetchStarted, favoriteScorekeeperGamesFetchStarted } = this.props;

    if (favoriteGamesFetchStarted || favoriteScorekeeperGamesFetchStarted) {
      return (
        <View
          style={{
            margin: 20,
            justifyContent: "center",
            alignContent: "center"
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={[human.title3, { textAlign: "center", marginTop: 30 }]}>Fetching games...</Text>
        </View>
      );
    }

    if (!favoriteGamesFetchStarted && !favoriteScorekeeperGamesFetchStarted) {
      if (games.length === 0) {
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

            <Text style={[human.body, { lineHeight: 24, textAlign: "center" }]}>
              To get started, tap the <MaterialIcons name="location-searching" size={18} /> icon above to search for games by city.
            </Text>

            <Text style={[human.body, { lineHeight: 24, marginBottom: 16, textAlign: "center" }]}>
              When you watch a game, it and others like it will be listed here.
            </Text>
          </View>
        );
      } else {
        return (
          <GameList
            data={games}
            disableRightSwipe={true}
            disableLeftSwipe={false}
            savedGames={this.props.savedGames}
            savedScorekeepers={this.props.savedScorekeepers}
            onGamePress={this.onGamePress}
            onGameUnfavoritePress={this.onGameUnfavoritePress}
            onScorekeeperUnfavoritePress={this.onScorekeeperUnfavoritePress}
          />
        );
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Games" hideBack={true} />

        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              borderBottomColor: Colors.secondaryColor,
              borderBottomWidth: 5
            }}
          >
            <MaterialIcons
              name="favorite-border"
              size={32}
              color={iOSColors.white}
              style={{ alignSelf: "center", marginBottom: 8 }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("GameSearchList")}>
              <MaterialIcons
                name="location-searching"
                size={32}
                color={iOSColors.gray}
                style={{ alignSelf: "center", marginBottom: 8 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[GlobalStyles.scrollView]}>{this.renderList()}</View>

        <View style={{ backgroundColor: iOSColors.white }}>
          <AdMobBanner
            bannerSize="smartBannerPortrait"
            adUnitID={getEnvVars.adMobUnitIDSavedGameList}
            testDeviceID="EMULATOR"
          />
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { favoriteGames, favoriteScorekeeperGames, savedGames, savedScorekeepers } = state;
  const { favoriteGamesFetchStarted } = favoriteGames;
  const { favoriteScorekeeperGamesFetchStarted } = favoriteScorekeeperGames;

  const _favoriteGames = _.map(favoriteGames.data, (val, uid) => {
    return { ...val, gameUid: uid };
  });

  const _favoriteScorekeeperGames = _.map(favoriteScorekeeperGames.data, (val, uid) => {
    return { ...val, gameUid: uid };
  });

  const _games = [..._favoriteGames, ..._favoriteScorekeeperGames];
  const games = _.sortBy(_.uniqBy(_games, "gameUid"), function (dateObj) {
    return new Date(dateObj.lastUpdate);
  }).reverse();

  return { savedGames, savedScorekeepers, games, favoriteGamesFetchStarted, favoriteScorekeeperGamesFetchStarted };
};

export default connect(
  mapStateToProps,
  { saveScorekeeper, saveGame, selectGame, unSaveScorekeeper, unSaveGame, fetchFavoriteGames, fetchFavoriteScorekeeperGames }
)(SavedGameListScreen);
