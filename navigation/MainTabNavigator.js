import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, createBottomTabNavigator, createSwitchNavigator } from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import TabBarIconMaterialCommunity from "../components/TabBarIconMaterialCommunity";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/userScreens/SettingsScreen";
import PrivacyPolicyScreen from "../screens/userScreens/PrivacyPolicyScreen";
import ChangeDisplayNameScreen from "../screens/userScreens/ChangeDisplayNameScreen";
import ChangeEmailAddressScreen from "../screens/userScreens/ChangeEmailAddressScreen";
import ChangeProfilePicScreen from "../screens/userScreens/ChangeProfilePicScreen";
import ChangePasswordScreen from "../screens/userScreens/ChangePasswordScreen";
import ReportBugScreen from "../screens/userScreens/ReportBugScreen";
import ReportImprovementScreen from "../screens/userScreens/ReportImprovementScreen";
import ScorerGameListScreen from "../screens/scorersScreens/ScorerGameListScreen";
import ScoringScreen from "../screens/scorersScreens/ScoringScreen";
import ScorerImageGalleryScreen from "../screens/scorersScreens/ScorerImageGalleryScreen";
import CreateGameScreen from "../screens/scorersScreens/CreateGameScreen";
import EditGameScreen from "../screens/scorersScreens/EditGameScreen";
import ScoringLocationScreen from "../screens/scorersScreens/ScoringLocationScreen";
import GameSearchListScreen from "../screens/spectatorScreens/GameSearchListScreen";
import SavedGameListScreen from "../screens/spectatorScreens/SavedGameListScreen";
import ScoreboardScreen from "../screens/spectatorScreens/ScoreboardScreen";
import ImageGalleryScreen from "../screens/spectatorScreens/ImageGalleryScreen";

const HomeStack = createStackNavigator({
  Home: { screen: HomeScreen }
});

HomeStack.navigationOptions = {
  tabBarLabel: "Home",
  tabBarVisible: false,
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-home" : "md-home"} />
};

//Find Games Stack
const SpectatorStack = createStackNavigator(
  {
    SavedGameList: SavedGameListScreen,
    GameSearchList: GameSearchListScreen,
    Scoreboard: ScoreboardScreen,
    ImageGallery: ImageGalleryScreen
  },
  {
    headerMode: "none"
  }
);

SpectatorStack.navigationOptions = {
  tabBarLabel: "Watch Game",
  tabBarIcon: ({ focused }) => <TabBarIconMaterialCommunity focused={focused} name="counter" />
};

// Scorer Stack
const ScorerStack = createStackNavigator(
  {
    ScorerGameList: ScorerGameListScreen,
    CreateGame: CreateGameScreen,
    ScoringLocation: ScoringLocationScreen,
    Scoring: ScoringScreen,
    ImageGallery: ScorerImageGalleryScreen,
    EditGame: EditGameScreen
  },
  {
    headerMode: "none"
  }
);

ScorerStack.navigationOptions = {
  headerVisible: false,
  tabBarLabel: "Keep Score",
  tabBarIcon: ({ focused }) => <TabBarIconMaterialCommunity focused={focused} name="clipboard-flow" />
};

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    ChangeDisplayName: ChangeDisplayNameScreen,
    ChangeEmailAddress: ChangeEmailAddressScreen,
    ChangeProfilePic: ChangeProfilePicScreen,
    ChangePassword: ChangePasswordScreen,
    ReportBug: ReportBugScreen,
    ReportImprovement: ReportImprovementScreen,
    PrivacyPolicy: PrivacyPolicyScreen
  },
  {
    headerMode: "none"
  }
);

SettingsStack.navigationOptions = {
  headerVisible: false,
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === "ios" ? "ios-settings" : "md-settings"} />
  )
};

export default createBottomTabNavigator({
  HomeStack,
  SpectatorStack,
  ScorerStack,
  SettingsStack
});
