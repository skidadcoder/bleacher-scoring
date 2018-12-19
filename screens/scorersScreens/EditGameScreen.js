import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { ActivityIndicator, SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { human } from "react-native-typography";
import {
  gamePropChange,
  updateGame,
  resetGameForm
} from "../../actions/gameActions";
import HeaderBar from "../../components/HeaderBar";
import { AppButton } from "../../components/Buttons";
import GameForm from "./GameForm";
import GlobalStyles from "../styles";

class EditGameScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    _.each(this.props.selectedGame, (value, prop) => {
      this.props.gamePropChange({ prop, value });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gamePersistSucceeded) {
      nextProps.resetGameForm();
      this.props.navigation.goBack();
    }

    if (nextProps.gamePersistFailed) {
      alert("An error has occured. Please try again later.");
    }
  }

  onBackPress = () => {
    this.props.resetGameForm();
    this.props.navigation.goBack();
  };

  onEditGamePress = () => {
    const { venueName, homeTeamName, awayTeamName, gameUid } = this.props;

    this.props.updateGame({
      gameUid,
      venueName,
      homeTeamName,
      awayTeamName
    });
  };

  renderViewContent() {
    if (this.props.gamePersistStarted) {
      return (
        <View>
          <ActivityIndicator size="large" />
          <Text
            style={[human.title3White, { textAlign: "center", marginTop: 20 }]}
          >
            Saving your game...
          </Text>
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
        <AppButton
          label="UPDATE GAME"
          style={{ marginTop: 20 }}
          onPress={this.onEditGamePress}
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Edit" backAction={this.onBackPress} />

        <KeyboardAwareScrollView extraHeight={50}>
          {this.renderViewContent()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { gameUid } = state.selectedGame;
  const selectedGame = state.userGames.data[gameUid];

  const {
    venueName,
    homeTeamName,
    awayTeamName,
    gamePersistSucceeded,
    gamePersistStarted,
    gamePersistFailed
  } = state.gameForm;

  return {
    venueName,
    homeTeamName,
    awayTeamName,
    gameUid,
    selectedGame,
    gamePersistSucceeded,
    gamePersistStarted,
    gamePersistFailed
  };
};

export default connect(
  mapStateToProps,
  { gamePropChange, updateGame, resetGameForm }
)(EditGameScreen);
