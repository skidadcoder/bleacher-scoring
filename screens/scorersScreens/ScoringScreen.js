import React from "react";
import { AsyncStorage } from "react-native";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import ScoringWalkthrough from "../../components/scoreboard/ScoringWalkthrough";

const initialState = { hasSeenWalkthrough: true };

export default class ScoringScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.retrieveItem("hasSeenWalkthrough")
      .then(hasSeenWalkthrough => {
        this.setState({ hasSeenWalkthrough });
        //remove this for production
        //return this.storeItem("hasSeenWalkthrough", !hasSeenWalkthrough);
      })
      .catch(error => {
        //this callback is executed when your Promise is rejected
        console.log("Promise is rejected with error: " + error);
      });
  }

  //the functionality of the retrieveItem is shown below
  async retrieveItem(key) {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return;
  }

  async storeItem(key, item) {
    try {
      var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
      return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }

  onSkipPressed = () => {
    this.storeItem("hasSeenWalkthrough", true)
      .then(() => {
        this.setState({ hasSeenWalkthrough: true });
      })
      .catch(error => {
        //this callback is executed when your Promise is rejected
        console.log("Promise is rejected with error: " + error);
      });
  };

  render() {
    if (this.state.hasSeenWalkthrough) {
      return <Scoreboard canScore={true} />;
    } else {
      return <ScoringWalkthrough onSkipPressed={this.onSkipPressed} />;
    }
  }
}
