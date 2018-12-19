import firebase from "firebase";
import React from "react";
import { connect } from "react-redux";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { human, iOSColors } from "react-native-typography";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextField } from "react-native-material-textfield";
import HeaderBar from "../../components/HeaderBar";
import { AppButton } from "../../components/Buttons";
import {
  emailAddressChanged,
  updateEmailAddress
} from "../../actions/updateEmailAddressActions";
import GlobalStyles from "../styles";
import Colors from "../../constants/Colors";

const initialState = {
  emailAddressValid: false,
  formErrors: {
    emailAddress: ""
  },
  formValid: false,
  emailAddress: "",
  email: "",
  photoURL: "",
  width: 0
};

class ChangeEmailAddressScreen extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.emailAddressRef = this.updateRef.bind(this, "emailAddress");
    this.onEmailAddressChange = this.onEmailAddressChange.bind(this);
    this.onSubmitEmailAddress = this.onSubmitEmailAddress.bind(this);
    this.onUpdateButtonPress = this.onUpdateButtonPress.bind(this);

    this.state = initialState;
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
          : "The email address is not valid";
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

  componentDidMount() {
    this.mounted = true;

    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.navigation.navigate("Login");
      } else {
        if (this.mounted) {
          const { email, photoURL } = user;
          this.props.emailAddressChanged(email);
          this.setState({ email, photoURL });
        }
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.changeEmailAddressSucceeded) {
      nextProps.navigation.navigate("Settings");
    }
  }

  onUpdateButtonPress = () => {
    if (this.state.formValid) {
      const { emailAddress } = this.props;
      this.props.updateEmailAddress({ emailAddress });
    }
  };

  onEmailAddressChange = text => {
    this.validateField("emailAddress", text);
    this.props.emailAddressChanged(text);
  };

  onSubmitEmailAddress = () => {
    this.emailAddress.blur();
    this.onUpdateButtonPress();
  };

  renderProfilePic = () => {
    const { emailAddress, email, photoURL } = this.state;
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
      const matches = emailAddress ? emailAddress.match(/\b(\w)/g) : ["B", "S"];
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
        <HeaderBar title="Email Address" />

        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flex: 1 }}
          extraScrollHeight={50}
        >
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
              ref={this.emailAddressRef}
              label="Email Address"
              baseColor={iOSColors.gray}
              errorColor={iOSColors.white}
              textColor={iOSColors.lightGray}
              tintColor={Colors.secondaryColor}
              fontSize={20}
              labelFontSize={16}
              autoCapitalize="words"
              keyboardType="default"
              returnKeyType="done"
              enablesReturnKeyAutomatically={true}
              clearTextOnFocus={false}
              error={this.state.formErrors.emailAddress}
              value={this.props.emailAddress}
              onChangeText={this.onEmailAddressChange}
              onSubmitEditing={this.onSubmitEmailAddress}
            />

            <AppButton
              label="UPDATE"
              onPress={this.onUpdateButtonPress}
              style={{ marginTop: 40 }}
              isLoading={this.props.changeEmailAddressStarted}
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
    emailAddress,
    changeEmailAddressStarted,
    changeEmailAddressSucceeded,
    changeEmailAddressFailed
  } = state.updateEmailAddressForm;

  return {
    emailAddress,
    changeEmailAddressStarted,
    changeEmailAddressSucceeded,
    changeEmailAddressFailed
  };
};

export default connect(
  mapStateToProps,
  { emailAddressChanged, updateEmailAddress }
)(ChangeEmailAddressScreen);
