import firebase from "firebase";
import React from "react";
import {
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
import { Ionicons } from "@expo/vector-icons";
import { human, iOSColors } from "react-native-typography";
import { TextField } from "react-native-material-textfield";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderBar from "../../components/HeaderBar";
import { AppButton } from "../../components/Buttons";
import GlobalStyles from "../styles";
import Colors from "../../constants/Colors";

const initialState = {
  emailAddress: "",
  emailAddressValid: "",
  formErrors: { emailAddress: "" },
  formValid: false,
  isSubmitted: false
};

class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.onSendLinkPress = this.onSendLinkPress.bind(this);
    this.emailAddressRef = this.updateRef.bind(this, "emailAddress");
    this.onEmailChange = this.onEmailChange.bind(this);
    this.onSubmitEmailAddress = this.onSubmitEmailAddress.bind(this);
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  validateField(fieldName, value) {
    let formErrors = this.state.formErrors;
    let emailAddressValid = this.state.emailAddressValid;

    switch (fieldName) {
      case "emailAddress":
        emailAddressValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        formErrors.emailAddress = emailAddressValid
          ? ""
          : "The email address is invalid";
        break;
      default:
        break;
    }

    this.setState(
      {
        formErrors: formErrors,
        emailAddressValid: emailAddressValid
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailAddressValid
    });
  }

  onEmailChange = text => {
    this.setState({ emailAddress: text }, () => {
      this.validateField("emailAddress", text);
    });
  };

  onSubmitEmailAddress() {
    this.emailAddress.blur();
  }

  onSendLinkPress = () => {
    this.setState({ isSubmitted: true });

    if (this.state.formValid) {
      var auth = firebase.auth();

      auth.sendPasswordResetEmail(this.state.emailAddress).then(() => {
        this.props.navigation.navigate("Login");
      });
    }
  };

  renderInstructions() {
    const { formValid, isSubmitted } = this.state;

    if (!formValid && isSubmitted) {
      return (
        <View style={{ marginBottom: 60 }}>
          <Text style={[styles.textStyle, styles.errorTextStyle]}>
            {this.state.formErrors.emailAddress}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ marginBottom: 60 }}>
        <Text style={[styles.instructions]}>
          We just need your registered email address to send you a password
          reset link.
        </Text>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Forgot password" navigateBack="Login" />

        <KeyboardAwareScrollView
          extraHeight={200}
          extraScrollHeight={50}
          keyboardShouldPersistTaps="handled"
        >
          {this.props.error && (
            <View
              style={{
                backgroundColor: iOSColors.lightGray2,
                padding: 30,
                marginBottom: 20
              }}
            >
              <Text style={[human.body, { color: iOSColors.red }]}>
                {this.props.error}
              </Text>
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
            {this.renderInstructions()}

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
                returnKeyType="done"
                enablesReturnKeyAutomatically={true}
                clearTextOnFocus={true}
                error={this.state.formErrors.emailAddress}
                value={this.props.email}
                onChangeText={this.onEmailChange}
                onSubmitEditing={this.onSubmitEmailAddress}
              />

              <AppButton
                label="SEND RESET LINK"
                disabled={this.props.isLoading}
                onPress={this.onSendLinkPress}
                style={{ marginTop: 30, marginBottom: 30 }}
                isLoading={this.state.isSubmitted}
              />

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Login")}
              >
                <Text style={[styles.button]}>Back to login</Text>
              </TouchableOpacity>
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
    ...human.bodyObject,
    color: iOSColors.midGray,
    textAlign: "center"
  },
  instructions: {
    ...human.title3Object,
    color: iOSColors.midGray,
  }
});

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  {}
)(ForgotPasswordScreen);
