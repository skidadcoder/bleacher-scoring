import React from "react";
import {
  ActivityIndicator,
  Alert,
  AsyncStorage,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import firebase from "firebase";
import { logOutUser } from "../../actions/authActions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { human, iOSColors } from "react-native-typography";
import Colors from "../../constants/Colors";
import HeaderBar from "../../components/HeaderBar";
import GlobalStyles from "../styles";

const initialState = {
  displayName: null,
  photoURL: null,
  checkingForUpdates: false
};

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  static navigationOptions = {
    title: "Settings"
  };

  componentDidMount() {
    this.mounted = true;
    this.navListeners = [this.props.navigation.addListener("willFocus", this.componentWillFocus)];

    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.navigation.navigate("Login");
      } else {
        if (this.mounted) {
          const { displayName, email, photoURL } = user;
          this.setState({ displayName, email, photoURL });
        }
      }
    });
  }

  componentWillFocus = () => {
    Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);
  };

  componentWillUnmount() {
    this.navListeners.forEach(navListener => navListener.remove());
    this.mounted = false;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ displayName: nextProps.displayName });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onCheckForUpdates = async () => {
    if (__DEV__) {
      return;
    }

    this.setState(state => {
      return { checkingForUpdates: true };
    });

    try {
      const update = await Expo.Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Expo.Updates.fetchUpdateAsync();
        // ... notify user of update ...
        Expo.Updates.reloadFromCache();
      }
    } catch (e) {
      Alert.alert("Oops. We are unable to check for updates at this time. Please restart the application and try again.");
    } finally {
      this.setState(state => {
        return { checkingForUpdates: false };
      });
    }
  }

  onLogOutPressed = () => {
    this.props.logOutUser();
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Settings" hideBack={true} />
        <KeyboardAwareScrollView style={{ backgroundColor: "#eee" }}>
          <View style={styles.container}>
            <Text style={[human.headline, styles.settingsSectionTitle]}>
              USER ACCOUNT
            </Text>

            <View style={styles.settingsSection}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ChangeDisplayName");
                }}
              >
                <View style={styles.settingsSectionContent}>
                  <Text style={[human.body, styles.label, styles.inputLabel]}>
                    Display Name
                  </Text>
                  <View style={styles.navContainer}>
                    <View style={{ flexDirection: "row-reverse" }}>
                      <Ionicons
                        name="ios-arrow-forward"
                        size={30}
                        color={iOSColors.gray}
                        style={{ alignSelf: "flex-end" }}
                      />
                      <Text
                        style={[
                          human.body,
                          {
                            color: iOSColors.gray,
                            textAlign: "center",
                            marginRight: 10,
                            marginTop: 4
                          }
                        ]}
                      >
                        {this.state.displayName}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("ChangeProfilePic")
                }
              >
                <View style={styles.settingsSectionContent}>
                  <Text style={[human.body, styles.label]}>
                    Profile Picture
                  </Text>
                  <View style={styles.navContainer}>
                    <View style={{ flexDirection: "row-reverse" }}>
                      <Ionicons
                        name="ios-arrow-forward"
                        size={30}
                        color={iOSColors.gray}
                        style={{ alignSelf: "flex-end" }}
                      />
                      {this.state.photoURL && (
                        <Image
                          source={{ uri: this.state.photoURL }}
                          style={{ height: 30, width: 30, marginRight: 10 }}
                        />
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ChangeEmailAddress");
                }}
              >
                <View style={styles.settingsSectionContent}>
                  <Text style={[human.body, styles.label, styles.inputLabel]}>
                    Email
                  </Text>
                  <View style={styles.navContainer}>
                    <View style={{ flexDirection: "row-reverse" }}>
                      <Ionicons
                        name="ios-arrow-forward"
                        size={30}
                        color={iOSColors.gray}
                        style={{ alignSelf: "flex-end" }}
                      />
                      <Text
                        style={[
                          human.body,
                          {
                            color: iOSColors.gray,
                            textAlign: "center",
                            marginRight: 10,
                            marginTop: 4
                          }
                        ]}
                      >
                        {this.state.email}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("ChangePassword")}
              >
                <View style={styles.settingsSectionContent}>
                  <Text style={[human.body, styles.label]}>
                    Change Password
                  </Text>
                  <View style={styles.navContainer}>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={30}
                      color={iOSColors.gray}
                      style={{ alignSelf: "flex-end" }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.onLogOutPressed()}>
                <View style={styles.settingsSectionContent}>
                  <Text style={[human.body, styles.label]}>Log out</Text>
                  <View style={styles.navContainer}>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={30}
                      color={iOSColors.gray}
                      style={{ alignSelf: "flex-end" }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.onCheckForUpdates}>
                <View style={styles.settingsSectionContent}>
                  <Text style={[human.body, styles.label]}>Check For Updates</Text>
                  <View style={styles.navContainer}>
                    {
                      this.state.checkingForUpdates && <ActivityIndicator size="large" style={{ alignSelf: "flex-end" }} />
                    }
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={[human.headline, styles.settingsSectionTitle]}>
              TELL US ABOUT IT
            </Text>

            <View style={styles.settingsSection}>
              {/* <View style={styles.settingsSectionContent}>
                <Text style={[human.body, styles.label]}>Rate the app</Text>
                <View style={styles.navContainer}>
                  <Ionicons
                    name="ios-arrow-forward"
                    size={30}
                    color={iOSColors.gray}
                    style={{ alignSelf: "flex-end" }}
                  />
                </View>
              </View> */}

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("PrivacyPolicy")}
              >
                <View style={styles.settingsSectionContent}>
                  <Text style={[human.body, styles.label]}>
                    Privacy Policy
                  </Text>
                  <View style={styles.navContainer}>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={30}
                      color={iOSColors.gray}
                      style={{ alignSelf: "flex-end" }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("ReportImprovement")
                }
              >
                <View style={styles.settingsSectionContent}>
                  <Text style={[human.body, styles.label]}>
                    Suggest an improvement
                  </Text>
                  <View style={styles.navContainer}>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={30}
                      color={iOSColors.gray}
                      style={{ alignSelf: "flex-end" }}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("ReportBug")}
              >
                <View style={styles.settingsSectionContent}>
                  <Text style={[human.body, styles.label]}>
                    Report a problem
                  </Text>
                  <View style={styles.navContainer}>
                    <Ionicons
                      name="ios-arrow-forward"
                      size={30}
                      color={iOSColors.gray}
                      style={{ alignSelf: "flex-end" }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { padding: 10, flex: 1 },
  settingsSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  settingsSectionTitle: {
    marginBottom: 20,
    marginTop: 20
  },
  settingsSectionContent: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd"
  },
  label: {
    margin: 10,
    marginTop: 16,
    marginBottom: 16
  },
  inputLabel: {
    //width: 200
  },
  inputContainer: {
    backgroundColor: "#f9f9f9",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
    paddingLeft: 20
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    marginRight: 5
  },
  navContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    paddingRight: 20
  }
});

const mapStateToProps = state => {
  const { displayName } = state.updateDisplayNameForm;

  return {
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    isLoading: state.auth.isLoading,
    user: state.auth.user,
    displayName
  };
};

export default connect(
  mapStateToProps,
  {
    logOutUser
  }
)(SettingsScreen);
