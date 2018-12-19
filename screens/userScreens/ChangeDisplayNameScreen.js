import firebase from "firebase";
import React from "react";
import { connect } from "react-redux";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { iOSColors } from "react-native-typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextField } from "react-native-material-textfield";
import HeaderBar from "../../components/HeaderBar";
import { AppButton } from "../../components/Buttons";
import { displayNameChanged, updateDisplayName } from "../../actions/updateDisplayNameActions";
import GlobalStyles from "../styles";
import Colors from "../../constants/Colors";

const initialState = {
  displayNameValid: false,
  formErrors: {
    displayName: ""
  },
  formValid: false,
  displayName: "",
  email: "",
  photoURL: "",
  width: 0
};

class ChangeDisplayNameScreen extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.displayNameRef = this.updateRef.bind(this, "displayName");
    this.onDisplayNameChange = this.onDisplayNameChange.bind(this);
    this.onSubmitDisplayName = this.onSubmitDisplayName.bind(this);
    this.onUpdateButtonPress = this.onUpdateButtonPress.bind(this);

    this.state = initialState;
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  validateField(fieldName, value) {
    let formErrors = this.state.formErrors;
    let displayNameValid = this.state.displayNameValid;

    switch (fieldName) {
      case "displayName":
        displayNameValid = value.length > 0;
        formErrors.displayName = displayNameValid ? "" : "A display name is required";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: formErrors,
        displayNameValid: displayNameValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.displayNameValid
    });
  }

  componentDidMount() {
    this.mounted = true;

    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.navigation.navigate("Login");
      } else {
        if (this.mounted) {
          const { displayName, email, photoURL } = user;
          this.props.displayNameChanged(displayName);
          this.setState({ displayName, email, photoURL });
        }
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.changeDisplayNameSucceeded) {
      nextProps.navigation.navigate("Settings");
    }
  }

  onUpdateButtonPress = () => {
    const { displayName } = this.props;
    this.props.updateDisplayName({ displayName });
  };

  onDisplayNameChange = text => {
    this.props.displayNameChanged(text);
  };

  onSubmitDisplayName() {
    this.displayName.blur();
    this.onUpdateButtonPress();
  }

  renderProfilePic = () => {
    const { displayName, email, photoURL } = this.state;
    if (photoURL) {
      return (
        <View
          style={[
            styles.profileImageContainer,
            {
              height: this.state.width / 2,
              width: this.state.width / 2,
              borderColor: iOSColors.white,
              borderWidth: 6,
              borderRadius: this.state.width / 2 / 2,
              overflow: "hidden"
            }
          ]}
        >
          <Image
            source={{ uri: photoURL }}
            resizeMode="contain"
            style={{
              height: this.state.width / 2,
              width: this.state.width / 2,
              borderRadius: this.state.width / 2 / 2
            }}
          />
        </View>
      );
    } else {
      const matches = displayName ? displayName.match(/\b(\w)/g) : ["B", "S"];
      let acronym = undefined;
      if (matches.length > 1) {
        const firstWord = matches[0];
        const lastWord = matches[matches.length - 1];
        acronym = firstWord + lastWord;
      } else {
        acronym = matches.join("");
      }

      return (
        <View
          style={[
            styles.profileImageContainer,
            {
              height: this.state.width / 2,
              width: this.state.width / 2,
              borderRadius: this.state.width / 2 / 2
            }
          ]}
        >
          <Text style={styles.profileImage}>{acronym}</Text>
        </View>
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Display Name" />

        <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }} extraScrollHeight={50}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onLayout={event => {
              this.setState({ width: event.nativeEvent.layout.width });
            }}
          >
            {this.renderProfilePic()}
          </View>

          <View style={{ flex: 1, margin: 20 }}>
            <TextField
              ref={this.displayNameRef}
              label="Display Name"
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
              error={this.state.formErrors.displayName}
              value={this.props.displayName}
              onChangeText={this.onDisplayNameChange}
              onSubmitEditing={this.onSubmitDisplayName}
            />

            <AppButton
              label="UPDATE"
              onPress={this.onUpdateButtonPress}
              style={{ marginTop: 20 }}
              isLoading={this.props.changeDisplayNameStarted}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  profileImageContainer: {
    borderColor: iOSColors.white,
    borderWidth: 6,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: Colors.secondaryColor
  },
  profileImage: {
    color: iOSColors.white,
    fontSize: 80,
    textAlign: "center"
  }
});

const mapStateToProps = state => {
  const {
    displayName,
    changeDisplayNameStarted,
    changeDisplayNameSucceeded,
    changeDisplayNameFailed
  } = state.updateDisplayNameForm;

  return {
    displayName,
    changeDisplayNameStarted,
    changeDisplayNameSucceeded,
    changeDisplayNameFailed
  };
};

export default connect(
  mapStateToProps,
  { displayNameChanged, updateDisplayName }
)(ChangeDisplayNameScreen);
