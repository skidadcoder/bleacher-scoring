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

class ReportImprovementScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;

    this.improvementReportTextInputRef = this.updateRef.bind(this, "improvementReportTextInput");
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
    this.improvementReportTextInput.blur();
  }

  onImprovementReportSubmitPress = () => {
    this.setState({ isSubmitting: true });

    const { text, user } = this.state;

    let improvementReport = {
      description: text,
      reportedBy: user.uid,
      reportedByEmailAddress: user.email
    };

    firebase
      .database()
      .ref("improvementReports")
      .push(improvementReport)
      .then(this.setState({ isSubmitting: false, isSubmitted: true }));
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Suggestions" />

        <KeyboardAwareScrollView
          style={{ backgroundColor: "#eee" }}
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            padding: 20
          }}
        >
          <Icon.Ionicons name="ios-megaphone" size={64} style={{ alignSelf: "center", color: Colors.secondaryColor }} />

          {!this.state.isSubmitted && (
            <View style={{ flex: 1 }}>
              <Text style={[human.body, { margin: 10 }]}>
                Thank you for taking the time to suggest an improvement. Please be as descriptive as possible.
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
                  ref={this.improvementReportTextInputRef}
                  autoFocus
                  multiline={true}
                  placeholder="Describe the improvement..."
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
                label="SUBMIT IMPROVEMENT"
                onPress={this.onImprovementReportSubmitPress}
                disabled={this.state.isSubmitting || !this.state.text}
                isLoading={this.state.isSubmitting}
              />
            </View>
          )}

          {this.state.isSubmitted && (
            <View>
              <Text style={[human.title2, { textAlign: "center" }]}>
                You suggestion has been submitted to our team. We very much appreciate you taking the time to help us
                improve.
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
)(ReportImprovementScreen);
