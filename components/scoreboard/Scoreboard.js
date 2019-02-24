import _ from "lodash";
import firebase from "firebase";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { AdMobInterstitial, Constants, KeepAwake } from "expo";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import {
  createGamePost,
  deleteGamePost,
  updateGamePost,
  fetchGameById,
  fetchGamePostsById,
  saveGame,
  updateGameScore,
  updateGameLocation,
  updateCurrentSet,
  unfetchGameById,
  unSaveGame
} from "../../actions/gameActions";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { human, iOSColors } from "react-native-typography";
import KeyboardSpacer from "react-native-keyboard-spacer";
import AnimatedScore from "../../components/scoreboard/AnimatedScore";
import AnimatedTeamName from "../../components/scoreboard/AnimatedTeamName";
import HeaderBar from "../../components/HeaderBar";
import SetScores from "../../components/scoreboard/SetScores";
import GamePostListItem from "../../components/scoreboard/GamePostListItem";
import GamePostInput from "../../components/scoreboard/GamePostInput";
import Colors from "../../constants/Colors";
import GlobalStyles from "../../screens/styles";
import storeUrl from "../../utils/storeUrl";
import getEnvVars from "../../environment"
// const HEADER_MAX_HEIGHT = 260;
// const HEADER_MIN_HEIGHT = 0; //Platform.OS === "ios" ? 60 : 73;
// const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const initialState = {
  currentUser: null,
  loadingPosts: true,
  reversed: false,
  selectedPost: null,
  scrollY: new Animated.Value(0),
  orientation: "portrait",
  scoreboardViewHeight: 0
};

class Scoreboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  async componentDidMount() {
    //Dimensions.addEventListener("change", this.onDimensionChange);

    AdMobInterstitial.setAdUnitID(getEnvVars.adMobUnitIDScoreboardInterstitial);
    AdMobInterstitial.setTestDeviceID("EMULATOR");

    const { canScore } = this.props;
    if (!canScore) {
      await AdMobInterstitial.requestAdAsync().catch(error => console.log(error));
      await AdMobInterstitial.showAdAsync().catch(error => console.log(error));
    }
    // AdMobInterstitial.addEventListener("interstitialDidLoad", () => console.log("interstitialDidLoad"));
    // AdMobInterstitial.addEventListener("interstitialDidFailToLoad", () => console.log("interstitialDidFailToLoad"));
    // AdMobInterstitial.addEventListener("interstitialDidOpen", () => console.log("interstitialDidOpen"));
    // AdMobInterstitial.addEventListener("interstitialDidClose", () => console.log("interstitialDidClose"));
    // AdMobInterstitial.addEventListener("interstitialWillLeaveApplication", () =>
    //   console.log("interstitialWillLeaveApplication")
    // );


