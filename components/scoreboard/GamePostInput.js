import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { connect } from "react-redux";
import { Icon, ImageManipulator, ImagePicker, Permissions } from "expo";
import { human, iOSColors } from "react-native-typography";
import Colors from "../../constants/Colors";

import { createGamePost, deleteGamePost, updateGamePost } from "../../actions/gameActions";

const initialState = {
  isPosting: false,
  isChoosingPicture: false,
  postUid: null,
  body: null,
  image: null,
  imageUri: null
};

class GamePostInput extends React.Component {
  constructor(props) {
    super(props);

    this.postInputRef = this.updateRef.bind(this, "postInput");
    this.onChangeText = this.onChangeText.bind(this);
    this.onPostInputBlur = this.onPostInputBlur.bind(this);
    this.onCancelPostPress = this.onCancelPostPress.bind(this);
    this.onDeleteImagePress = this.onDeleteImagePress.bind(this);
    this.onPickImagePress = this.onPickImagePress.bind(this);
    this.onPostPress = this.onPostPress.bind(this);

    this.state = initialState;
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gamePostPersistStarted) {
      this.setState({ isPosting: true });
    } else if (this.state.isPosting && nextProps.gamePostPersistSucceeded) {
      this.resetInput();
    } else if (this.state.isPosting && nextProps.gamePostPersistFailed) {
      this.resetInput();
    }

    if (nextProps.selectedPost && nextProps.selectedPost.postUid !== this.state.postUid) {
      const { postUid, body, imageUri } = nextProps.selectedPost;
      this.setState(
        {
          postUid,
          body,
          imageUri
        },
        () => {
          setTimeout(() => {
            this.postInput.focus();
          }, 100);
        }
      );
    }
  }

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

  resetInput = () => {
    this.setState(initialState, () => {
      setTimeout(() => {
        this.postInput.blur();
        Keyboard.dismiss();
      }, 100);
    });
  };

  onCancelPostPress = () => {
    if (!this.state.isChoosingPicture) {
      Keyboard.dismiss();
      this.setState(initialState);
      this.props.cancel();
    }
  };

  onChangeText = text => {
    this.setState({ body: text });
  };

  onDeleteImagePress = () => {
    this.setState({ image: null, imageUri: null });
  };

  onPickImagePress = async () => {
    this.setState({ isChoosingPicture: true });

    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === "granted") {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        mediaTypes: "Images"
      });

      if (!result.cancelled) {
        const manipResult = await ImageManipulator.manipulateAsync(result.uri, [{ resize: { width: 500 } }], {
          compress: 0.5
        });

        const blob = await this.urlToBlob(manipResult.uri);

        this.setState({ isChoosingPicture: false, image: blob, imageUri: result.uri }, () => {
          setTimeout(() => {
            this.postInput.focus();
          }, 100);
        });
      } else {
        this.setState(
          {
            isChoosingPicture: false,
            image: null,
            imageUri: null
          },
          () => {
            setTimeout(() => {
              this.postInput.focus();
            }, 100);
          }
        );
      }
    } else {
      alert("You have not granted this app permissions to access your camera roll.");
    }
  };

  onPostInputBlur = () => {
    if (!this.state.isChoosingPicture) {
      Keyboard.dismiss();
      this.setState(initialState);
      this.props.cancel();
    }
  };

  onPostPress = () => {
    const { postUid, body, imageUri, image } = this.state;
    const { gameUid } = this.props;

    if (postUid) {
      this.props.updateGamePost({
        gameUid,
        postUid,
        body,
        imageUri,
        image
      });
    } else {
      this.props.createGamePost({ gameUid, body, image });
    }
  };

  renderPostButton = () => {
    const { isPosting, body, image } = this.state;

    if (isPosting) {
      return (
        <ActivityIndicator
          size="large"
          style={{
            width: 44,
            alignContent: "center",
            justifyContent: "center"
          }}
        />
      );
    } else if (image || (body && body.length > 0)) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
      return (
        <TouchableOpacity
          onPress={this.onPostPress}
          style={{
            height: 44,
            width: 44,
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <Icon.Ionicons
            color={image || (body && body.length > 0) ? Colors.secondaryColor : iOSColors.gray}
            name="md-send"
            size={30}
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      );
    }
  };

  renderCameraButton = () => {
    return (
      <TouchableOpacity
        style={{
          height: 44,
          width: 44,
          alignContent: "center",
          justifyContent: "center"
        }}
        onPress={this.onPickImagePress}
      >
        <Icon.MaterialIcons style={{ alignSelf: "center" }} color={Colors.secondaryColor} name="photo" size={40} />
      </TouchableOpacity>
    );
  };

  renderPostInput = () => {
    const { body, imageUri } = this.state;

    return (
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          backgroundColor: iOSColors.lightGray
        }}
      >
        <View style={{ justifyContent: "flex-end" }}>{this.renderCameraButton()}</View>

        <View
          style={{
            flex: 1,
            borderColor: iOSColors.gray,
            borderWidth: 1,
            borderRadius: 16,
            backgroundColor: "#f5f5f5"
          }}
        >
          {!!imageUri && (
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 16,
                overflow: "hidden",
                margin: 5
              }}
            >
              <ImageBackground source={{ uri: imageUri }} style={{ height: 100, width: 100 }}>
                <TouchableOpacity onPress={this.onDeleteImagePress}>
                  <View
                    style={{
                      alignSelf: "flex-end",
                      borderColor: "#fff",
                      borderWidth: 2,
                      height: 36,
                      width: 36,
                      borderRadius: 20,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      justifyContent: "center",
                      alignContent: "center",
                      margin: 5
                    }}
                  >
                    <Icon.Ionicons
                      color={iOSColors.white}
                      name="md-close"
                      size={26}
                      style={{
                        alignSelf: "center",
                        marginTop: 2,
                        marginLeft: 2
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              minHeight: 40,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TextInput
              ref={this.postInputRef}
              style={[human.body, { flex: 1, marginLeft: 8, paddingBottom: 4 }]}
              placeholder="Post a comment..."
              placeholderTextColor={iOSColors.gray}
              onChangeText={this.onChangeText}
              editable={true}
              multiline={true}
              value={body}
              onBlur={this.onPostInputBlur}
              maxLength={255}
            />

            <TouchableOpacity
              onPress={this.onCancelPostPress}
              style={{ height: 44, width: 44, justifyContent: "center", alignItems: "center" }}
            >
              <Icon.Ionicons color={iOSColors.gray} name={Platform.OS === "ios" ? "ios-close" : "md-close"} size={26} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ justifyContent: "flex-end" }}>{this.renderPostButton()}</View>
      </View>
    );
  };

  render() {
    return this.renderPostInput();
  }
}

const styles = StyleSheet.create({
  headline: {
    ...human.headlineObject
  },
  subHeader: {
    ...human.subheadObject,
    color: iOSColors.gray
  }
});

const mapStateToProps = state => {
  const { gamePostPersistStarted, gamePostPersistSucceeded, gamePostPersistFailed } = state.gamePost;

  return {
    gamePostPersistStarted,
    gamePostPersistSucceeded,
    gamePostPersistFailed
  };
};

export default connect(
  mapStateToProps,
  {
    createGamePost,
    deleteGamePost,
    updateGamePost
  }
)(GamePostInput);
