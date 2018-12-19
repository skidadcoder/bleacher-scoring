import React from "react";
import Scoreboard from "../../components/scoreboard/Scoreboard";

export default class ScoreboardScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Scoreboard canScore={false} />;
  }
}
