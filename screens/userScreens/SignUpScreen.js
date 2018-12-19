import React from "react";
import {
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { human, iOSColors } from "react-native-typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderBar from "../../components/HeaderBar";
import { TextField } from "react-native-material-textfield";
import {
  displayNameChanged,
  emailChanged,
  passwordChanged,
  confirmPasswordChanged,
  signUpUser
} from "../../actions/signUpActions";

import { AppButton } from "../../components/Buttons";
import Colors from "../../constants/Colors";
import GlobalStyles from "../styles";

const initialState = {
  passwordSecureTextEntry: true,
  confirmPasswordSecureTextEntry: true,
  displayNameValid: false,
  emailAddressValid: false,
  passwordValid: false,
  confirmPasswordValid: false,
  formErrors: {
    displayName: "",
    emailAddress: "",
    password: "",
    confirmPassword: ""
  },
  formValid: false
};

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props);

    this.emailAddressRef = this.updateRef.bind(this, "emailAddress");
    this.onEmailAdressChange = this.onEmailAdressChange.bind(this);
    this.onSubmitEmailAddress = this.onSubmitEmailAddress.bind(this);

    this.displayNameRef = this.updateRef.bind(this, "displayName");
    this.onDisplayNameChange = this.onDisplayNameChange.bind(this);
    this.onSubmitDisplayName = this.onSubmitDisplayName.bind(this);

    this.passwordRef = this.updateRef.bind(this, "password");
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);
    this.onPasswordAccessoryPress = this.onPasswordAccessoryPress.bind(this);

    this.confirmPasswordRef = this.updateRef.bind(this, "confirmPassword");
    this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
    this.onSubmitConfirmPassword = this.onSubmitConfirmPassword.bind(this);
    this.onConfirmPasswordAccessoryPress = this.onConfirmPasswordAccessoryPress.bind(this);

    this.state = initialState;
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  validateField(fieldName, value) {
    let formErrors = this.state.formErrors;
    let displayNameValid = this.state.displayNameValid;
    let emailAddressValid = this.state.emailAddressValid;
    let passwordValid = this.state.passwordValid;
    let confirmPasswordValid = this.state.confirmPasswordValid;

    switch (fieldName) {
      case "displayName":
        displayNameValid = value.length > 0;
        formErrors.displayName = displayNameValid ? "" : "A display name is required";
        break;
      case "emailAddress":
        emailAddressValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        formErrors.emailAddress = emailAddressValid ? "" : "The email address is not valid";
        break;
      case "password":
        passwordValid = value.length >= 6;
        formErrors.password = passwordValid ? "" : "A password at least 6 characaters long is required";

        confirmPasswordValid = value === this.props.confirmPassword;
        formErrors.confirmPassword = confirmPasswordValid ? "" : "The passwords do not match";
        break;
      case "confirmPassword":
        confirmPasswordValid = value === this.props.password;
        formErrors.confirmPassword = confirmPasswordValid ? "" : "The passwords do not match";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: formErrors,
        displayNameValid: displayNameValid,
        emailAddressValid: emailAddressValid,
        passwordValid: passwordValid,
        confirmPasswordValid: confirmPasswordValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.displayNameValid &&
        this.state.emailAddressValid &&
        this.state.passwordValid &&
        this.state.confirmPasswordValid
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSuccess) {
      this.props.navigation.navigate("Home");
    }
  }

  onSubmitDisplayName() {
    this.emailAddress.focus();
  }

  onSubmitEmailAddress() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.confirmPassword.focus();
  }

  onSubmitConfirmPassword() {
    this.confirmPassword.blur();
  }

  onPasswordAccessoryPress = () => {
    this.setState(({ passwordSecureTextEntry }) => ({
      passwordSecureTextEntry: !passwordSecureTextEntry
    }));
  };

  onConfirmPasswordAccessoryPress = () => {
    this.setState(({ confirmPasswordSecureTextEntry }) => ({
      confirmPasswordSecureTextEntry: !confirmPasswordSecureTextEntry
    }));
  };

  onDisplayNameChange(text) {
    this.validateField("displayName", text);
    this.props.displayNameChanged(text);
  }

  onEmailAdressChange(text) {
    this.validateField("emailAddress", text);
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.validateField("password", text);
    this.props.passwordChanged(text);
  }

  onConfirmPasswordChange(text) {
    this.validateField("confirmPassword", text);
    this.props.confirmPasswordChanged(text);
  }

  onButtonPress() {
    this.confirmPassword.blur();
    const { email, password, displayName } = this.props;
    this.props.signUpUser({ email, password, displayName });
  }

  renderPasswordAccessory = () => {
    let { passwordSecureTextEntry } = this.state;

    let name = passwordSecureTextEntry ? "visibility" : "visibility-off";

    return (
      <MaterialIcons
        size={24}
        name={name}
        color={iOSColors.midGray}
        onPress={this.onPasswordAccessoryPress}
        suppressHighlighting
      />
    );
  };

  renderConfirmPasswordAccessory = () => {
    let { confirmPasswordSecureTextEntry } = this.state;

    let name = confirmPasswordSecureTextEntry ? "visibility" : "visibility-off";

    return (
      <MaterialIcons
        size={24}
        name={name}
        color={iOSColors.midGray}
        onPress={this.onConfirmPasswordAccessoryPress}
        suppressHighlighting
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="New Account" navigateBack="Login" />

        <KeyboardAwareScrollView extraHeight={200} extraScrollHeight={50} keyboardShouldPersistTaps="handled">
          {this.props.error.length > 0 && (
            <View
              style={{
                backgroundColor: iOSColors.lightGray2,
                padding: 30,
                marginBottom: 20
              }}
            >
              <Text style={[human.body, { color: iOSColors.red }]}>{this.props.error}</Text>
            </View>
          )}

          <View style={{ marginLeft: 30, marginRight: 30 }}>
            <View style={{ padding: 20 }}>
              <Image
                source={require("../../assets/images/logo-light-blue.png")}
                style={{
                  alignSelf: "center",
                  width: Dimensions.get("window").width - 150,
                  height: (Dimensions.get("window").width - 150) * 0.5
                }}
                resizeMode="contain"
              />
            </View>

            <View style={{ flex: 1 }}>
              <TextField
                ref={this.displayNameRef}
                label="Display name"
                baseColor={iOSColors.gray}
                errorColor={iOSColors.white}
                textColor={iOSColors.lightGray}
                tintColor={Colors.secondaryColor}
                fontSize={18}
                labelFontSize={14}
                autoCapitalize="words"
                keyboardType="default"
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
                clearTextOnFocus={false}
                error={this.state.formErrors.displayName}
                value={this.props.displayName}
                onChangeText={this.onDisplayNameChange}
                onSubmitEditing={this.onSubmitDisplayName}
              />

              <TextField
                ref={this.emailAddressRef}
                label="Email address"
                baseColor={iOSColors.gray}
                errorColor={iOSColors.white}
                textColor={iOSColors.lightGray}
                tintColor={Colors.secondaryColor}
                fontSize={18}
                labelFontSize={14}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
                clearTextOnFocus={false}
                error={this.state.formErrors.emailAddress}
                value={this.props.email}
                onChangeText={this.onEmailAdressChange}
                onSubmitEditing={this.onSubmitEmailAddress}
              />

              <TextField
                ref={this.passwordRef}
                label="Password"
                baseColor={iOSColors.gray}
                errorColor={iOSColors.white}
                textColor={iOSColors.lightGray}
                tintColor={Colors.secondaryColor}
                fontSize={18}
                labelFontSize={14}
                secureTextEntry={this.state.passwordSecureTextEntry}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                enablesReturnKeyAutomatically={true}
                clearTextOnFocus={true}
                error={this.state.formErrors.password}
                value={this.props.password}
                onChangeText={this.onPasswordChange}
                onSubmitEditing={this.onSubmitPassword}
                renderAccessory={this.renderPasswordAccessory}
              />

              <TextField
                ref={this.confirmPasswordRef}
                label="Confirm Password"
                baseColor={iOSColors.gray}
                errorColor={iOSColors.white}
                textColor={iOSColors.lightGray}
                tintColor={Colors.secondaryColor}
                fontSize={18}
                labelFontSize={14}
                secureTextEntry={this.state.confirmPasswordSecureTextEntry}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
                clearTextOnFocus={true}
                error={this.state.formErrors.confirmPassword}
                value={this.props.confirmPassword}
                onChangeText={this.onConfirmPasswordChange}
                onSubmitEditing={this.onSubmitConfirmPassword}
                renderAccessory={this.renderConfirmPasswordAccessory}
              />

              <AppButton
                label="CREATE ACCOUNT"
                disabled={this.props.isLoading}
                onPress={() => this.onButtonPress()}
                style={{ marginTop: 30, marginBottom: 30 }}
                isLoading={this.props.isLoading}
              />

              <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
                <Text style={[styles.button, { marginBottom: 20 }]}>Back to login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    ...human.bodyObject,
    color: iOSColors.midGray,
    textAlign: "center"
  },
  errorTextStyle: {
    fontSize: 20,
    alignSelf: "center",
    color: "red"
  }
});

const mapStateToProps = state => {
  return {
    displayName: state.signUp.displayName,
    email: state.signUp.email,
    password: state.signUp.password,
    confirmPassword: state.signUp.confirmPassword,
    error: state.signUp.error,
    isLoading: state.signUp.isLoading,
    isSuccess: state.signUp.isSuccess
  };
};

export default connect(
  mapStateToProps,
  {
    displayNameChanged,
    emailChanged,
    passwordChanged,
    confirmPasswordChanged,
    signUpUser
  }
)(SignUpScreen);
