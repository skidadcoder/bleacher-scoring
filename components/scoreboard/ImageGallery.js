import _ from "lodash";
import React from "react";
import {
  CameraRoll,
  Clipboard,
  Modal,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  SafeAreaView
} from "react-native";
import { Constants, FileSystem, Permissions } from "expo";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";
import Gallery from "react-native-image-gallery";
import { human, iOSColors } from "react-native-typography";
import HeaderBar from "../../components/HeaderBar";
import Colors from "../../constants/Colors";
import GlobalStyles from "../../screens/styles";

const initialState = {
  picModalVisible: false,
  picModalOuterVisible: false,
  selectedImageIndex: 0,
  selectedImageUrl: null
};

class ImageGallery extends React.Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  saveImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      try {
        const { selectedImageUrl } = this.state;
        const storage = firebase.storage();
        const httpsReference = storage.refFromURL(selectedImageUrl);
        const metadata = await httpsReference.getMetadata();

        const extenstion = ".jpg";
        const downloadResult = await FileSystem.downloadAsync(
          selectedImageUrl,
          FileSystem.cacheDirectory + metadata.name + extenstion
        );
        const saveResult = await CameraRoll.saveToCameraRoll(downloadResult.uri, "photo");
      } catch (error) {
        console.log(error);
      } finally {
        this.setState({ picModalVisible: false });
      }
    } else {
      alert("You have not granted this app permissions to access your camera roll.");
    }
  };

  shareImage = async () => {
    const { selectedImageUrl } = this.state;
    const appName = Constants.manifest.name;
    const title = `${appName}`;
    const message = `A photo was shared with you from ${appName}. ${storeUrl() || ""}`;
    Share.share(
      {
        message,
        title,
        url: selectedImageUrl
      },
      {
        tintColor: Constants.manifest.tintColor,
        excludedActivityTypes: [
          "com.apple.UIKit.activity.Print",
          "com.apple.UIKit.activity.AssignToContact",
          "com.apple.UIKit.activity.AddToReadingList",
          "com.apple.UIKit.activity.OpenInIBooks",
          "com.apple.UIKit.activity.MarkupAsPDF",
          "com.apple.reminders.RemindersEditorExtension", // Reminders
          "com.apple.mobilenotes.SharingExtension", // Notes
          "com.apple.mobileslideshow.StreamShareService" // iCloud Photo Sharing - This also does nothing :{
        ]
      }
    ).then(({ action, activityType }) => {
      this.setState({ picModalVisible: false });
      //if (action === Share.sharedAction) console.log("Share was successful");
      //else console.log("Share was dismissed");
    });
  };

  sendImageUrlToClipboard = async () => {
    const { selectedImageUrl } = this.state;
    try {
      await Clipboard.setString(selectedImageUrl);
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ picModalVisible: false });
    }
  };

  onLongPress = () => {
    this.setState({ picModalOuterVisible: true });
  };

  onPageSelected = index => {
    const image = this.props.images[index];
    this.setState({ selectedImageIndex: index, selectedImageUrl: image.source.uri });
  };

  renderPicModal = () => {
    return (
      <Modal
        transparent={true}
        visible={this.state.picModalOuterVisible}
        onShow={() => this.setState({ picModalVisible: true })}
      >
        <View style={styles.bottomSheetContainer}>
          <Modal
            animationType="slide"
            onDismiss={() => this.setState({ picModalOuterVisible: false })}
            transparent={true}
            visible={this.state.picModalVisible}
          >
            <TouchableWithoutFeedback onPress={() => this.setState({ picModalVisible: false })}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              <TouchableOpacity onPress={this.saveImage}>
                <View style={styles.bottomSheetButton}>
                  <View style={styles.bottomSheetIconContainer}>
                    <Ionicons
                      name={Platform.OS === "ios" ? "ios-save" : "md-save"}
                      size={26}
                      style={styles.bottomSheetButtonIcon}
                    />
                  </View>
                  <Text style={styles.bottomSheetButtonText}>Save image</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.shareImage}>
                <View style={styles.bottomSheetButton}>
                  <View style={styles.bottomSheetIconContainer}>
                    <Ionicons
                      name={Platform.OS === "ios" ? "ios-share" : "md-share"}
                      size={26}
                      style={styles.bottomSheetButtonIcon}
                    />
                  </View>
                  <Text style={styles.bottomSheetButtonText}>Share</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.sendImageUrlToClipboard}>
                <View style={styles.bottomSheetButton}>
                  <View style={styles.bottomSheetIconContainer}>
                    <Ionicons
                      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
                      size={26}
                      style={styles.bottomSheetButtonIcon}
                    />
                  </View>
                  <Text style={styles.bottomSheetButtonText}>Copy image link</Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </Modal>
    );
  };

  render() {
    const { images, navigation } = this.props;
    const imageUrl = navigation.getParam("imageUrl");
    const imageIndex = _.findIndex(images, function(i){
      return i.source.uri === imageUrl;
    })

    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <HeaderBar title="Game Photos" />
        <View>
          <Text style={[human.title3White, { textAlign: "center" }]}>
            {this.state.selectedImageIndex + 1} of {images.length}
          </Text>
        </View>
        <Gallery
          style={{ flex: 1 }}
          images={images}
          onSingleTapConfirmed={this.onLongPress}
          onLongPress={this.onLongPress}
          onPageSelected={this.onPageSelected}
          initialPage={imageIndex}
        />
        {this.renderPicModal()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  const { posts } = state.gamePosts.data || {};
  const images = _.reduce(
    posts,
    function(results, post) {
      if (post.imageUri) {
        results.push({ source: { uri: post.imageUri } });
      }
      return results;
    },
    []
  );
 
  return { images };
};

export default withNavigation(connect(
  mapStateToProps,
  {}
)(ImageGallery));

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: "rgba(52, 52, 52, 0.5)"
  },
  bottomSheet: {
    backgroundColor: iOSColors.white,
    paddingTop: 8,
    paddingBottom: 8
  },
  bottomSheetButton: {
    alignItems: "center",
    flexDirection: "row",
    height: 56,
    paddingLeft: 16
  },
  bottomSheetIconContainer: {
    width: 56
  },
  bottomSheetButtonIcon: {
    color: Colors.primaryLightColor,
    marginRight: 24
  },
  bottomSheetButtonText: {
    ...human.title3Object,
    color: Colors.primaryLightColor
  }
});
