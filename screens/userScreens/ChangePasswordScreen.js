import firebase from "firebase";
import React from "react";
import { connect } from "react-redux";
import { Alert, Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { human, iOSColors } from "react-native-typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextField } from "react-native-material-textfield";
import HeaderBar from "../../components/HeaderBar";
import { AppButton } from "../../components/Buttons";
import GlobalStyles from "../styles";
import Colors from "../../constants/Colors";

const initialState = {
  passwordCurrentValid: false,
  passwordValid: false,
  passwordConfirmValid: false,
  formErrors: {
    passwordCurrent: "",
    password: "",
    passwordConfirm: ""
  },
  formValid: false,
  passwordCurrent: "",
  password: "",
  passwordConfirm: "",
  photoURL: "",
  width: 0,
  changePasswordProcessing: false,
  error: undefined
};

class ChangePasswordScreen extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.passwordCurrentRef = this.updateRef.bind(this, "passwordCurrent");
    this.onPasswordCurrentChange = this.onPasswordCurrentChange.bind(this);
    this.onSubmitPasswordCurrent = this.onSubmitPasswordCurrent.bind(this);

    this.passwordRef = this.updateRef.bind(this, "password");
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);

    this.passwordConfirmRef = this.updateRef.bind(this, "passwordConfirm");
    this.onPasswordConfirmChange = this.onPasswordConfirmChange.bind(this);
    this.onSubmitPasswordConfirm = this.onSubmitPasswordConfirm.bind(this);

    this.onUpdateButtonPress = this.onUpdateButtonPress.bind(this);

    this.state = initialState;
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  validateField(fieldName, value) {
    let formErrors = this.state.formErrors;
    let passwordCurrentValid = this.state.passwordCurrentValid;
    let passwordValid = this.state.passwordValid;
    let passwordConfirmValid = this.state.passwordConfirmValid;

    switch (fieldName) {
      case "passwordCurrent":
        passwordCurrentValid = value.length > 0;
        formErrors.passwordCurrent = passwordCurrentValid ? "" : "Your current password is required";
        break;
        break;
      case "password":
        passwordValid = value.length >= 6;
        formErrors.password = passwordValid ? "" : "The password must be at least 6 characters long";
        break;
      case "passwordConfirm":
        passwordConfirmValid = value === this.state.password;
        formErrors.passwordConfirm = passwordConfirmValid ? "" : "The passwords do not match.";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: formErrors,
        passwordCurrentValid: passwordCurrentValid,
        passwordValid: passwordValid,
        passwordConfirmValid: passwordConfirmValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.passwordCurrentValid && this.state.passwordValid && this.state.passwordConfirmValid
    });
  }

  componentDidMount() {
    this.mounted = true;

    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.navigation.navigate("Login");
      } else {
        if (this.mounted) {
          const { photoURL } = user;
          this.setState({ photoURL });
        }
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.changePasswordSucceeded) {
      nextProps.navigation.navigate("Settings");
    }
  }

  onUpdateButtonPress = () => {
    if (this.state.formValid) {
      this.setState({ changePasswordProcessing: true });

      const user = firebase.auth().currentUser;
      const { passwordCurrent, password } = this.state;
      const cred = firebase.auth.EmailAuthProvider.credential(user.email, passwordCurrent);

      user
        .reauthenticateAndRetrieveDataWithCredential(cred)
        .then(() => {
          return user.updatePassword(password);
        })
        .then(() => {
          Alert.alert(
            "Success!",
            "Your password has been changed. To complete this process, you must log back in with your new password.",
            [
              // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
              // {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              { text: "OK", onPress: () => firebase.auth().signOut() }
            ],
            { cancelable: false }
          );
          //firebase.auth().signOut();
        })
        .catch(error => {
          this.setState({ error: error.message, changePasswordProcessing: false });
        });
    }
  };

  onPasswordCurrentChange = text => {
    this.setState({ passwordCurrent: text });
    this.validateField("passwordCurrent", text);
  };

  onPasswordChange = text => {
    this.setState({ password: text });
    this.validateField("password", text);
  };

  onPasswordConfirmChange = text => {
    this.setState({ passwordConfirm: text });
    this.validateField("passwordConfirm", text);
  };

  onSubmitPasswordCurrent = () => {
    this.password.focus();
  };

  onSubmitPassword = () => {
    this.passwordConfirm.focus();
  };

  onSubmitPasswordConfirm = () => {
    this.passwordConfirm.blur();
    this.onUpdateButtonPress();
  };

  renderProfilePic = () => {
    const { password, email, photoURL } = this.state;
    if (photoURL) {
      return (
        <View
          style={[
            styles.profileImageContainer,
            {
              height: this.state.width / 2.25,
              width: this.state.width / 2.25,
              borderColor: iOSColors.white,
              borderWidth: 6,
              borderRadius: this.state.width / 2.25 / 2,
              overflow: "hidden"
            }
          ]}
        >
          <Image
            source={{ uri: photoURL }}
            resizeMode="contain"
            style={{
              height: this.state.width / 2.25,
              width: this.state.width / 2.25,
              borderRadius: this.state.width / 2.25 / 2
            }}
          />
        </View>
      );
    } else {
      const matches = password ? password.match(/\b(\w)/g) : ["B", "S"];
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
              height: this.state.width / 2.25,
              width: this.state.width / 2.25,
              borderRadius: this.state.width / 2.25 / 2
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
          {this.state.error && (
            <View
              style={{
                backgroundColor: iOSColors.lightGray2,
                padding: 30,
                marginBottom: 20
              }}
            >
              <Text style={[human.body, { color: iOSColors.red }]}>{this.state.error}</Text>
            </View>
          )}

          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onLayout={event => {
              this.setState({ width: event.nativeEvent.layout.width });
            }}
          >
            {this.renderProfilePic()}
          </View>

          <View style={{ flex: 2, margin: 20 }}>
            <TextField
              ref={this.passwordCurrentRef}
              label="Current Password"
              baseColor={iOSColors.gray}
              errorColor={iOSColors.white}
              textColor={iOSColors.lightGray}
              tintColor={Colors.secondaryColor}
              fontSize={20}
              labelFontSize={16}
              autoCapitalize="words"
              keyboardType="default"
              autoCorrect={false}
              returnKeyType="next"
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={false}
              error={this.state.formErrors.passwordCurrent}
              value={this.state.passwordCurrent}
              onChangeText={this.onPasswordCurrentChange}
              onSubmitEditing={this.onSubmitPasswordCurrent}
              secureTextEntry={true}
            />

            <TextField
              ref={this.passwordRef}
              label="Password"
              baseColor={iOSColors.gray}
              errorColor={iOSColors.white}
              textColor={iOSColors.lightGray}
              tintColor={Colors.secondaryColor}
              fontSize={20}
              labelFontSize={16}
              autoCapitalize="words"
              keyboardType="default"
              autoCorrect={false}
              returnKeyType="next"
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={false}
              error={this.state.formErrors.password}
              value={this.props.password}
              onChangeText={this.onPasswordChange}
              onSubmitEditing={this.onSubmitPassword}
              secureTextEntry={true}
            />

            <TextField
              ref={this.passwordConfirmRef}
              label="Confirm Password"
              baseColor={iOSColors.gray}
              errorColor={iOSColors.white}
              textColor={iOSColors.lightGray}
              tintColor={Colors.secondaryColor}
              fontSize={20}
              labelFontSize={16}
              autoCapitalize="words"
              keyboardType="default"
              autoCorrect={false}
              returnKeyType="done"
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={false}
              error={this.state.formErrors.passwordConfirm}
              value={this.props.passwordConfirm}
              onChangeText={this.onPasswordConfirmChange}
              onSubmitEditing={this.onSubmitPasswordConfirm}
              secureTextEntry={true}
            />

            <AppButton
              label="UPDATE"
              onPress={this.onUpdateButtonPress}
              style={{ marginTop: 40 }}
              isLoading={this.state.changePasswordProcessing}
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
  return {};
};

export default connect(
  mapStateToProps,
  {}
)(ChangePasswordScreen);
