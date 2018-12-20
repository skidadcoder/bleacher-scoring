import moment, { ISO_8601, utc } from "moment";
import firebase from "firebase";
import React from "react";
import {
  Button,
  CameraRoll,
  Clipboard,
  Dimensions,
  ImageBackground,
  Modal,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { Constants, FileSystem, Permissions } from "expo";
import { withNavigation } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";
import { human, iOSColors } from "react-native-typography";
import Image from "react-native-scalable-image";
import Colors from "../../constants/Colors";
import storeUrl from "../../utils/storeUrl";

const initialState = {
  postModalVisible: false,
  postModalOuterVisible: false,  
  picModalVisible: false,
  picModalOuterVisible: false,
  selectedImageUrl: null
};

class GamePostListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  runFunctionAndClose = func => {
    func();
    this.setState({ postModalVisible: false });
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

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

  renderAuthor(author) {
    if (author) {
      return <Text style={[styles.author]}>{author}</Text>;
    }
  }

  renderPostDate(postDate) {
    if (postDate) {
      return <Text style={[styles.postDate]}>{moment(postDate).fromNow()}</Text>;
    }
  }

  renderText(text) {
    if (text) {
      return <Text style={[styles.text]}>{text}</Text>;
    }
  }

  renderImage(imageUrl) {
    if (imageUrl) {
      return (
        <TouchableWithoutFeedback
          delayLongPress={500}
          onPress={() => this.props.navigation.navigate("ImageGallery", { imageUrl })}
          onLongPress={() => {
            this.setState({ selectedImageUrl: imageUrl, picModalOuterVisible: true });
          }}
        >
          <Image source={{ uri: imageUrl }} width={Dimensions.get("window").width} />
        </TouchableWithoutFeedback>
      );
    }
  }

  renderProfilePic = (author, avatarURL) => {
    if (avatarURL) {
      return (
        <ImageBackground
          source={{ uri: avatarURL }}
          style={styles.profileImageContainer}
          imageStyle={{ borderRadius: 30 }}
        />
      );
    } else {
      const matches = author ? author.match(/\b(\w)/g) : ["B", "S"];
      let acronym = undefined;
      if (matches.length > 1) {
        const firstWord = matches[0];
        const lastWord = matches[matches.length - 1];
        acronym = firstWord + lastWord;
      } else {
        acronym = matches.join("");
      }

      return (
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileImage}>{acronym}</Text>
        </View>
      );
    }
  };

  renderModal(onDeletePost, onEditPost) {
    return (
      <Modal
        transparent={true}
        visible={this.state.postModalOuterVisible}
        onShow={() => this.setState({ postModalVisible: true })}
      >
        <View style={styles.bottomSheetContainer}>
          <Modal
            animationType="slide"
            onDismiss={() => this.setState({ postModalOuterVisible: false })}
            transparent={true}
            visible={this.state.postModalVisible}
          >
            <TouchableWithoutFeedback onPress={() => this.setState({ postModalVisible: false })}>
              <View style={{ flex: 1 }} />
            </TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              <TouchableOpacity onPress={() => this.runFunctionAndClose(onDeletePost)}>
                <View style={styles.bottomSheetButton}>
                  <View style={styles.bottomSheetIconContainer}>
                    <Ionicons
                      name={Platform.OS === "ios" ? "ios-trash" : "md-trash"}
                      size={26}
                      style={styles.bottomSheetButtonIcon}
                    />
                  </View>
                  <Text style={styles.bottomSheetButtonText}>Delete post</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.runFunctionAndClose(onEditPost)}>
                <View style={styles.bottomSheetButton}>
                  <View style={styles.bottomSheetIconContainer}>
                    <Ionicons
                      name={Platform.OS === "ios" ? "ios-create" : "md-create"}
                      size={26}
                      style={styles.bottomSheetButtonIcon}
                    />
                  </View>
                  <Text style={styles.bottomSheetButtonText}>Edit post</Text>
                </View>
              </TouchableOpacity>

            </View>
          </Modal>
        </View>
      </Modal>
      // <Modal animationType="fade" transparent={true} visible={this.state.modalVisible}>
      //   <View
      //     style={{
      //       flex: 1,
      //       backgroundColor: "rgba(52, 52, 52, 0.8)",
      //       justifyContent: "center"
      //     }}
      //   >
      //     <View style={{ backgroundColor: "#fff", margin: 40, borderRadius: 10 }}>
      //       <View
      //         style={{
      //           borderBottomColor: iOSColors.lightGray,
      //           borderBottomWidth: 1,
      //           padding: 10
      //         }}
      //       >
      //         <Button title={"DELETE POST"} onPress={() => this.runFunctionAndClose(onDeletePost)} />
      //       </View>

      //       <View
      //         style={{
      //           borderBottomColor: iOSColors.lightGray,
      //           borderBottomWidth: 1,
      //           padding: 10
      //         }}
      //       >
      //         <Button title={"EDIT POST"} onPress={() => this.runFunctionAndClose(onEditPost)} />
      //       </View>

      //       <View style={{ padding: 10 }}>
      //         <Button title={"CANCEL"} onPress={() => this.setModalVisible(false)} />
      //       </View>
      //     </View>
      //   </View>
      // </Modal>
    );
  }

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
    const { post, currentUser, onDeletePost, onEditPost } = this.props;

    return (
      <View
        style={{
          backgroundColor: iOSColors.white,
          borderTopColor: iOSColors.lightGray,
          borderTopWidth: 10,
          paddingBottom: 20
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignContent: "center",
            marginBottom: 10
          }}
        >
          <View>{this.renderProfilePic(post.author, post.avatarURL)}</View>
          <View>
            {this.renderAuthor(post.author)}
            {this.renderPostDate(post.postDate)}
          </View>
          <View style={{ flex: 1 }}>
            {currentUser && currentUser.uid === post.userId && (
              <TouchableOpacity
                style={{ height: 44, width: 44, alignSelf: "flex-end" }}
                onPress={() => {
                  this.setState({ postModalOuterVisible: true });
                }}
              >
                <Ionicons
                  name="md-more"
                  size={30}
                  color={iOSColors.gray}
                  style={{ alignSelf: "center", marginTop: 10 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {this.renderText(post.body)}
        {this.renderImage(post.imageUri)}
        {this.renderModal(onDeletePost, onEditPost)}
        {this.renderPicModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  author: {
    ...human.headlineObject,
    marginTop: 10,
    marginLeft: 10
  },
  profileImageContainer: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: 10,
    marginLeft: 10,
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: Colors.secondaryColor
  },
  profileImage: {
    ...human.title1WhiteObject,
    textAlign: "center"
  },
  postDate: {
    ...human.bodyObject,
    color: iOSColors.gray,
    marginLeft: 10,
    marginTop: 5
  },
  text: {
    ...human.bodyObject,
    margin: 10,
    marginRight: 30
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  reportButton: {
    borderWidth: 1,
    borderColor: "white",
    padding: 4,
    borderRadius: 3,
    margin: 10,
    alignSelf: "flex-end",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 1.5,
    shadowColor: "black",
    shadowOpacity: 0.8
  },
  closeButton: {
    fontSize: 35,
    color: "white",
    lineHeight: 40,
    width: 40,
    textAlign: "center",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 1.5,
    shadowColor: "black",
    shadowOpacity: 0.8
  },
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

export default withNavigation(GamePostListItem);
