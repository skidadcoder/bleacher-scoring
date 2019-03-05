import _ from "lodash";
import firebase from "firebase";
import React from "react";
import {
  ActivityIndicator,
  Alert,
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
import { AdMobInterstitial, Audio, Constants, KeepAwake, ScreenOrientation } from "expo";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import {
  createGamePost,
  deleteGamePost,
  updateGamePost,
  fetchGameById,
  fetchGamePostsById,
  saveGame,
  saveScorekeeper,
  updateGameScore,
  updateGameLocation,
  updateCurrentSet,
  unfetchGameById,
  unSaveGame,
  unSaveScorekeeper
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

const initialState = {
  currentUser: null,
  loadingPosts: true,
  reversed: false,
  selectedPost: null,
  scrollY: new Animated.Value(0),
  orientation: "portrait"
};

class Scoreboard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  async componentDidMount() {
    AdMobInterstitial.setAdUnitID(getEnvVars.adMobUnitIDScoreboardInterstitial);
    AdMobInterstitial.setTestDeviceID("EMULATOR");
    //AdMobInterstitial.addEventListener("interstitialDidClose", () => {
    //  console.log("interstitialDidClose")
    //  console.log(this.state.orientation)
    //});

    Dimensions.addEventListener("change", this.onDimensionChange);
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
    this.setOrientation();

    // const { canScore } = this.props;
    // if (!canScore) {
    //   await AdMobInterstitial.requestAdAsync().catch(error => console.log(error));
    //   await AdMobInterstitial.showAdAsync().catch(error => console.log(error));
    // }

    const { gameUid } = this.props;
    this.props.fetchGameById({ gameUid });
    this.props.fetchGamePostsById({ gameUid });

    //set up sounds
    this.shortWhistle = new Audio.Sound();
    try {
      await this.shortWhistle.loadAsync(require("../../assets/sounds/whistle-short.mp3"));
    }
    catch (error) {
      console.warn('sound error', { error });
    }
  }

  componentWillUnmount() {
    //AdMobInterstitial.removeEventListener("interstitialDidClose");

    Dimensions.removeEventListener("change", this.onDimensionChange);
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.PORTRAIT);

    const { gameUid } = this.props;
    firebase
      .database()
      .ref(`/games/${gameUid}`)
      .off();
  }

  async componentWillReceiveProps(nextProps) {
    const { gameFetchSucceeded, gamePostPersistSucceeded, gamePostsFetchSucceeded, game, canScore } = nextProps;

    if (gameFetchSucceeded) {
      const { userId, displayName } = game;
      const scorekeeper = { userId: userId, displayName: displayName };
      this.props.saveScorekeeper({ scorekeeper });
    }

    if (gamePostsFetchSucceeded) {
      this.setState({ loadingPosts: false });
    }

    if (gamePostPersistSucceeded) {
      this.refs._scrollView.getNode().scrollTo({
        y: 0,
        animated: true
      });
    }

    if (game.currentSet && this.props.game.currentSet && game.currentSet > this.props.game.currentSet) {
      this.showInterstitial();
    }

    if (this.props.game.currentSet && nextProps.game.currentSet) {
      let prevAwayScore = this.props.game.sets[this.props.game.currentSet].awayTeamScore;
      let currAwayScore = game.sets[game.currentSet].awayTeamScore;
      if (prevAwayScore < currAwayScore) {
        await this.playShortWhitle();
      }

      let prevHomeScore = this.props.game.sets[this.props.game.currentSet].homeTeamScore;
      let currHomeScore = game.sets[game.currentSet].homeTeamScore;
      if (prevHomeScore < currHomeScore) {
        await this.playShortWhitle();
      }
    }
  }

  playShortWhitle = async () => {
    const { isLoaded } = await this.shortWhistle.getStatusAsync();
    if (isLoaded) {
      try {
        await this.shortWhistle.setPositionAsync(0);
        await this.shortWhistle.playAsync();
      } catch (error) {
        console.log(error);
      }
    }
  }

  showInterstitial = async () => {
    await AdMobInterstitial.requestAdAsync().catch(error => {
      console.log(error)
    });
    await AdMobInterstitial.showAdAsync().catch(error => {
      console.log(error)
    });
  }

  setOrientation = () => {
    const window = Dimensions.get('window');
    const { height, width } = window;

    if (height >= width) {
      this.setState({ orientation: "portrait" });
    } else {
      this.setState({ orientation: "landscape" });
    }
  };

  onDimensionChange = dimensions => {
    this.setOrientation();
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
    const { venueName, awayTeamName, homeTeamName, gameDate, userId, displayName } = this.props.game;
    const game = {
      gameUid,
      venueName,
      awayTeamName,
      homeTeamName,
      gameDate,
      userId,
      displayName
    };

    Alert.alert(
      "What do you want to favorite?",
      `Selecting SCOREKEEPER will add all current and future games scored by ${game.displayName} to your favorites.`,
      [
        {
          text: "SCOREKEEPER",
          onPress: () => {
            const { userId, displayName } = game;
            const scorekeeper = { userId: userId, displayName: displayName };
            this.props.saveScorekeeper({ scorekeeper });
          }
        },
        {
          text: "GAME",
          onPress: () => {
            this.props.saveGame({ game });
          }
        },
        {
          text: "CANCEL",
          onPress: () => {
          }
        }
      ],
      { cancelable: false }
    );
  };

  onUnfavoriteGamePress = navToFavs => {
    const { gameUid, userId } = this.props;

    this.props.unSaveGame({ gameUid });
    this.props.unSaveScorekeeper({ userId });

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

    let setStyle = { fontSize: 20 };
    if (this.state.orientation === "landscape") {
      setStyle = {
        fontSize: 32
      };
    }

    return (
      <Text style={[{ color: iOSColors.lightGray2, textAlign: "center" }, setStyle]}>
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
    const { canScore, gameUid } = this.props;

    let teamNameStyle = { fontSize: 24 };
    let scoreStyle = { fontSize: 40 };
    if (this.state.orientation === "landscape") {
      teamNameStyle = { fontSize: 40 };
      scoreStyle = { fontSize: 88 };
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

    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          ref="_scrollView"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="never"
          scrollEventThrottle={1}
        >
          {/* Team names / Swapper */}
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <View style={{ flex: 2 }}>
              {this.renderWins("left")}
              <AnimatedTeamName teamName={leftTeamName} style={[{ color: iOSColors.lightGray2 }, teamNameStyle]} />
            </View>
            <View style={{ flex: 1 }}>
              {this.renderSwapper()}
            </View>
            <View style={{ flex: 2 }}>
              {this.renderWins("right")}
              <AnimatedTeamName teamName={rightTeamName} style={[{ color: iOSColors.lightGray2 }, teamNameStyle]} />
            </View>
          </View>

          {/* Incrementers */}
          {canScore &&
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 2 }}>
                {game.currentSet !== "Final" ? (
                  this.renderIncrementor(() => this.onIncrementScorePress(!this.state.reversed, leftScore))
                ) : (
                    <View />
                  )}
              </View>
              <View style={{ flex: 1 }}>{this.renderIncrementor(() => this.onIncrementSetPress())}</View>
              <View style={{ flex: 2 }}>
                {game.currentSet !== "Final" ? (
                  this.renderIncrementor(() => this.onIncrementScorePress(this.state.reversed, rightScore))
                ) : (
                    <View />
                  )}
              </View>
            </View>
          }

          {/* Scores / Set */}
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 2, marginLeft: 8, marginRight: 8 }}>
              <AnimatedScore score={leftScore} style={scoreStyle} />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>{this.renderSet()}</View>
            <View style={{ flex: 2, marginLeft: 8, marginRight: 8 }}>
              <AnimatedScore score={rightScore} style={scoreStyle} />
            </View>
          </View>

          {/* Decrementers */}
          {canScore &&
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 2 }}>
                {game.currentSet !== "Final" ? (
                  this.renderDecrementor(() => this.onDecrementScorePress(!this.state.reversed, leftScore))
                ) : (
                    <View />
                  )}
              </View>
              <View style={{ flex: 1 }}>{this.renderDecrementor(() => this.onDecrementSetPress())}</View>
              <View style={{ flex: 2 }}>
                {game.currentSet !== "Final" ? (
                  this.renderDecrementor(() => this.onDecrementScorePress(this.state.reversed, rightScore))
                ) : (
                    <View />
                  )}
              </View>
            </View>
          }

          {/* Set Scores */}
          {this.state.orientation === "portrait" &&
            <SetScores game={game} reversed={reversed} style={{ marginBottom: 16, marginTop: 16 }} />
          }

          <View style={{ flex: 1 }}>
            {this.state.orientation === "portrait" && this.renderPosts()}
          </View>
        </Animated.ScrollView>

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
        //unfavoriteAction: !canScore && this.props.isSavedGame ? () => this.onUnfavoriteGamePress(false) : undefined,
        //favoriteAction: !canScore && !this.props.isSavedGame ? () => this.onFavoriteGamePress() : undefined,
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
  const { data, gameFetchSucceeded } = state.game;
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
  let isSavedGame = false;
  const { savedGames, savedScorekeepers } = state;
  const foundGame = _.find(savedGames, function (o) {
    return o.gameUid === gameUid;
  });

  if (foundGame) {
    isSavedGame = true;
  }

  const foundScorekeeper = _.find(savedScorekeepers, function (o) {
    return o.userId === game.userId;
  })

  if (foundScorekeeper) {
    isSavedGame = true;
  }

  return {
    gameUid,
    game,
    gameFetchSucceeded,
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
      saveScorekeeper,
      updateGameScore,
      updateGameLocation,
      updateCurrentSet,
      unfetchGameById,
      unSaveGame,
      unSaveScorekeeper
    }
  )(Scoreboard)
);
