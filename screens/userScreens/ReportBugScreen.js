import firebase from "firebase";
import React from "react";
import { connect } from "react-redux";
import { SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { Icon } from "expo";
import { human, iOSColors } from "react-native-typography";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderBar from "../../components/HeaderBar";
import { AppButton } from "../../components/Buttons";
import GlobalStyles from "../styles";
import Colors from "../../constants/Colors";

const initialState = {
  user: null,
  text: null,
  isSubmitting: false,
  isSubmitted: false
};

class ReportBugScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.bugReportTextInputRef = this.updateRef.bind(this, "bugReportTextInput");
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user });
      } else {
        this.props.navigation.navigate("Login");
      }
    });
  }

  onSubmitimprovementReportTextInput = () => {
    this.bugReportTextInput.blur();
  };

  onBugReportSubmitPress = () => {
    this.setState({ isSubmitting: true });

    const { text, user } = this.state;

    let bugReport = {
      description: text,
      reportedBy: user.uid,
      reportedByEmailAddress: user.email
    };

    firebase
      .database()
      .ref("bugReports")
      .push(bugReport)
      .then(this.setState({ isSubmitting: false, isSubmitted: true }));
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Report a bug" />

        <KeyboardAwareScrollView
          style={{ backgroundColor: "#eee" }}
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            padding: 20
          }}
        >
          <Icon.Ionicons name="ios-bug" size={64} style={{ alignSelf: "center", color: Colors.secondaryColor }} />

          {!this.state.isSubmitted && (
            <View style={{ flex: 1 }}>
              <Text style={[human.body, { margin: 10 }]}>
                Thank you for taking the time to report a problem. Please be as descriptive as possible.
              </Text>

              <View
                style={{
                  flex: 1,
                  backgroundColor: iOSColors.white,
                  borderColor: "#ddd",
                  borderWidth: 1,
                  borderBottomWidth: 2,
                  marginBottom: 20,
                  borderRadius: 10,
                  padding: 10
                }}
              >
                <TextInput
                  ref={this.bugReportTextInputRef}
                  autoFocus
                  multiline={true}
                  placeholder="Describe the problem..."
                  onChangeText={text => this.setState({ text })}
                  value={this.state.text}
                  maxLength={750}
                  returnKeyType="done"
                  enablesReturnKeyAutomatically={true}
                  onSubmitEditing={this.onSubmitimprovementReportTextInput}
                />
              </View>

              <AppButton
                style={[styles.button]}
                label="SUBMIT BUG"
                onPress={this.onBugReportSubmitPress}
                disabled={this.state.isSubmitting || !this.state.text}
                isLoading={this.state.isSubmitting}
              />
            </View>
          )}

          {this.state.isSubmitted && (
            <View>
              <Text style={[human.title2, { textAlign: "center" }]}>
                The problem you found has been submitted to our technical team. We very much appreciate you taking the
                time to help us improve.
              </Text>
            </View>
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    //backgroundColor: iOSColors.lightGray,
    padding: 10,
    alignContent: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  {}
)(ReportBugScreen);
