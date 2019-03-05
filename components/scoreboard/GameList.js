import _ from "lodash";
import moment from "moment";
import React from "react";
import { Alert, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { AdMobInterstitial, Icon } from "expo";
import { human, iOSColors } from "react-native-typography";
import { SwipeListView } from "react-native-swipe-list-view";
import Colors from "../../constants/Colors";
import timeHelpers from "../../timeHelpers";
import getEnvVars from "../../environment"

const initialState = {};

export default class GameList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  async componentDidMount() {
    AdMobInterstitial.setAdUnitID(getEnvVars.adMobUnitIDScoreboardInterstitial);
    AdMobInterstitial.setTestDeviceID("EMULATOR");
  }

  showInterstitial = async () => {
    await AdMobInterstitial.requestAdAsync().catch(error => console.log(error));
    await AdMobInterstitial.showAdAsync().catch(error => console.log(error));
  }

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  onEditRow = (rowMap, item) => e => {
    this.closeRow(rowMap, item.gameUid);

    if (this.props.onGameEditPress) {
      this.props.onGameEditPress(item);
    }
  };

  onDeleteRow = (rowMap, item) => e => {
    this.closeRow(rowMap, item.gameUid);

    if (this.props.onGameDeletePress) {
      this.props.onGameDeletePress(item);
    }
  };

  onFavoritePress = (rowMap, item) => e => {
    Alert.alert(
      "What do you want to favorite?",
      `Selecting SCOREKEEPER will add all current and future games scored by ${item.displayName} to your favorites.`,
      [
        {
          text: "SCOREKEEPER",
          onPress: () => {
            this.closeRow(rowMap, item.gameUid);
            this.props.onScorekeeperFavoritePress(item);
          }
        },
        {
          text: "GAME",
          onPress: () => {
            this.closeRow(rowMap, item.gameUid);
            this.props.onGameFavoritePress(item);
          }
        },
        {
          text: "CANCEL",
          onPress: () => {
            this.closeRow(rowMap, item.gameUid);
          }
        }
      ],
      { cancelable: false }
    );

    // this.closeRow(rowMap, item.gameUid);
    // this.props.onGameFavoritePress(item);
    //this.showInterstitial();
  };

  onUnfavoritePress = (rowMap, item) => e => {
    this.closeRow(rowMap, item.gameUid);
    this.props.onGameUnfavoritePress(item);
    this.props.onScorekeeperUnfavoritePress(item);
  };

  onRowDidOpen = (rowKey, rowMap) => {
    setTimeout(() => {
      this.closeRow(rowMap, rowKey);
    }, 2000);
  };

  getScore = game => {
    const currentSet = game.currentSet === "Final" ? 6 : game.currentSet;
    const score = { homeTeamScore: 0, awayTeamScore: 0 };

    game.sets.map(function (set, i) {
      if (i < currentSet) {
        if (set.awayTeamScore > set.homeTeamScore) {
          score.awayTeamScore++;
        } else if (set.awayTeamScore < set.homeTeamScore) {
          score.homeTeamScore++;
        }
      }
    });

    return score;
  };

  isSavedGame = item => {
    const { savedGames, savedScorekeepers } = this.props;
    const foundGame = _.find(savedGames, function (o) {
      return o.gameUid === item.gameUid;
    });

    if (foundGame) {
      return true;
    }

    const foundScorekeeper = _.find(savedScorekeepers, function (o){
      return o.userId === item.userId;
    })

    if (foundScorekeeper){
      return true;
    }

    return false;
  };

  isWinner = (home, game) => {
    if (game.currentSet === "Final") {
      const score = this.getScore(game);

      if (home) {
        return score.homeTeamScore > score.awayTeamScore;
      } else {
        return score.homeTeamScore < score.awayTeamScore;
      }
    }

    return false;
  };

  renderFavoriteButton = (rowMap, item) => {
    const { onGameUnfavoritePress } = this.props;

    const isSavedGame = this.isSavedGame(item);

    if (onGameUnfavoritePress) {
      return (
        <TouchableOpacity
          style={[styles.backRightBtn]}
          onPress={this.onUnfavoritePress(rowMap, item)}
        >
          <Icon.MaterialCommunityIcons
            name={isSavedGame ? "heart-off" : "heart-outline"}
            size={26}
            color={iOSColors.white}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
      );
    }
  };

  renderEditGameButton = (rowMap, item) => {
    const { onGameEditPress } = this.props;

    if (onGameEditPress) {
      return (
        <TouchableOpacity style={[styles.backRightBtn]} onPress={this.onEditRow(rowMap, item)}>
          <Icon.MaterialIcons name="edit" size={26} color={iOSColors.white} style={{ paddingRight: 5 }} />
        </TouchableOpacity>
      );
    }
  };

  renderDeleteGameButton = (rowMap, item) => {
    const { onGameDeletePress } = this.props;

    if (onGameDeletePress) {
      return (
        <TouchableOpacity style={[styles.backRightBtn]} onPress={this.onDeleteRow(rowMap, item)}>
          <Icon.MaterialIcons name="delete" size={26} color={iOSColors.white} style={{ paddingRight: 5 }} />
        </TouchableOpacity>
      );
    }
  };

  renderGameItem = game => {
    const { onGamePress } = this.props;

    return (
      <TouchableHighlight onPress={onGamePress(game)} style={styles.rowFront} underlayColor={iOSColors.lightGray2}>
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 3, borderRightColor: iOSColors.lightGray, borderRightWidth: 1 }}>
              <View style={{ flex: 1, flexDirection: "row", marginRight: 5 }}>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={this.isWinner(false, game) ? styles.winner : styles.loser}>
                    {game.awayTeamName}
                  </Text>
                  <Text numberOfLines={1} style={this.isWinner(true, game) ? styles.winner : styles.loser}>
                    {game.homeTeamName}
                  </Text>
                </View>

                {game.sets.map((set, i) => {
                  if (
                    i <= game.currentSet ||
                    (game.currentSet === "Final" && (set.homeTeamScore > 0 || set.awayTeamScore > 0))
                  ) {
                    return (
                      <View key={i} style={{ marginRight: 5 }}>
                        <Text
                          style={[this.isWinner(false, game) ? styles.winner : styles.loser, { textAlign: "center" }]}
                        >
                          {set.awayTeamScore}
                        </Text>
                        <Text
                          style={[this.isWinner(true, game) ? styles.winner : styles.loser, { textAlign: "center" }]}
                        >
                          {set.homeTeamScore}
                        </Text>
                      </View>
                    );
                  }
                })}
              </View>
              <Text numberOfLines={1} style={[human.footnote, { color: iOSColors.gray, marginTop: 3 }]}>
                {`${game.venueName}, ${game.address || "Unknown address"}`}
              </Text>
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <View style={{ backgroundColor: Colors.primaryLightColor, borderRadius: 5, padding: 3 }}>
                <Text numberOfLines={1} style={[human.footnoteWhite, { textAlign: "center" }]}>
                  {game.currentSet === "Final" ? "Final" : "Set " + game.currentSet}
                </Text>
              </View>
              <View style={{ marginTop: 4 }}>
                <Text numberOfLines={1} style={[human.footnote, { color: iOSColors.gray, marginLeft: 2 }]}>
                  {timeHelpers.timeAgo(game.lastUpdate)}
                </Text>
              </View>
              <View style={{ marginTop: 4 }}>
                <Text numberOfLines={1} style={[human.footnote, { color: iOSColors.gray, marginLeft: 2 }]}>
                  {game.displayName}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { data, disableLeftSwipe, disableRightSwipe, onGameEditPress, onGameDeletePress, onGameFavoritePress, onGameUnfavoritePress } = this.props;

    let rightOpenValue = -10;
    const defaultWidth = 60;

    rightOpenValue -= onGameEditPress ? defaultWidth : 0;
    rightOpenValue -= onGameDeletePress ? defaultWidth : 0;
    rightOpenValue -= onGameUnfavoritePress ? defaultWidth : 0;

    return (
      <SwipeListView
        useFlatList
        disableRightSwipe={ disableRightSwipe }        
        disableLeftSwipe={ disableLeftSwipe }
        data={data}
        keyExtractor={item => item.gameUid}
        renderItem={(data, rowMap) => {
          return this.renderGameItem(data.item);
        }}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            {this.renderFavoriteButton(rowMap, data.item)}
            {this.renderEditGameButton(rowMap, data.item)}
            {this.renderDeleteGameButton(rowMap, data.item)}
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={rightOpenValue}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={this.onRowDidOpen}
      />
    );
  }
}

const styles = StyleSheet.create({
  backTextWhite: {
    color: iOSColors.white
  },
  rowFront: {
    backgroundColor: iOSColors.white,
    borderBottomColor: iOSColors.lightGray2,
    borderBottomWidth: 1,
    padding: 10
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: iOSColors.gray,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  backRightBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60
  },
  winner: {
    ...human.headlineObject,
    color: Colors.secondaryColor
  },
  loser: {
    ...human.bodyObject
  }
});
