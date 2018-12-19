import React from "react";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { human } from "react-native-typography";
import { createGame, resetGameForm, selectGame } from "../../actions/gameActions";
import HeaderBar from "../../components/HeaderBar";
import { AppButton } from "../../components/Buttons";
import GameForm from "./GameForm";
import GlobalStyles from "../styles";

class CreateGameScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.gamePersistSucceeded) {
      this.props.resetGameForm();

      const { game } = nextProps;
      this.props.selectGame({ game });
      this.props.navigation.navigate("Scoring", { navigateBack: "ScorerGameList" });
    }

    if (nextProps.gamePersistFailed) {
      alert("An error has occured. Please try again later.");
    }
  }

  onBackPress = () => {
    this.props.resetGameForm();
    this.props.navigation.goBack();
  };

  onCreateGamePress = () => {
    const { venueName, homeTeamName, awayTeamName } = this.props;

    this.props.createGame({
      venueName,
      homeTeamName,
      awayTeamName
    });
  };

  renderViewContent() {
    if (this.props.gamePersistStarted) {
      return (
        <View
          style={{
            margin: 20,
            justifyContent: "center",
            alignContent: "center"
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={[human.title3White, { textAlign: "center", marginTop: 20 }]}>Saving your game...</Text>
        </View>
      );
    }

    return (
      <View
        style={{
          margin: 20,
          justifyContent: "center",
          alignContent: "center"
        }}
      >
        <GameForm {...this.props} />
        <AppButton label="CREATE GAME" style={{ marginTop: 20 }} onPress={this.onCreateGamePress} />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Create a game" backAction={this.onBackPress} />

        <KeyboardAwareScrollView extraHeight={50}>{this.renderViewContent()}</KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const {
    game,
    venueName,
    homeTeamName,
    awayTeamName,
    gamePersistStarted,
    gamePersistSucceeded,
    gamePersistFailed
  } = state.gameForm;

  return {
    game,
    venueName,
    homeTeamName,
    awayTeamName,
    gamePersistStarted,
    gamePersistFailed,
    gamePersistSucceeded
  };
};

export default connect(
  mapStateToProps,
  { createGame, resetGameForm, selectGame }
)(CreateGameScreen);
