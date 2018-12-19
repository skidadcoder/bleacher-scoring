import _ from "lodash";
import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import { Location } from "expo";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { human, iOSColors } from "react-native-typography";
import { updateGameLocation } from "../../actions/gameActions";
import HeaderBar from "../../components/HeaderBar";
import Colors from "../../constants/Colors";
import GlobalStyles from "../styles";

class ScoringLocationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedLocation: undefined
    };
  }

  componentDidMount() {
    this._mounted = true;
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  onPinToLocationPress = () => {
    const { gameUid } = this.props;
    const { fetchedLocation } = this.state;

    if (this._mounted) {
      this.props.updateGameLocation({
        gameUid,
        location: fetchedLocation
      });

      this.state.fetchedLocation = undefined;
      this.props.navigation.navigate("Scoring");
    }
  };

  onGooglePlacesAutocompletePress(data, details) {
    const { location } = details.geometry;
    const address = details.formatted_address;
    const fetchedLocation = Object.assign({ address, location });

    this.setState({
      ...this.state,
      fetchedLocation
    });
  }

  renderGooglePlacesInput = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder="Search locations..."
        minLength={3} // minimum length of text to search
        autoFocus={true}
        returnKeyType={"search"} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        listViewDisplayed={false} // true/false/undefined
        fetchDetails={true}
        renderDescription={row => row.description || row.formatted_address || row.name}
        onPress={(data, details = null) => this.onGooglePlacesAutocompletePress(data, details)}
        getDefaultValue={() => ""}
        query={{
          key: "AIzaSyDMoSbI-QRLp7llUH_Gqrwz4WnI-IXGjlY",
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
        currentLocation={true} // Will add a "Current location" button at the top of the predefined places list
        currentLocationLabel="Current location"
        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar
          title="Pin to location"
          confirmAction={this.state.fetchedLocation ? () => this.onPinToLocationPress() : undefined}
        />
        <View style={{ flex: 1, backgroundColor: "#fff" }}>{this.renderGooglePlacesInput()}</View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: "row",
    borderColor: iOSColors.gray,
    padding: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignContent: "center"
  },
  textInputContainerBottom: {
    borderWidth: 1
  },
  textInputContainerTop: {
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  textInput: {
    flex: 1,
    backgroundColor: "#fff",
    height: 40,
    fontSize: 16,
    marginLeft: 10
  }
});

const mapStateToProps = state => {
  const { gameUid } = state.selectedGame;
  const game = state.userGames[gameUid];

  const { gameScorePersistStarted, gameScorePersistSucceeded } = state.gameScore;

  return {
    gameUid,
    game,
    gameScorePersistStarted,
    gameScorePersistSucceeded
  };
};

export default connect(
  mapStateToProps,
  { updateGameLocation }
)(ScoringLocationScreen);
