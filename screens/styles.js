import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default StyleSheet.create({
  screenRootView: {
    backgroundColor: Colors.primaryColor,
    flex: 1
  },
  screenRootViewLight: {
    backgroundColor: "#fff",
    flex: 1
  },
  scrollView: {
    backgroundColor: Colors.surfaceColor,
    flex: 1
  },
  detailScreenView: {
    backgroundColor: "#ffffff",
    padding: 10,
    paddingTop: 20,
    flex: 1
  },
 
  formScreenView: {
    backgroundColor: "#ffffff",
    flex: 1,
    padding: 10,
    paddingTop: 20
  },
   detailsScreenViewDark: {
    backgroundColor: "#222629",
    flex: 1
  },

  welcomeRootView: {},
  tabNavRooView: {
    marginTop: 20
  },
  headerSection: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center"
    //padding: 20
  }
});
