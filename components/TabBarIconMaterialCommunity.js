import React from "react";
import { Icon } from "expo";

import Colors from "../constants/Colors";

export default class TabBarIconMaterialCommunity extends React.Component {
  render() {
    return (
      <Icon.MaterialCommunityIcons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.secondaryColor : Colors.tabIconDefault}
      />
    );
  }
}