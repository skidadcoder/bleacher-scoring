import firebase from "firebase";
import React from "react";
import { connect } from "react-redux";
import { ActivityIndicator, Dimensions, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { Icon, ImageManipulator, ImagePicker, Permissions } from "expo";
import { human, iOSColors } from "react-native-typography";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import HeaderBar from "../../components/HeaderBar";
import { AppButton } from "../../components/Buttons";
import { displayNameChanged, updateDisplayName } from "../../actions/updateDisplayNameActions";
import GlobalStyles from "../styles";
import Colors from "../../constants/Colors";

const initialState = {
  user: null,
  uid: null,
  displayName: null,
  photoURL: null,
  isPhotoLoading: false
};

class ChangeProfilePicScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.props.navigation.navigate("Login");
      } else {
        const { uid, displayName, photoURL } = user;
        this.setState({ uid, displayName, photoURL });
        this.setState({ user });
      }
    });
  }

  componentWillReceiveProps(nextProps) {}

  urlToBlob = url => {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", url);
      xhr.responseType = "blob"; // convert type
      xhr.send();
    });
  };

  onPickImagePress = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        mediaTypes: "Images",
        quality: 0
      });

      if (!result.cancelled) {
        await this.setState(() => ({ photoUrl: null, isPhotoLoading: true }));

        const manipResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [
            {
              resize: {
                width: Dimensions.get("window").height / 2,
                height: Dimensions.get("window").height / 2
              }
            }
          ],
          { compress: 0 }
        );

        const blob = await this.urlToBlob(manipResult.uri);

        const storageRef = firebase
          .storage()
          .ref()
          .child(this.state.uid);

        storageRef
          .put(blob, { contentType: "image/jpeg"})
          .then(() => {
            return storageRef.getDownloadURL();
          })
          .then(result => {
            const { user } = this.state;
            this.setState({ isPhotoLoading: false, photoURL: result });
            return user.updateProfile({ photoURL: result });
          })
          .catch(error => {
            console.log(error);
          });
      }
    } else {
      alert("You have not granted the app permissions to access your camera roll.");
    }
  };

  onRemoveImagePress = async () => {
    const storageRef = firebase
      .storage()
      .ref()
      .child(this.state.uid);

    storageRef
      .delete()
      .then(() => {
        const { user } = this.state;
        this.setState({ photoURL: null });
        return user.updateProfile({ photoURL: null });
      })
      .catch(error => {
        alert(error);
      });
  };

  renderLoadingImage = () => {
    const { isPhotoLoading } = this.state;

    if (isPhotoLoading) {
      return (
        <View style={[styles.imageView]}>
          <Text style={[human.title2White, { textAlign: "center", marginBottom: 20 }]}>Loading photo</Text>
          <ActivityIndicator size="large" color={iOSColors.white} />
        </View>
      );
    }
  };

  renderGenericAvatar = () => {
    const { isPhotoLoading, photoURL } = this.state;

    if (!isPhotoLoading && !photoURL) {
      const { displayName } = this.state;
      const matches = displayName ? displayName.match(/\b(\w)/g) : ["B", "S"];
      const acronym = matches.join(""); // JSON

      return (
        <View style={[styles.imageView]}>
          <Text style={[styles.acronym]}>{acronym}</Text>
        </View>
      );
    }
  };

  renderPhotoAvatar = () => {
    const { isPhotoLoading, photoURL } = this.state;

    if (photoURL && !isPhotoLoading) {
      return <Image source={{ uri: photoURL }} style={[styles.imageView]} />;
    }
  };

  render() {
    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Profile Pic" />

        <View style={[styles.rootContainer]}>
          {this.renderPhotoAvatar()}
          {this.renderGenericAvatar()}
          {this.renderLoadingImage()}

          <View style={[styles.appButtonContainer]}>
            <AppButton style={[styles.button]} label="CHOOSE A PHOTO" onPress={() => this.onPickImagePress()} />

            <AppButton label="REMOVE PHOTO" onPress={() => this.onRemoveImagePress()} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const windowHeight = Dimensions.get("window").height;
const imageHeight = windowHeight / 3;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    //backgroundColor: iOSColors.lightGray,
    padding: 10,
    alignContent: "center",
    justifyContent: "center"
  },
  imageView: {
    alignContent: "center",
    justifyContent: "center",
    height: imageHeight,
    width: imageHeight,
    borderRadius: imageHeight / 2,
    borderWidth: 6,
    borderColor: iOSColors.white,
    backgroundColor: Colors.secondaryColor,
    alignSelf: "center"
  },
  image: {
    height: imageHeight,
    width: imageHeight,
    borderRadius: imageHeight / 2,
    borderWidth: 6,
    borderColor: iOSColors.white
  },
  appButtonContainer: {
    marginTop: 40
  },
  acronym: {
    color: iOSColors.white,
    fontSize: 68,
    textAlign: "center"
  },
  button: { marginBottom: 10 }
});

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  {}
)(ChangeProfilePicScreen);
