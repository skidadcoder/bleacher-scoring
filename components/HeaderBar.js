import React from "react";
import {
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { withNavigation } from "react-navigation";
import { Icon } from "expo";
import { human, iOSColors } from "react-native-typography";

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderBack = (hideBack, navigateBack, backAction) => {
    let action = null;
    if (backAction) {
      action = backAction;
    } else if (navigateBack) {
      action = () => this.props.navigation.navigate(navigateBack);
    } else {
      action = () => this.props.navigation.goBack();
    }

    if (!hideBack) {
      return (
        <TouchableOpacity style={{ width: 44 }} onPress={action}>
          <Icon.Ionicons
            name="ios-arrow-back"
            size={36}
            color={iOSColors.white}
          />
        </TouchableOpacity>
      );
    }
  };

  renderTo = (navigateTo, navigateToIcon) => {
    if (navigateTo) {
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate(navigateTo);
          }}
        >
          <Icon.MaterialIcons
            name={navigateToIcon}
            size={28}
            color={iOSColors.white}
          />
        </TouchableOpacity>
      );
    }
  };

  renderPinActionIcon = pinAction => {
    if (pinAction) {
      return (
        <TouchableOpacity onPress={pinAction}>
          <Icon.MaterialIcons
            name="location-on"
            size={26}
            color={iOSColors.white}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
      );
    }
  };

  renderShareActionIcon = shareAction => {
    if (shareAction) {
      return (
        <TouchableOpacity onPress={shareAction}>
          <Icon.Ionicons
            name={Platform.OS === "ios" ? "ios-share": "md-share"}
            size={26}
            color={iOSColors.white}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
      );
    }
  };

  renderFavoriteActionIcon = favoriteAction => {
    if (favoriteAction) {
      return (
        <TouchableOpacity onPress={favoriteAction}>
          <Icon.MaterialCommunityIcons
            name="heart-outline"
            size={26}
            color={iOSColors.white}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
      );
    }
  };

  renderUnfavoriteActionIcon = unfavoriteAction => {
    if (unfavoriteAction) {
      return (
        <TouchableOpacity onPress={unfavoriteAction}>
          <Icon.MaterialCommunityIcons
            name="heart-off"
            size={26}
            color={iOSColors.white}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
      );
    }
  };

  renderConfirmActionIcon = confirmAction => {
    if (confirmAction) {
      return (
        <TouchableOpacity onPress={confirmAction}>
          <Icon.MaterialIcons name="check" size={26} color={iOSColors.white} />
        </TouchableOpacity>
      );
    }
  };

  renderClearActionIcon = clearAction => {
    if (clearAction) {
      return (
        <TouchableOpacity onPress={clearAction}>
          <Icon.MaterialIcons
            name="clear"
            size={30}
            color={iOSColors.white}
            style={{ paddingRight: 10 }}
          />
        </TouchableOpacity>
      );
    }
  };

  renderTitle = title => {
    if (title) {
      return (
        <Text
          numberOfLines={2}
          style={[human.title3White, { textAlign: "center" }]}
        >
          {title}
        </Text>
      );
    }
  };

  render() {
    const {
      hideBack,
      navigateTo,
      navigateToIcon,
      navigateBack,
      title,
      backAction,
      pinAction,
      shareAction,
      favoriteAction,
      unfavoriteAction,
      confirmAction,
      clearAction
    } = this.props;

    return (
      <View>
        <StatusBar barStyle="light-content" />

        <View
          style={{
            flexDirection: "row",
            height: 50
          }}
        >
          <View
            style={{
              flex: 2,
              alignContent: "center",
              justifyContent: "center",
              marginLeft: 10
            }}
          >
            {this.renderBack(hideBack, navigateBack, backAction)}
          </View>

          <View
            style={{
              flex: 3,
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            {this.renderTitle(title)}
          </View>

          <View
            style={{
              flex: 2,
              alignContent: "center",
              justifyContent: "center",
              marginRight: 10
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                justifyContent: "flex-end"
              }}
            >
              {this.renderPinActionIcon(pinAction)}
              {this.renderFavoriteActionIcon(favoriteAction)}
              {this.renderUnfavoriteActionIcon(unfavoriteAction)}
              {this.renderShareActionIcon(shareAction)}
              {this.renderConfirmActionIcon(confirmAction)}
              {this.renderClearActionIcon(clearAction)}
              {this.renderTo(navigateTo, navigateToIcon)}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default withNavigation(HeaderBar);
