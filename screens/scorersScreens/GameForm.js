import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { TextField } from "react-native-material-textfield";
import { iOSColors } from "react-native-typography";
import { gamePropChange } from "../../actions/gameActions";
import Colors from "../../constants/Colors";

class GameForm extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.venueNameRef = this.updateRef.bind(this, "venueName");
    this.onSubmitVenueName = this.onSubmitVenueName.bind(this);

    this.homeTeamNameRef = this.updateRef.bind(this, "homeTeamName");
    this.onSubmitHomeTeamName = this.onSubmitHomeTeamName.bind(this);

    this.awayTeamNameRef = this.updateRef.bind(this, "awayTeamName");
    this.onSubmitAwayTeamName = this.onSubmitAwayTeamName.bind(this);
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  onSubmitVenueName = () => {
    this.venueName.blur();
  };

  onSubmitHomeTeamName = () => {
    this.awayTeamName.focus();
  };

  onSubmitAwayTeamName = () => {
    this.venueName.focus();
  };

  render() {
    const {
      homeTeamName,
      awayTeamName,
      venueName,
      gamePropChange
    } = this.props;

    return (
      <View>
        <TextField
          ref={this.homeTeamNameRef}
          label="Home team name"
          maxLength={30}
          characterRestriction={30}
          baseColor={iOSColors.gray}
          errorColor={Colors.secondaryColor}
          textColor={iOSColors.lightGray}
          tintColor={Colors.secondaryColor}
          fontSize={20}
          labelFontSize={16}
          autoCapitalize="words"
          keyboardType="default"
          returnKeyType="next"
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={false}
          value={homeTeamName}
          onChangeText={text =>
            gamePropChange({
              prop: "homeTeamName",
              value: text
            })
          }
          onSubmitEditing={this.onSubmitHomeTeamName}
        />

        <TextField
          ref={this.awayTeamNameRef}
          label="Away team name"
          maxLength={30}
          characterRestriction={30}
          baseColor={iOSColors.gray}
          errorColor={Colors.secondaryColor}
          textColor={iOSColors.lightGray}
          tintColor={Colors.secondaryColor}
          fontSize={20}
          labelFontSize={16}
          autoCapitalize="words"
          keyboardType="default"
          returnKeyType="next"
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={false}
          value={awayTeamName}
          onChangeText={text =>
            gamePropChange({
              prop: "awayTeamName",
              value: text
            })
          }
          onSubmitEditing={this.onSubmitAwayTeamName}
        />

        <TextField
          ref={this.venueNameRef}
          label="Venue name"
          maxLength={30}
          characterRestriction={30}
          baseColor={iOSColors.gray}
          errorColor={Colors.secondaryColor}
          textColor={iOSColors.lightGray}
          tintColor={Colors.secondaryColor}
          fontSize={20}
          labelFontSize={16}
          autoCapitalize="words"
          keyboardType="default"
          returnKeyType="done"
          enablesReturnKeyAutomatically={true}
          clearTextOnFocus={false}
          value={venueName}
          onChangeText={text =>
            gamePropChange({
              prop: "venueName",
              value: text
            })
          }
          onSubmitEditing={this.onSubmitVenueName}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { venueName } = state.gameForm;
  return { venueName };
};

export default connect(
  mapStateToProps,
  { gamePropChange }
)(GameForm);
