import _ from "lodash";
import React from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { AdMobBanner } from "expo";
import { MaterialIcons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { fetchNearbyGames, saveGame, saveScorekeeper, selectGame, unSaveScorekeeper, unSaveGame } from "../../actions/gameActions";
import { human, iOSColors } from "react-native-typography";
import HeaderBar from "../../components/HeaderBar";
import GameList from "../../components/scoreboard/GameList";
import Colors from "../../constants/Colors";
import GlobalStyles from "../styles";
import getEnvVars from "../../environment";

const initialState = { fetchedAddress: null, fetchedLocation: null, data: null };

class GameSearchListScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {
    this.navListeners = [this.props.navigation.addListener("willFocus", this.componentWillFocus)];
  }

  componentWillFocus = () => {
    Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);
  };

  componentWillUnmount() {
    this.navListeners.forEach(navListener => navListener.remove());
  }

  onClearPress = () => {
    if (this.state.fetchedLocation) {
      this.setState(initialState);
    } else {
      this.props.navigation.navigate("Home");
    }
  };

  onGooglePlacesAutocompletePress(data, details) {
    const address = data.description || data.formatted_address || data.name;
    const { location } = details.geometry;
    this.setState({
      fetchedAddress: address,
      fetchedLocation: location
    });

    this.props.fetchNearbyGames(location);
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

  renderGooglePlacesInput = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder="Search cities..."
        minLength={3} // minimum length of text to search
        returnKeyType={"search"}
        listViewDisplayed={true} // true/false/undefined
        fetchDetails={true}
        renderDescription={row => row.description || row.formatted_address || row.name}
        onPress={(data, details = null) => this.onGooglePlacesAutocompletePress(data, details)}
        getDefaultValue={() => ""}
        query={{
          key: "AIzaSyB9PHRdkmkUmAgPYV-M2Pmf9T5CyIeHB4w",
          language: "en" // language of the results
        }}
        styles={{
          predefinedPlacesDescription: { color: Colors.secondaryColor, fontSize: 16 },
          textInputContainer: { height: 54 },
          textInput: { height: 38, fontSize: 16 },
          description: { fontSize: 16 }
        }}
        nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        filterReverseGeocodingByTypes={["locality", "administrative_area_level_3"]}
        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        //currentLocationLabel="Tap to search your current location"
        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      />
    );
  };

  renderList = () => {
    const { games, nearbyGameFetchStarted } = this.props;

    if (nearbyGameFetchStarted) {
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

    if (!nearbyGameFetchStarted && games && games.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            margin: 20,
            justifyContent: "center",
            alignContent: "center"
          }}
        >
          <Text style={[human.title3, { textAlign: "center" }]}>
            No games were found near {this.state.fetchedAddress}.
          </Text>

          <TouchableOpacity onPress={this.onClearPress}>
            <Text style={[human.title3, { color: Colors.secondaryColor, marginTop: 30, textAlign: "center" }]}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!nearbyGameFetchStarted && games && games.length > 0) {
      return (
        <GameList
          data={games}
          savedGames={this.props.savedGames}
          savedScorekeepers={this.props.savedScorekeepers}
          onGamePress={this.onGamePress}
          onGameFavoritePress={this.onGameFavoritePress}
          onGameUnfavoritePress={this.onGameUnfavoritePress}
          onScorekeeperFavoritePress={this.onScorekeeperFavoritePress}
          onScorekeeperUnfavoritePress={this.onScorekeeperUnfavoritePress}
        />
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Find Games" backAction={this.onClearPress} hideBack={!this.state.fetchedLocation} />

        {/* Tabs */}
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              borderBottomColor: Colors.secondaryColor,
              borderBottomWidth: 5
            }}
          >
            <MaterialIcons
              name="location-on"
              size={30}
              color={iOSColors.white}
              style={{ alignSelf: "center", marginBottom: 10 }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("SavedGameList")}>
              <MaterialIcons
                name="favorite-border"
                size={30}
                color={iOSColors.gray}
                style={{ alignSelf: "center", marginBottom: 10 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {this.state.fetchedLocation ? this.renderList() : this.renderGooglePlacesInput()}
        </View>

        {this.state.fetchedLocation && (
          <View style={{ backgroundColor: iOSColors.white }}>
            <AdMobBanner
              bannerSize="smartBannerPortrait"
              adUnitID={getEnvVars.adMobUnitIDSearchGameList}
              testDeviceID="EMULATOR"
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { savedGames, savedScorekeepers } = state;
  const { data, nearbyGameFetchStarted } = state.nearbyGames;
  const games = _.sortBy(
    _.map(data, (val, uid) => {
      return { ...val, gameUid: uid };
    }),
    function (dateObj) {
      return new Date(dateObj.lastUpdate);
    }
  ).reverse();

  return { savedGames, savedScorekeepers, games, nearbyGameFetchStarted };
};

export default connect(
  mapStateToProps,
  { fetchNearbyGames, saveScorekeeper, saveGame, selectGame, unSaveScorekeeper, unSaveGame }
)(GameSearchListScreen);

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    borderColor: iOSColors.gray,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center",
    margin: 10
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    marginLeft: 10
  },
  tabsContainerStyle: {},
  tabStyle: {
    borderColor: Colors.secondaryColor,
    backgroundColor: "transparent"
  },
  tabTextStyle: {
    color: Colors.secondaryColor
  },
  activeTabStyle: {
    backgroundColor: Colors.secondaryColor
  },
  activeTabTextStyle: {
    color: Colors.primaryColor
  },
  tabBadgeContainerStyle: {},
  activeTabBadgeContainerStyle: {},
  tabBadgeStyle: {},
  activeTabBadgeStyle: {}
});
