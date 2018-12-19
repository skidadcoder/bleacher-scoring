import moment, { ISO_8601 } from "moment";
import React from "react";
import {
  Button,
  Dimensions,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Constants } from "expo";
import { Ionicons } from "@expo/vector-icons";
import Lightbox from "react-native-lightbox";
import { human, iOSColors } from "react-native-typography";
import Image from "react-native-scalable-image";
import Colors from "../../constants/Colors";

export default class GamePostListItem extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false
    };
  }

  runFunctionAndClose = func => {
    func();
    this.setModalVisible(false);
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  renderAuthor(author) {
    if (author) {
      return <Text style={[styles.author]}>{author}</Text>;
    }
  }

  renderPostDate(postDate) {
    if (postDate) {
      return (
        <Text style={[styles.postDate]}>{moment(postDate).fromNow()}</Text>
      );
    }
  }

  renderText(text) {
    if (text) {
      return <Text style={[styles.text]}>{text}</Text>;
    }
  }

  renderImage(imageUrl) {
    if (imageUrl) {
      const activeProps = {
        resizeMode: "contain",
        flex: 1,
        width: null
      };

      const LightBoxImage = ({ source, style }) => (
        <Lightbox activeProps={activeProps}>
          <Image
            style={style}
            source={source}
            width={Dimensions.get("window").width}
          />
        </Lightbox>
      );

      return <LightBoxImage source={{ uri: imageUrl }} />;
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
        animationType="fade"
        transparent={true}
        visible={this.state.modalVisible}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(52, 52, 52, 0.8)",
            justifyContent: "center"
          }}
        >
          <View
            style={{ backgroundColor: "#fff", margin: 40, borderRadius: 10 }}
          >
            <View
              style={{
                borderBottomColor: iOSColors.lightGray,
                borderBottomWidth: 1,
                padding: 10
              }}
            >
              <Button
                title={"DELETE POST"}
                onPress={() => this.runFunctionAndClose(onDeletePost)}
              />
            </View>

            <View
              style={{
                borderBottomColor: iOSColors.lightGray,
                borderBottomWidth: 1,
                padding: 10
              }}
            >
              <Button
                title={"EDIT POST"}
                onPress={() => this.runFunctionAndClose(onEditPost)}
              />
            </View>

            <View style={{ padding: 10 }}>
              <Button
                title={"CANCEL"}
                onPress={() => this.setModalVisible(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

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
                  this.setModalVisible(!this.state.modalVisible);
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
  }
});