    const gameUid = this.props.gameUid || this.props.navigation.getParam("game");
    this.props.fetchGameById({ gameUid });
    this.props.fetchGamePostsById({ gameUid });
  }

  componentWillUnmount() {
    //Dimensions.removeEventListener("change", this.onDimensionChange);

    const gameUid = this.props.gameUid || this.props.navigation.getParam("game");
    firebase
      .database()
      .ref(`/games/${gameUid}`)
      .off();

    //AdMobInterstitial.removeAllListeners();
  }

  componentWillReceiveProps(nextProps) {
    const { gamePostPersistSucceeded, gamePostsFetchSucceeded, game } = nextProps;

    if (gamePostsFetchSucceeded) {
      this.setState({ loadingPosts: false });
    }

    if (gamePostPersistSucceeded) {
      this.refs._scrollView.getNode().scrollTo({
        y: 0,
        animated: true
      });
    }

    if (game.currentSet > this.props.game.currentSet) {
      this.showInterstitial();
    }
  }

  showInterstitial = async () => {
    await AdMobInterstitial.requestAdAsync().catch(error => console.log(error));
    await AdMobInterstitial.showAdAsync().catch(error => console.log(error));
  }

  setOrientation = window => {
    const { height, width } = window;

    if (height >= width) {
      this.setState({ orientation: "portrait" });
    } else {
      this.setState({ orientation: "landscape" });
    }
  };

  onDimensionChange = dimensions => {
    this.setOrientation(dimensions.window);
  };

  onDecrementScorePress = (isHome, score) => {
    if (score > 0) {
      const newScore = Math.trunc(score) - 1;
      const { gameUid } = this.props;
      const { currentSet } = this.props.game;
      if (currentSet !== "Final") {
        this.props.updateGameScore({ gameUid, isHome, currentSet, newScore });
      }
    }
  };

  onIncrementScorePress = (isHome, score) => {
    const newScore = Math.trunc(score) + 1;
    const { gameUid } = this.props;
    const { currentSet } = this.props.game;
    if (currentSet !== "Final") {
      this.props.updateGameScore({ gameUid, isHome, currentSet, newScore });
    }
  };

  onIncrementSetPress = async () => {
    const { gameUid } = this.props;
    const { currentSet } = this.props.game;
    if (currentSet !== "Final") {
      if (currentSet < 5) {
        var newSet = currentSet + 1;
        this.props.updateCurrentSet({ gameUid, currentSet: newSet });
      } else {
        this.props.updateCurrentSet({ gameUid, currentSet: "Final" });
      }
    }
  };

  onDecrementSetPress = () => {
    const { gameUid } = this.props;
    const { currentSet } = this.props.game;
    if (currentSet === "Final") {
      this.props.updateCurrentSet({ gameUid, currentSet: 5 });
    } else if (currentSet > 1) {
      var newSet = currentSet - 1;
      this.props.updateCurrentSet({ gameUid, currentSet: newSet });
    }
  };

  onPinToLocationPress = () => {
    this.props.navigation.navigate("ScoringLocation");
  };

  onShareGamePress = async () => {
    const { gameUid } = this.props;
    const appName = Constants.manifest.name;
    const title = `${appName}`;
    const message = `Watch this game on ${appName}. ${storeUrl() || ""}`;

    await Share.share(
      {
        title,
        message,
        url: Expo.Linking.makeUrl("", { game: gameUid })
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
        // Android only:
        //dialogTitle: "Share BAM goodness"
        // iOS only:
        // excludedActivityTypes: [
        //   "com.apple.UIKit.activity.PostToTwitter"
        // ]
      }
    );
  };

  onSwitchPress = () => {
    this.setState(state => {
      return { reversed: !state.reversed };
    });
  };

  onDeletePost = post => {
    const { gameUid } = this.props;
    const { postUid } = post;

    this.props.deleteGamePost({ gameUid, postUid });
  };

  onEditPost = selectedPost => {
    this.setState({ selectedPost });
  };

  onPostInputCancel = () => {
    this.setState({ selectedPost: null });
  };

  onFavoriteGamePress = () => {
    const { gameUid } = this.props;
    const { venueName, awayTeamName, homeTeamName, gameDate } = this.props.game;
    const game = {
      gameUid,
      venueName,
      awayTeamName,
      homeTeamName,
      gameDate
    };

    this.props.saveGame({ game });

    this.showInterstitial();
  };

  onUnfavoriteGamePress = navToFavs => {
    const { gameUid } = this.props;

    this.props.unSaveGame({ gameUid });

    if (navToFavs) {
      this.props.navigation.navigate("SavedGameList");
    }
  };

  renderSwapper = () => {
    return (
      <TouchableOpacity onPress={() => this.onSwitchPress()}>
        <MaterialCommunityIcons
          color={Colors.secondaryColor}
          name="rotate-3d"
          size={44}
          style={{ alignSelf: "center" }}
        />
      </TouchableOpacity>
    );
  };

  renderSet = () => {
    const { currentSet } = this.props.game;

    return (
      <Text style={[human.bodyWhite, { textAlign: "center" }]}>
        {currentSet === "Final" ? currentSet : "Set " + currentSet}
      </Text>
    );
  };

  renderIncrementor = onIncrement => {
    const { canScore } = this.props;

    if (canScore) {
      return (
        <TouchableOpacity onPress={onIncrement}>
          <View
            style={{
              height: 44,
              width: 44,
              alignSelf: "center"
            }}
          >
            <Ionicons
              name="ios-arrow-up"
              size={44}
              style={{
                color: Colors.secondaryColor,
                alignSelf: "center"
              }}
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  renderDecrementor = onDecrement => {
    const { canScore } = this.props;

    if (canScore) {
      return (
        <TouchableOpacity onPress={onDecrement}>
          <View
            style={{
              height: 44,
              width: 44,
              alignSelf: "center"
            }}
          >
            <Ionicons
              name="ios-arrow-down"
              size={44}
              style={{
                color: Colors.secondaryColor,
                alignSelf: "center"
              }}
            />
          </View>
        </TouchableOpacity>
      );
    }
  };

  renderWins = side => {
    const { game } = this.props;
    const { currentSet } = game;
    const { reversed } = this.state;

    let _currentSet = currentSet === "Final" ? 6 : currentSet;
    let wins = 0;
    game.sets.map(function (set, i) {
      if (i < _currentSet) {
        const leftScore = reversed ? set.awayTeamScore : set.homeTeamScore;
        const rightScore = reversed ? set.homeTeamScore : set.awayTeamScore;

        if (side === "left") {
          if (leftScore > rightScore) {
            wins++;
          }
        } else {
          if (leftScore < rightScore) {
            wins++;
          }
        }
      }
    });

    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          height: 20
        }}
      >
        {Array(wins)
          .fill()
          .map(function (item, i) {
            return (
              <View
                key={i}
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: Colors.scoreColorGreen,
                  margin: 5
                }}
              />
            );
          })}
      </View>
    );
  };

  renderPosts = () => {
    const { orderedPosts } = this.props;
    const { currentUser } = firebase.auth();

    LayoutAnimation.linear();

    return (
      <FlatList
        contentContainerStyle={[
          { flexGrow: 1, backgroundColor: iOSColors.lightGray },
          orderedPosts.length ? null : { justifyContent: "center" }
        ]}
        data={orderedPosts}
        keyExtractor={item => item.postUid}
        renderItem={({ item }) => (
          <GamePostListItem
            post={item}
            currentUser={currentUser}
            onDeletePost={() => this.onDeletePost(item)}
            onEditPost={() => this.onEditPost(item)}
          />
        )}
        ListEmptyComponent={this.renderNoPostsComponent}
      />
    );
  };

  renderNoPostsComponent = () => {
    if (this.state.loadingPosts) {
      return (
        <Text
          style={[
            human.title3,
            {
              textAlign: "center"
            }
          ]}
        >
          Fetching posts for this game...
        </Text>
      );
    }

    return (
      <Text
        style={[
          human.title3,
          {
            textAlign: "center"
          }
        ]}
      >
        Be the first to post a comment.
      </Text>
    );
  };

  renderScoreboard = game => {
    const { currentUser } = firebase.auth();
    const gameUid = this.props.gameUid || this.props.navigation.getParam("game");

    let landscapeStyle = {};
    if (this.state.orientation === "landscape") {
      landscapeStyle = {
        flex: 1,
        justifyContent: "center",
        alignContent: "center"
      };
    }

    const { reversed } = this.state;
    const leftTeamName = reversed ? game.awayTeamName : game.homeTeamName;
    const rightTeamName = reversed ? game.homeTeamName : game.awayTeamName;
    let awayTeamScore = 0;
    let homeTeamScore = 0;

    if (game.currentSet === "Final") {
      game.sets.map(function (set, i) {
        if (set !== "Final") {
          if (set.homeTeamScore > set.awayTeamScore) {
            homeTeamScore++;
          } else if (set.homeTeamScore < set.awayTeamScore) {
            awayTeamScore++;
          }
        }
      });
    } else {
      awayTeamScore = game.sets[game.currentSet].awayTeamScore;
      homeTeamScore = game.sets[game.currentSet].homeTeamScore;
    }

    const leftScore = reversed ? awayTeamScore : homeTeamScore;
    const rightScore = reversed ? homeTeamScore : awayTeamScore;

    //PUT THIS BACK AFTER WE FIGURE OUT HOW TO DROP THE SCRE IN FROM THE TOP
    // const { scoreboardViewHeight } = this.state;
    // const scoreboardHeight = scoreboardViewHeight > 0 ? scoreboardViewHeight : 300;
    // const scoreBarOpacity = this.state.scrollY.interpolate({
    //   inputRange: [0, scoreboardHeight - 3, scoreboardHeight - 2, scoreboardHeight - 1, scoreboardHeight],
    //   outputRange: [0, 0, 0.85, 0.9, 0.95],
    //   extrapolate: "clamp"
    // });

    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          ref="_scrollView"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="never"
          scrollEventThrottle={1}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
            useNativeDriver: true
          })}
        >
          <View
            style={[landscapeStyle]}
            onLayout={e => {
              this.setState({ scoreboardViewHeight: e.nativeEvent.layout.height });
            }}
          >
            {/* Team names / Swapper */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1, justifyContent: "center" }}>
                {this.renderWins("left")}
                <AnimatedTeamName teamName={leftTeamName} />
              </View>
              <View style={{ flex: 1 }}>{this.renderSwapper()}</View>
              <View style={{ flex: 1, justifyContent: "center" }}>
                {this.renderWins("right")}
                <AnimatedTeamName teamName={rightTeamName} />
              </View>
            </View>

            {/* Incrementers */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                {game.currentSet !== "Final" ? (
                  this.renderIncrementor(() => this.onIncrementScorePress(!this.state.reversed, leftScore))
                ) : (
                    <View />
                  )}
              </View>
              <View style={{ flex: 1 }}>{this.renderIncrementor(() => this.onIncrementSetPress())}</View>
              <View style={{ flex: 1 }}>
                {game.currentSet !== "Final" ? (
                  this.renderIncrementor(() => this.onIncrementScorePress(this.state.reversed, rightScore))
                ) : (
                    <View />
                  )}
              </View>
            </View>

            {/* Scores / Set */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <AnimatedScore score={leftScore} />
              </View>
              <View style={{ flex: 1, justifyContent: "center" }}>{this.renderSet()}</View>
              <View style={{ flex: 1 }}>
                <AnimatedScore score={rightScore} />
              </View>
            </View>

            {/* Decrementers */}
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                {game.currentSet !== "Final" ? (
                  this.renderDecrementor(() => this.onDecrementScorePress(!this.state.reversed, leftScore))
                ) : (
                    <View />
                  )}
              </View>
              <View style={{ flex: 1 }}>{this.renderDecrementor(() => this.onDecrementSetPress())}</View>
              <View style={{ flex: 1 }}>
                {game.currentSet !== "Final" ? (
                  this.renderDecrementor(() => this.onDecrementScorePress(this.state.reversed, rightScore))
                ) : (
                    <View />
                  )}
              </View>
            </View>

            {/* Set Scores */}
            <SetScores game={game} reversed={reversed} />
          </View>

          {this.state.orientation === "portrait" && this.renderPosts()}
        </Animated.ScrollView>

        {/* <Animated.View style={[styles.bar, { opacity: scoreBarOpacity }]}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View style={{ flex: 2 }}>
              <Text numberOfLines={1} style={[human.bodyWhite, { textAlign: "center" }]}>
                {leftTeamName}
              </Text>
              <Text style={[human.title2White, { textAlign: "center" }]}>{leftScore}</Text>
            </View>
            <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>{this.renderSet()}</View>
            <View style={{ flex: 2 }}>
              <Text numberOfLines={1} style={[human.bodyWhite, { textAlign: "center" }]}>
                {rightTeamName}
              </Text>
              <Text style={[human.title2White, { textAlign: "center" }]}>{rightScore}</Text>
            </View>
          </View>
        </Animated.View> */}

        {this.state.orientation === "portrait" && currentUser && (
          <GamePostInput gameUid={gameUid} selectedPost={this.state.selectedPost} cancel={() => this.onPostInputCancel()} />
        )}

        {this.state.orientation === "portrait" && !currentUser && (
          <View style={{ backgroundColor: iOSColors.lightGray }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
              <Text
                style={[
                  human.body,
                  {
                    color: Colors.secondaryColor,
                    margin: 20,
                    textAlign: "center"
                  }
                ]}
              >
                Login to create posts
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {Platform.OS === "ios" ? <KeyboardSpacer topSpacing={-50} /> : null}
      </View>
    );
  };

  render() {
    const { game, canScore } = this.props;
    const gameExists = !_.isEmpty(game);

    const { navigation } = this.props;
    const navigateBack = navigation.getParam("navigateBack");

    let headerSettings = {};
    if (gameExists) {
      headerSettings = {
        //title: "asdf",//game.venueName,
        shareAction: () => this.onShareGamePress(),
        unfavoriteAction: !canScore && this.props.isSavedGame ? () => this.onUnfavoriteGamePress(false) : undefined,
        favoriteAction: !canScore && !this.props.isSavedGame ? () => this.onFavoriteGamePress() : undefined,
        navigateBack,
        navigateTo: canScore ? "EditGame" : undefined,
        navigateToIcon: canScore ? "edit" : undefined,
        pinAction: canScore ? () => this.onPinToLocationPress() : undefined
      };
    }

    return (
      <SafeAreaView style={[GlobalStyles.screenRootView]}>
        <KeepAwake />
        <HeaderBar {...headerSettings} />

        {!gameExists && (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" />
            <Text style={[human.title3White, { textAlign: "center", marginTop: 20 }]}>Fetching the game...</Text>
          </View>
        )}

        {gameExists && this.renderScoreboard(game)}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    ...human.title3WhiteObject,
    textAlign: "center"
  },
  bar: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  }
});

const mapStateToProps = state => {
  const { gameUid } = state.selectedGame;
  const { data } = state.game;
  const { posts } = state.gamePosts.data || {};
  const { gamePostsFetchSucceeded } = state.gamePosts;
  const { gamePostPersistSucceeded } = state.gamePost;

  const game = data;
  const orderedPosts = _.sortBy(
    _.map(posts, (val, uid) => {
      return { ...val, postUid: uid };
    }),
    function (dateObj) {
      return new Date(dateObj.postDate);
    }
  ).reverse();

  //check if this is a saved game
  var savedGame = _.find(state.savedGames, function (g) {
    return g.gameUid === gameUid;
  });
  let isSavedGame = false;
  if (savedGame) {
    isSavedGame = true;
  }

  return {
    gameUid,
    game,
    orderedPosts,
    gamePostsFetchSucceeded,
    gamePostPersistSucceeded,
    isSavedGame
  };
};

export default withNavigation(
  connect(
    mapStateToProps,
    {
      createGamePost,
      deleteGamePost,
      updateGamePost,
      fetchGameById,
      fetchGamePostsById,
      saveGame,
      updateGameScore,
      updateGameLocation,
      updateCurrentSet,
      unfetchGameById,
      unSaveGame
    }
  )(Scoreboard)
);
