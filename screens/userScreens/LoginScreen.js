import firebase from "firebase";
import React from "react";
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Facebook } from "expo";
import { connect } from "react-redux";
import { TextField } from "react-native-material-textfield";
import { emailChanged, passwordChanged, logInUser, loginUserWithFacebook } from "../../actions/authActions";
import { MaterialIcons } from "@expo/vector-icons";
import { human, iOSColors, robotoWeights } from "react-native-typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderBar from "../../components/HeaderBar";
import { AppButton } from "../../components/Buttons";
import GlobalStyles from "../styles";
import Colors from "../../constants/Colors";

const initialState = {
  secureTextEntry: true,
  emailAddressValid: false,
  passwordValid: false,
  formErrors: { emailAddress: "", password: "" },
  formValid: false
};

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.emailAddressRef = this.updateRef.bind(this, "emailAddress");
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onSubmitEmailAddress = this.onSubmitEmailAddress.bind(this);

    this.passwordRef = this.updateRef.bind(this, "password");
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onSubmitPassword = this.onSubmitPassword.bind(this);

    this.onAccessoryPress = this.onAccessoryPress.bind(this);
    this.renderPasswordAccessory = this.renderPasswordAccessory.bind(this);

    this.state = initialState;
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate("Home");
      }
    });
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  validateField(fieldName, value) {
    let formErrors = this.state.formErrors;
    let emailAddressValid = this.state.emailAddressValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "emailAddress":
        emailAddressValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        formErrors.emailAddress = emailAddressValid ? "" : "The email address is invalid";
        break;
      case "password":
        passwordValid = value.length > 0;
        formErrors.password = passwordValid ? "" : "A password is required";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: formErrors,
        emailAddressValid: emailAddressValid,
        passwordValid: passwordValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailAddressValid && this.state.passwordValid
    });
  }

  onAccessoryPress() {
    this.setState(({ secureTextEntry }) => ({
      secureTextEntry: !secureTextEntry
    }));
  }

  onEmailChange(text) {
    this.validateField("emailAddress", text);
    this.props.emailChanged(text);
  }

  onPasswordChange(text) {
    this.validateField("password", text);
    this.props.passwordChanged(text);
  }

  onSubmitEmailAddress() {
    this.password.focus();
  }

  onSubmitPassword() {
    this.password.blur();
  }

  onButtonPress = () => {
    if (this.state.formValid) {
      this.emailAddress.blur();
      this.password.blur();
      const { email, password } = this.props;
      this.props.logInUser({ email, password });
    }
  };

  onFacebookButtonPress = async () => {
    const { type, token, expires, permissions, declinedPermissions } = await Facebook.logInWithReadPermissionsAsync(
      "218649529019531",
      {
        permissions: ["public_profile"]
      }
    );

    if (type === "success") {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      this.props.loginUserWithFacebook({ token });
    } else {
      // type === 'cancel'
    }
  };

  renderPasswordAccessory() {
    let { secureTextEntry } = this.state;

    let name = secureTextEntry ? "visibility" : "visibility-off";

    return (
      <MaterialIcons
        size={24}
        name={name}
        color={iOSColors.midGray}
        onPress={this.onAccessoryPress}
        suppressHighlighting
      />
    );
  }

  renderError() {
    if (this.props.error) {
      return (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.errorTextStyle}>{this.props.error}</Text>
        </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Login" navigateBack="Home" />

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

            <AppButton
              label="LOG IN WITH FACEBOOK"
              disabled={this.props.isLoading}
              onPress={this.onFacebookButtonPress}
              style={{ marginTop: 30, marginBottom: 30, backgroundColor: Colors.facebookColor }}
              isLoading={this.props.isLoading}
              icon="logo-facebook"
            />

            <View style={{ flex: 1, flexDirection: "row", alignContent: "center" }}>
              <View style={styles.hr} />
              <Text style={{ textAlign: "center", color: iOSColors.lightGray, margin: 5 }}>OR</Text>
              <View style={styles.hr} />
            </View>

            <View style={{ flex: 1 }}>
              <TextField
                ref={this.emailAddressRef}
                label="Email Address"
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
                onChangeText={this.onEmailChange}
                onSubmitEditing={this.onSubmitEmailAddress}
                textContentType="username"
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
                secureTextEntry={this.state.secureTextEntry}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
                clearTextOnFocus={false}
                error={this.state.formErrors.password}
                value={this.props.password}
                onChangeText={this.onPasswordChange}
                onSubmitEditing={this.onSubmitPassword}
                renderAccessory={this.renderPasswordAccessory}
                textContentType="password"
              />

              <AppButton
                label="LOG IN"
                disabled={this.props.isLoading}
                onPress={this.onButtonPress}
                style={{ marginTop: 30, marginBottom: 30 }}
                isLoading={this.props.isLoading}
              />

              <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between" }}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp")}>
                  <Text style={[styles.button, { marginBottom: 20 }]}>Create an account</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate("ForgotPassword")}>
                  <Text style={[styles.button]}>Forgot your password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  errorTextStyle: {
    fontSize: 20,
    alignSelf: "center",
    color: "red"
  },
  button: {
    ...human.footnoteObject,
    color: iOSColors.gray,
    textAlign: "center"
  },
  hr: {
    flex: 1,
    height: 2,
    alignSelf: "center",
    borderBottomColor: iOSColors.gray,
    borderBottomWidth: 1
  }
});

const mapStateToProps = state => {
  return {
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    isLoading: state.auth.isLoading,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  {
    emailChanged,
    passwordChanged,
    logInUser,
    loginUserWithFacebook
  }
)(LoginScreen);
