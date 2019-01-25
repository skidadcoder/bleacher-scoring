import _ from "lodash";
import React from "react";
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { AdMobBanner } from "expo";
import { saveGame, selectGame, unSaveGame, fetchFavoriteGames } from "../../actions/gameActions";
import { MaterialIcons } from "@expo/vector-icons";
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
    const gameUids = this.props.savedGames.map(g => g.gameUid);
    this.props.fetchFavoriteGames(gameUids);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.savedGames.length !== nextProps.savedGames.length) {
      const gameUids = nextProps.savedGames.map(g => g.gameUid);
      this.props.fetchFavoriteGames(gameUids);
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

  renderList = () => {
    const { games, favoriteGamesFetchStarted } = this.props;

    if (favoriteGamesFetchStarted) {
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

    if (!favoriteGamesFetchStarted && games.length === 0) {
      return (
        <View
          style={{
            margin: 20,
            justifyContent: "center",
            alignContent: "center"
          }}
        >
          <Text style={[human.body]}>
            You have not saved any games. Games can be saved from the "Find Games" or "Scoreboard" screens.
          </Text>
        </View>
      );
    }

    if (!favoriteGamesFetchStarted && games.length > 0) {
      return (
        <GameList
          data={games}
          savedGames={this.props.savedGames}
          onGamePress={this.onGamePress}
          onGameFavoritePress={this.onGameFavoritePress}
          onGameUnfavoritePress={this.onGameUnfavoritePress}
        />
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Games" backAction={() => this.props.navigation.navigate("Home")} />

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("GameSearchList")}>
              <MaterialIcons
                name="location-on"
                size={30}
                color={iOSColors.gray}
                style={{ alignSelf: "center", marginBottom: 10 }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              borderBottomColor: Colors.secondaryColor,
              borderBottomWidth: 5
            }}
          >
            <MaterialIcons
              name="favorite-border"
              size={30}
              color={iOSColors.white}
              style={{ alignSelf: "center", marginBottom: 10 }}
            />
          </View>
        </View>

        <View style={[GlobalStyles.scrollView]}>{this.renderList()}</View>

        <AdMobBanner
          bannerSize="fullBanner"
          adUnitID={getEnvVars.adMobUnitIDSavedGameList}
          testDeviceID="EMULATOR"
          onDidFailToReceiveAdWithError={this.bannerError}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { savedGames, favoriteGames } = state;
  const { data, favoriteGamesFetchStarted } = favoriteGames;
  const games = _.sortBy(
    _.map(data, (val, uid) => {
      return { ...val, gameUid: uid };
    }),
    function(dateObj) {
      return new Date(dateObj.lastUpdate);
    }
  ).reverse();

  return { savedGames, games, favoriteGamesFetchStarted };
};

export default connect(
  mapStateToProps,
  { saveGame, selectGame, unSaveGame, fetchFavoriteGames }
)(SavedGameListScreen);
