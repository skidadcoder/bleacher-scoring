import { createAppContainer , createSwitchNavigator } from "react-navigation";
import LoginScreen from "../screens/userScreens/LoginScreen";
import SignUpScreen from "../screens/userScreens/SignUpScreen";
import ForgotPasswordScreen from "../screens/userScreens/ForgotPasswordScreen";
import MainTabNavigator from "./MainTabNavigator";

const AppNavigator = createSwitchNavigator({
  Main: MainTabNavigator,
  Login: LoginScreen,
  SignUp: SignUpScreen,
  ForgotPassword: ForgotPasswordScreen
});

const AppContainer = createAppContainer(AppNavigator);

// Now AppContainer is the main component for React to render
export default AppContainer;

// export default createSwitchNavigator({
//   Main: MainTabNavigator,
//   Login: LoginScreen,
//   SignUp: SignUpScreen,
//   ForgotPassword: ForgotPasswordScreen
// });
